package user

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	database "github.com/quizrr/db"
	"golang.org/x/crypto/bcrypt"
)

type UserRegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserDetails struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type BoardList struct {
	ID        uint   `gorm:"primaryKey"`        // ID is the primary key for the board list
	Title     string `gorm:"size:255;not null"` // Title is the name of the board, with a max length of 255 characters
	IsVisible bool   `gorm:"default:true"`      // IsVisible indicates whether the board is visible or not, with a default value of true
}

type ProfileData struct {
	UserID      uint           `json:"user_id"`
	Username    string         `json:"username"`
	DisplayName sql.NullString `json:"displayname"`
	Email       string         `json:"email"`
	PhoneNo     sql.NullString `json:"phone_no"`
	Country     sql.NullString `json:"country"`
	State       sql.NullString `json:"state"`
	City        sql.NullString `json:"city"`
	PinCode     sql.NullString `json:"pin_code"`
	Standard    sql.NullString `json:"standard"`
	Board       sql.NullString `json:"board"`
	OnBoarding  sql.NullBool   `json:"onboarding"`
}

type Notebook struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Topic     string    `json:"topic"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

var jwtSecret = os.Getenv("JWT_SECRET")

func Register(c *fiber.Ctx) error {
	// Parse request body
	var requestBody UserRegisterRequest
	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate request fields
	if requestBody.Username == "" || requestBody.Email == "" || requestBody.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	// Hash the password
	hashedPassword, err := HashPassword(requestBody.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash the password",
		})
	}

	// Insert user into the users table using raw SQL
	query := `
		INSERT INTO users (username, email, password)
		VALUES ($1, $2, $3) RETURNING id
	`

	// Execute the query with the hashed password
	var userID int
	err = database.DB.QueryRow(context.Background(), query, requestBody.Username, requestBody.Email, hashedPassword).Scan(&userID)
	if err != nil {
		log.Println("Failed to create user:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to register user",
		})
	}

	// Insert corresponding row into the profiles table with default/null values
	profileQuery := `
		INSERT INTO profiles (user_id) 
		VALUES ($1)
	`
	_, err = database.DB.Exec(context.Background(), profileQuery, userID)
	if err != nil {
		log.Println("Failed to create profile:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user profile",
		})
	}

	// Respond with success
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User registered successfully",
		"user_id": userID,
	})
}

func Login(c *fiber.Ctx) error {
	// Parse request body
	var requestBody UserLoginRequest
	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate request fields
	if requestBody.Email == "" || requestBody.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}

	// Fetch the user details from the database using email
	query := `SELECT id, username, password, email FROM users WHERE email = $1`
	var user UserDetails
	var hashedPassword string

	err := database.DB.QueryRow(context.Background(), query, requestBody.Email).Scan(&user.ID, &user.Username, &hashedPassword, &user.Email)
	if err != nil {
		log.Println("Failed to find user:", err)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Compare the provided password with the hashed password
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(requestBody.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Update the lastlogin timestamp
	updateQuery := `UPDATE users SET lastlogin = NOW() WHERE id = $1`
	_, err = database.DB.Exec(context.Background(), updateQuery, user.ID)
	if err != nil {
		log.Println("Failed to update last login time:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not update last login time",
		})
	}

	// Fetch profile data for the logged-in user
	var profile ProfileData
	profileQuery := `
		SELECT 
			phone_no, country, state, city, pincode, standard, board, onboarding
		FROM profiles
		WHERE user_id = $1
	`
	err = database.DB.QueryRow(context.Background(), profileQuery, user.ID).Scan(
		&profile.PhoneNo,
		&profile.Country,
		&profile.State,
		&profile.City,
		&profile.PinCode,
		&profile.Standard,
		&profile.Board,
		&profile.OnBoarding,
	)
	if err != nil {
		log.Println("Failed to retrieve profile data:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not retrieve profile data",
		})
	}

	// Generate JWT token
	token, err := generateJWTToken(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

	// Respond with success and return the JWT token, user data, and profile data
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login successful",
		"user": fiber.Map{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
		"profile": fiber.Map{
			"phone_no":   profile.PhoneNo,
			"country":    profile.Country,
			"state":      profile.State,
			"city":       profile.City,
			"pincode":    profile.PinCode,
			"standard":   profile.Standard,
			"board":      profile.Board,
			"onboarding": profile.OnBoarding,
		},
		"token": token,
	})
}

func generateJWTToken(user UserDetails) (string, error) {
	// Ensure that the JWT secret is fetched correctly
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT_SECRET environment variable is not set")
	}

	// Create a new JWT token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"exp":      time.Now().Add(time.Hour * 72).Unix(), // Token expires in 72 hours
	})

	// Sign the token with the secret key (convert jwtSecret to []byte)
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func GetBoardList(c *fiber.Ctx) error {
	var boards []struct {
		Fname string `json:"full_name"`
		Sname string `json:"short_name"`
	}

	// Define the query to select the full_name and short_name from board_lists
	query := `SELECT full_name AS fname, short_name AS sname FROM board_lists`

	// Execute the query and get the rows
	rows, err := database.DB.Query(context.Background(), query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch board list",
		})
	}
	defer rows.Close()

	// Loop through the rows and append the results to the boards slice
	for rows.Next() {
		var board struct {
			Fname string `json:"full_name"`
			Sname string `json:"short_name"`
		}
		if err := rows.Scan(&board.Fname, &board.Sname); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Error while scanning board data",
			})
		}
		boards = append(boards, board)
	}

	// Check for errors after row iteration
	if rows.Err() != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch board list",
		})
	}

	// Return the list of boards as a JSON response
	return c.JSON(boards)
}

func GetAllProfileData(c *fiber.Ctx) error {
	// Extract the token from the Authorization header
	tokenStr := c.Get("Authorization")[7:] // Skip "Bearer "

	var jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}

		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Extract the claims from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Safely extract the user ID and ensure it exists
	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	// Assert userIDInterface to float64 and convert to uint
	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	// ProfileData struct with sql.NullString for nullable fields

	var profileData ProfileData
	query := `
		SELECT 
			u.id AS user_id,
			u.username,
			u.displayname,
			u.email,
			p.phone_no,
			p.country,
			p.state,
			p.city,
			p.pincode,
			p.standard,
			p.board
		FROM users u
		JOIN profiles p ON u.id = p.user_id
		WHERE u.id = $1
	`
	row := database.DB.QueryRow(context.Background(), query, userID)
	if err := row.Scan(
		&profileData.UserID,
		&profileData.Username,
		&profileData.DisplayName,
		&profileData.Email,
		&profileData.PhoneNo,
		&profileData.Country,
		&profileData.State,
		&profileData.City,
		&profileData.PinCode,
		&profileData.Standard,
		&profileData.Board,
	); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error while scanning profile data",
		})
	}

	// Return the profile data as a JSON response
	return c.JSON(fiber.Map{
		"user_id":     profileData.UserID,
		"username":    profileData.Username,
		"displayname": profileData.DisplayName.String, // Use .String for sql.NullString
		"email":       profileData.Email,
		"phone_no":    profileData.PhoneNo.String,
		"country":     profileData.Country.String,
		"state":       profileData.State.String,
		"city":        profileData.City.String,
		"pin_code":    profileData.PinCode.String,
		"standard":    profileData.Standard.String,
		"board":       profileData.Board.String,
	})
}

func SetPortfolioData(c *fiber.Ctx) error {
	// Extract the token from the Authorization header
	tokenStr := c.Get("Authorization")
	if len(tokenStr) < 7 || tokenStr[:7] != "Bearer " {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid token"})
	}
	tokenStr = tokenStr[7:] // Skip "Bearer "

	var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

	// Parse and validate the token
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtSecret, nil // Use your actual secret key
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Extract claims from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	// Safely extract the user ID
	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	// Assert userIDInterface to float64 and convert to uint
	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	// Debug: Print incoming request body
	log.Println("Raw Body:", string(c.Body()))

	// Parse the x-www-form-urlencoded input data
	input := new(struct {
		Board       string `form:"board"`
		PhoneNo     string `form:"phone_no"`
		Country     string `form:"country"`
		State       string `form:"state"`
		City        string `form:"city"`
		PinCode     string `form:"pincode"`
		Standard    string `form:"standard"`
		DisplayName string `form:"displayname"` // Add display_name here
	})

	// Use BodyParser to parse the body directly into the struct
	if err := c.BodyParser(input); err != nil {
		log.Println("BodyParser Error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Create a map from the struct
	parsedInput := map[string]interface{}{
		"board":       input.Board,
		"phone_no":    input.PhoneNo,
		"country":     input.Country,
		"state":       input.State,
		"city":        input.City,
		"pincode":     input.PinCode,
		"standard":    input.Standard,
		"displayname": input.DisplayName, // Include display_name here
	}

	// Ensure that exactly one property is provided for the update
	count := 0
	var column string
	var value interface{}

	for key, val := range parsedInput {
		if val != "" {
			count++
			column = key
			value = val
		}
	}

	if count != 1 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Only one property should be provided"})
	}

	// Define allowed columns for profiles and users tables
	allowedProfileColumns := map[string]bool{
		"phone_no": true, "country": true, "state": true, "city": true,
		"pincode": true, "standard": true, "board": true,
	}
	allowedUserColumns := map[string]bool{
		"displayname": true,
	}

	// Update the appropriate table based on the column
	if allowedProfileColumns[column] {
		// Update the profile table if the column belongs to profiles
		query := fmt.Sprintf(`UPDATE profiles SET %s = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, column)
		_, err = database.DB.Exec(context.Background(), query, value, userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile data"})
		}
	} else if allowedUserColumns[column] {
		// Update the users table if the column belongs to users
		query := fmt.Sprintf(`UPDATE users SET %s = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, column)
		_, err = database.DB.Exec(context.Background(), query, value, userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user data"})
		}
	} else {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid property"})
	}

	var profileData ProfileData
	fetchProfileQuery := `
		SELECT 
			id,
			phone_no,
			country,
			state,
			city,
			pincode,
			standard,
			board,
			onboarding
		FROM profiles
		WHERE id = $1
	`
	row := database.DB.QueryRow(context.Background(), fetchProfileQuery, userID)
	if err := row.Scan(
		&profileData.UserID,
		&profileData.PhoneNo,
		&profileData.Country,
		&profileData.State,
		&profileData.City,
		&profileData.PinCode,
		&profileData.Standard,
		&profileData.Board,
		&profileData.OnBoarding,
	); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error fetching updated profile data"})
	}

	// Fetch display_name from users table
	var displayName sql.NullString
	fetchUserQuery := `SELECT displayname FROM users WHERE id = $1`
	err = database.DB.QueryRow(context.Background(), fetchUserQuery, userID).Scan(&displayName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error fetching user data"})
	}

	// Add display_name to the response
	profileData.DisplayName = displayName

	return c.JSON(profileData)
}

func GetNotesList(c *fiber.Ctx) error {
	// Extract the token from the Authorization header
	tokenStr := c.Get("Authorization")
	if len(tokenStr) < 7 || tokenStr[:7] != "Bearer " {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid token"})
	}
	tokenStr = tokenStr[7:] // Skip "Bearer "
	var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

	// Parse and validate the token
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtSecret, nil // Use your actual secret key
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Extract claims from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	// Safely extract the user ID
	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	// Assert userIDInterface to float64 and convert to uint
	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	// Query to fetch notebooks for the user
	query := `
		SELECT 
			id, 
			user_id, 
			topic, 
			content, 
			created_at, 
			updated_at 
		FROM notebooks 
		WHERE user_id = $1
	`

	// Execute the query
	rows, err := database.DB.Query(context.Background(), query, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve notebooks"})
	}
	defer rows.Close() // Ensure rows are closed after processing

	var notebooks []Notebook

	// Iterate over the rows and scan the data into Notebook struct
	for rows.Next() {
		var notebook Notebook
		if err := rows.Scan(
			&notebook.ID,
			&notebook.UserID,
			&notebook.Topic,
			&notebook.Content,
			&notebook.CreatedAt,
			&notebook.UpdatedAt,
		); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error scanning notebook data"})
		}
		notebooks = append(notebooks, notebook)
	}

	// Check for any error that occurred during iteration
	if err := rows.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error iterating over notebooks"})
	}

	// Return the list of notebooks as a JSON response
	return c.JSON(notebooks)
}

func CreateNote(c *fiber.Ctx) error {
	// Extract the token from the Authorization header
	tokenStr := c.Get("Authorization")[7:] // Skip "Bearer "
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Check the token signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(jwtSecret), nil // Use your actual secret key
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Extract the claims from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Safely extract the user ID
	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	// Assert userIDInterface to float64 and convert to uint
	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	// Parse the request body to get notebook data
	var input struct {
		Topic   string `json:"topic"`
		Content string `json:"content"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Prepare the insert query
	query := `
		INSERT INTO notebooks (user_id, topic, content, created_at, updated_at) 
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
		RETURNING id
	`

	// Execute the query
	var notebookID uint
	err = database.DB.QueryRow(context.Background(), query, userID, input.Topic, input.Content).Scan(&notebookID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create notebook entry"})
	}

	// Create a response object with the newly created notebook
	newNotebook := Notebook{
		ID:        notebookID,
		UserID:    userID,
		Topic:     input.Topic,
		Content:   input.Content,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Return the created notebook entry as a JSON response
	return c.Status(fiber.StatusCreated).JSON(newNotebook)
}

func DeleteNote(c *fiber.Ctx) error {
	// Extract the token from the Authorization header
	tokenStr := c.Get("Authorization")[7:] // Skip "Bearer "
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Check the token signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(jwtSecret), nil // Use your actual secret key
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Extract the claims from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Safely extract the user ID and ensure it exists
	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	// Assert userIDInterface to float64 and convert to uint
	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	// Get the note ID from the URL parameter
	noteID, err := strconv.Atoi(c.Params("id")) // Assuming the note ID is passed in the URL as /note/:id
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid note ID"})
	}

	// Prepare the delete query
	query := `DELETE FROM notebooks WHERE id = $1 AND user_id = $2`
	result, err := database.DB.Exec(context.Background(), query, noteID, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete notebook entry"})
	}

	// Check if any rows were affected
	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notebook not found or you do not have permission to delete it"})
	}

	// Return success response
	return c.JSON(fiber.Map{"message": "Notebook deleted successfully"})
}

