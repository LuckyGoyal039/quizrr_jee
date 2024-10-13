package user

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jackc/pgx"
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
	ID        uint   `gorm:"primaryKey"`
	Title     string `gorm:"size:255;not null"`
	IsVisible bool   `gorm:"default:true"`
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
	PinCode     sql.NullString `json:"pincode"`
	Standard    sql.NullString `json:"standard"`
	Board       sql.NullString `json:"board"`
	OnBoarding  sql.NullBool   `json:"onboarding"`
	Valid       bool           `json:"-"`
}

type Notebook struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Topic     string    `json:"topic"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func Register(c *fiber.Ctx) error {

	var requestBody UserRegisterRequest
	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if requestBody.Username == "" || requestBody.Email == "" || requestBody.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	hashedPassword, err := HashPassword(requestBody.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash the password",
		})
	}

	query := `
		INSERT INTO users (username, email, password)
		VALUES ($1, $2, $3) RETURNING id
	`
	var userID int
	err = database.DB.QueryRow(context.Background(), query, requestBody.Username, requestBody.Email, hashedPassword).Scan(&userID)
	if err != nil {
		log.Println("Failed to create user:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to register user",
		})
	}

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

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User registered successfully",
		"user_id": userID,
	})
}

func Login(c *fiber.Ctx) error {
	var requestBody UserLoginRequest
	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if requestBody.Email == "" || requestBody.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}

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

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(requestBody.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	updateQuery := `UPDATE users SET lastlogin = NOW() WHERE id = $1`
	_, err = database.DB.Exec(context.Background(), updateQuery, user.ID)
	if err != nil {
		log.Println("Failed to update last login time:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not update last login time",
		})
	}

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

	token, err := generateJWTToken(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

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

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT_SECRET environment variable is not set")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"exp":      time.Now().Add(time.Hour * 200).Unix(),
	})

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

	query := `SELECT full_name AS fname, short_name AS sname FROM board_lists`

	rows, err := database.DB.Query(context.Background(), query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch board list",
		})
	}
	defer rows.Close()

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

	if rows.Err() != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch board list",
		})
	}

	return c.JSON(boards)
}

func GetAllProfileData(c *fiber.Ctx) error {

	tokenStr := c.Get("Authorization")[7:]
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}

		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

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

	return c.JSON(fiber.Map{
		"user_id":     profileData.UserID,
		"username":    profileData.Username,
		"displayname": profileData.DisplayName.String,
		"email":       profileData.Email,
		"phone_no":    profileData.PhoneNo.String,
		"country":     profileData.Country.String,
		"state":       profileData.State.String,
		"city":        profileData.City.String,
		"pincode":     profileData.PinCode.String,
		"standard":    profileData.Standard.String,
		"board":       profileData.Board.String,
	})
}

func SetPortfolioData(c *fiber.Ctx) error {

	tokenStr := c.Get("Authorization")
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	if len(tokenStr) < 7 || tokenStr[:7] != "Bearer " {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid token"})
	}
	tokenStr = tokenStr[7:]

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	log.Println("Raw Body:", string(c.Body()))

	input := new(struct {
		Board       string `form:"board"`
		PhoneNo     string `form:"phone_no"`
		Country     string `form:"country"`
		State       string `form:"state"`
		City        string `form:"city"`
		PinCode     string `form:"pincode"`
		Standard    string `form:"standard"`
		DisplayName string `form:"displayname"`
		OnBoarding  bool   `form:"onboarding"`
	})

	if err := c.BodyParser(input); err != nil {
		log.Println("BodyParser Error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	parsedInput := map[string]interface{}{
		"board":       input.Board,
		"phone_no":    input.PhoneNo,
		"country":     input.Country,
		"state":       input.State,
		"city":        input.City,
		"pincode":     input.PinCode,
		"standard":    input.Standard,
		"displayname": input.DisplayName,
		"onboarding":  input.OnBoarding,
	}

	count := 0
	var column string
	var value interface{}

	for key, val := range parsedInput {
		switch v := val.(type) {
		case string:
			if v != "" {
				count++
				column = key
				value = val
			}
		case bool:
			if val == true {
				count++
				column = key
				value = val
			}
		}
	}

	if count != 1 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Only one property should be provided"})
	}

	allowedProfileColumns := map[string]bool{
		"phone_no": true, "country": true, "state": true, "city": true,
		"pincode": true, "standard": true, "board": true, "onboarding": true,
	}
	allowedUserColumns := map[string]bool{
		"displayname": true,
	}

	if allowedProfileColumns[column] {
		query := fmt.Sprintf(`UPDATE profiles SET %s = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`, column)
		_, err = database.DB.Exec(context.Background(), query, value, userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile data"})
		}
	} else if allowedUserColumns[column] {
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
			user_id,
			phone_no,
			country,
			state,
			city,
			pincode,
			standard,
			board,
			onboarding
		FROM profiles
		WHERE user_id = $1
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

	var displayName sql.NullString
	fetchUserQuery := `SELECT displayname FROM users WHERE id = $1`
	err = database.DB.QueryRow(context.Background(), fetchUserQuery, userID).Scan(&displayName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error fetching user data"})
	}

	profileData.DisplayName = displayName

	return c.JSON(fiber.Map{
		"user_id":     profileData.UserID,
		"phone_no":    profileData.PhoneNo.String,
		"country":     profileData.Country.String,
		"state":       profileData.State.String,
		"city":        profileData.City.String,
		"pincode":     profileData.PinCode.String,
		"standard":    profileData.Standard.String,
		"board":       profileData.Board.String,
		"displayname": profileData.DisplayName.String,
		"onboarding":  profileData.OnBoarding.Bool,
	})
}

func GetNotesList(c *fiber.Ctx) error {

	tokenStr := c.Get("Authorization")
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	if len(tokenStr) < 7 || tokenStr[:7] != "Bearer " {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing or invalid token"})
	}
	tokenStr = tokenStr[7:]

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

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
	rows, err := database.DB.Query(context.Background(), query, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve notebooks"})
	}
	defer rows.Close()

	var notebooks []Notebook
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

	if err := rows.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Error iterating over notebooks"})
	}

	return c.JSON(notebooks)
}

func CreateNote(c *fiber.Ctx) error {
	tokenStr := c.Get("Authorization")[7:]
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	var input struct {
		Topic   string `json:"topic"`
		Content string `json:"content"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	query := `
		INSERT INTO notebooks (user_id, topic, content, created_at, updated_at) 
		VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
		RETURNING id
	`
	var notebookID uint
	err = database.DB.QueryRow(context.Background(), query, userID, input.Topic, input.Content).Scan(&notebookID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create notebook entry"})
	}

	newNotebook := Notebook{
		ID:        notebookID,
		UserID:    userID,
		Topic:     input.Topic,
		Content:   input.Content,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	return c.Status(fiber.StatusCreated).JSON(newNotebook)
}

