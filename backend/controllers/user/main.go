package user

import (
	"context"
	"log"
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

var jwtSecret = []byte("your_secret_key")

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

	// Insert user into the database using raw SQL
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

	// Respond with success
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User registered successfully",
		"user_id": userID,
	})
}

func Login(c *fiber.Ctx) error {
	// Parse the login request body
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

	token, err := generateJWTToken(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

	// Respond with success and return the JWT token
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login successful",
		"user": fiber.Map{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
		"token": token,
	})
}

func generateJWTToken(user UserDetails) (string, error) {
	// Create a new JWT token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"exp":      time.Now().Add(time.Hour * 72).Unix(), // Token expires in 72 hours
	})

	// Sign the token with the secret key
	tokenString, err := token.SignedString(jwtSecret)
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