func UpdateNote(c *fiber.Ctx) error {
	// Extract the token from the Authorization header
	tokenStr := c.Get("Authorization")[7:] // Skip "Bearer "
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Check the token signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(jwtSecret), nil // Use your actual secret key
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Extract the claims from the token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Safely extract the user ID and ensure it exists
	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	// Assert userIDInterface to float64 and convert to uint
	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	// Get the note ID from the URL route parameter
	noteID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid note ID"})
	}

	// Parse the request body to get the updated note details
	var input struct {
		Topic   string `json:"topic"`
		Content string `json:"content"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validate that the topic and content are not empty
	if input.Topic == "" || input.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Topic and content must not be empty"})
	}

	// Update the notebook entry for the given note ID and user ID
	query := `
		UPDATE notebooks 
		SET topic = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
		WHERE id = $3 AND user_id = $4
	`
	result, err := database.DB.Exec(context.Background(), query, input.Topic, input.Content, noteID, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update note"})
	}

	// Check if any rows were affected
	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found or no changes made"})
	}

	// Fetch the updated note to return as a response
	var updatedNote struct {
		ID        int       `json:"id"`
		UserID    uint      `json:"user_id"`
		Topic     string    `json:"topic"`
		Content   string    `json:"content"`
		CreatedAt time.Time `json:"created_at"`
		UpdatedAt time.Time `json:"updated_at"`
	}
	fetchQuery := `
		SELECT id, user_id, topic, content, created_at, updated_at 
		FROM notebooks 
		WHERE id = $1 AND user_id = $2
	`
	err = database.DB.QueryRow(context.Background(), fetchQuery, noteID, userID).Scan(
		&updatedNote.ID, &updatedNote.UserID, &updatedNote.Topic, &updatedNote.Content, &updatedNote.CreatedAt, &updatedNote.UpdatedAt,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch updated note"})
	}

	// Return the updated note as a JSON response
	return c.JSON(updatedNote)
}