func DeleteNote(c *fiber.Ctx) error {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	tokenStr := c.Get("Authorization")[7:]
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	noteID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid note ID"})
	}

	query := `DELETE FROM notebooks WHERE id = $1 AND user_id = $2`
	result, err := database.DB.Exec(context.Background(), query, noteID, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete notebook entry"})
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notebook not found or you do not have permission to delete it"})
	}

	return c.JSON(fiber.Map{"message": "Notebook deleted successfully"})
}

func UpdateNote(c *fiber.Ctx) error {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	tokenStr := c.Get("Authorization")[7:]
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	noteID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid note ID"})
	}

	var input struct {
		Topic   string `json:"topic"`
		Content string `json:"content"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if input.Topic == "" || input.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Topic and content must not be empty"})
	}

	query := `
		UPDATE notebooks 
		SET topic = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
		WHERE id = $3 AND user_id = $4
	`
	result, err := database.DB.Exec(context.Background(), query, input.Topic, input.Content, noteID, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update note"})
	}

	rowsAffected := result.RowsAffected()

	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Note not found or no changes made"})
	}

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

	return c.JSON(updatedNote)
}

// Question struct to hold question details
type TestSeries struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Duration    int    `json:"duration"`
	Image       string `json:"image"`  // Added image field
	Batch       string `json:"batch"`  // Added batch field
	Target      string `json:"target"` // Added target field
}

func GetTestSeriesList(c *fiber.Ctx) error {
	query := `
		SELECT id, name, description, duration, image, batch, target 
		FROM test_series;
	`
	rows, err := database.DB.Query(context.Background(), query)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve test series"})
	}
	defer rows.Close()

	var testSeriesList []TestSeries

	for rows.Next() {
		var ts TestSeries

		// Updated to include all fields from the query
		if err := rows.Scan(&ts.ID, &ts.Name, &ts.Description, &ts.Duration, &ts.Image, &ts.Batch, &ts.Target); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to scan test series"})
		}

		testSeriesList = append(testSeriesList, ts)
	}

	if err = rows.Err(); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error while iterating rows"})
	}

	return c.Status(http.StatusOK).JSON(testSeriesList)
}

func GetTestData(c *fiber.Ctx) error {
	// Define the TestSeries struct
	type TestSeries struct {
		ID          int       `json:"id"`
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Duration    int       `json:"duration"`
		Questions   []int     `json:"questions"` // Array of question IDs
		CreatedAt   time.Time `json:"created_at"`
		UpdatedAt   time.Time `json:"updated_at"`
	}

	// Define the updated Question struct
	type Question struct {
		ID        int                    `json:"id"`
		Text      string                 `json:"text"`
		Image     *string                `json:"image,omitempty"`
		Subject   string                 `json:"subject"`
		Section   string                 `json:"section"`
		Options   map[string]interface{} `json:"options"`
		Answer    map[string]interface{} `json:"answer"`
		CreatedAt time.Time              `json:"created_at"`
		UpdatedAt time.Time              `json:"updated_at"`
	}

	// Get the testID from URL parameters
	testID := c.Params("testId")

	// Query to retrieve the test series by ID
	query := `
		SELECT id, name, description, duration, created_at, updated_at, questions
		FROM test_series
		WHERE id = $1;
	`

	var ts TestSeries

	// Execute query to get TestSeries data
	err := database.DB.QueryRow(context.Background(), query, testID).Scan(
		&ts.ID, &ts.Name, &ts.Description, &ts.Duration, &ts.CreatedAt, &ts.UpdatedAt, &ts.Questions,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Test series not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve test series"})
	}

	// Fetch all the questions based on the IDs from ts.Questions
	if len(ts.Questions) > 0 {
		// Prepare query for questions using the array of question IDs
		questionsQuery := `
			SELECT id, text, image, subject, section, options, answer, created_at, updated_at
			FROM questions
			WHERE id = ANY($1);
		`

		// Create a slice to hold the questions data
		var questions []Question

		// Execute query to get all the questions
		rows, err := database.DB.Query(context.Background(), questionsQuery, ts.Questions)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve questions"})
		}
		defer rows.Close()

		// Iterate over the rows and scan each question into the slice
		for rows.Next() {
			var q Question
			var image *string // Handle nullable image field
			err := rows.Scan(&q.ID, &q.Text, &image, &q.Subject, &q.Section, &q.Options, &q.Answer, &q.CreatedAt, &q.UpdatedAt)
			if err != nil {
				return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to scan question data"})
			}
			q.Image = image
			questions = append(questions, q)
		}

		// Combine the test series data with the questions
		response := fiber.Map{
			"id":          ts.ID,
			"name":        ts.Name,
			"description": ts.Description,
			"duration":    ts.Duration,
			"created_at":  ts.CreatedAt,
			"updated_at":  ts.UpdatedAt,
			"questions":   questions, // Include full question details
		}

		// Return the combined data as JSON
		return c.Status(http.StatusOK).JSON(response)
	}

	// If there are no questions, just return the test series data
	return c.Status(http.StatusOK).JSON(ts)
}

func SubmitTest(c *fiber.Ctx) error {
	tokenStr := c.Get("Authorization")[7:]
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	userIDInterface, exists := claims["id"]
	if !exists {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID not found in token"})
	}

	userIDFloat, ok := userIDInterface.(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid user ID type"})
	}
	userID := uint(userIDFloat)

	// Parse the request body to get the test data
	var input struct {
		TestID    int            `json:"testId"`
		Questions map[int]string `json:"questions"` // {questionId: selectedOptionId (as string)}
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Fetch questions from the database
	questionIDs := make([]int, 0, len(input.Questions))
	for questionID := range input.Questions {
		questionIDs = append(questionIDs, questionID)
	}

	query := `SELECT id, text, image, subject, section, options, answer FROM questions WHERE id = ANY($1)`
	rows, err := database.DB.Query(context.Background(), query, questionIDs)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch questions"})
	}
	defer rows.Close()

	// Prepare result data
	resultData := make(map[int]interface{}) // This will hold the JSONB data for the result
	correctAnswers := 0
	incorrectAnswers := 0

	// Process each question
	for rows.Next() {
		var questionID int
		var text, image, subject, section string
		var options, answer map[string]interface{}

		if err := rows.Scan(&questionID, &text, &image, &subject, &section, &options, &answer); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to process question"})
		}

		selectedOptionIDStr := input.Questions[questionID] // Get the selected option as a string

		// Check if the selected option is correct by comparing with the answer map
		_, isCorrect := answer[selectedOptionIDStr]

		// Count correct/incorrect answers
		if isCorrect {
			correctAnswers++
		} else {
			incorrectAnswers++
		}

		// Store question details in the result data
		resultData[questionID] = map[string]interface{}{
			"text":    text,
			"image":   image,
			"subject": subject,
			"section": section,
			"options": options,
			"select":  selectedOptionIDStr,
			"answer":  answer,
		}
	}

	// Insert the test result into the test_results table
	insertQuery := `
		INSERT INTO test_results (user_id, test_id, correct, incorrect, data, test_date) 
		VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) 
		RETURNING id
	`
	var testResultID int
	err = database.DB.QueryRow(context.Background(), insertQuery, userID, input.TestID, correctAnswers, incorrectAnswers, resultData).Scan(&testResultID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to insert test result"})
	}

	// Return the inserted test result ID as a response
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":      "Test submitted successfully",
		"testResultID": testResultID,
	})
}
