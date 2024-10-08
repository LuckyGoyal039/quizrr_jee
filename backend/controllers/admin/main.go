package admin

import (
	"context"
	"time"

	"github.com/gofiber/fiber"
	database "github.com/quizrr/db"
)

func CreateTest(c *fiber.Ctx) error {
	// Define a struct to hold the incoming test data
	input := new(struct {
		Name        string `json:"name"`
		Image       string `json:"image"`
		Description string `json:"description"`
		Duration    int    `json:"duration"`  // Duration in minutes
		Questions   []int  `json:"questions"` // List of question IDs
	})

	// Parse the request body
	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Insert the test data into the test_series table
	query := `
		INSERT INTO test_series (name, image, description, duration)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name, image, description, duration, created_at, updated_at
	`
	var newTest struct {
		ID          int       `json:"id"`
		Name        string    `json:"name"`
		Image       string    `json:"image"`
		Description string    `json:"description"`
		Duration    int       `json:"duration"`
		CreatedAt   time.Time `json:"created_at"`
		UpdatedAt   time.Time `json:"updated_at"`
	}

	// Execute the query and return the inserted test details
	err := database.DB.QueryRow(context.Background(), query, input.Name, input.Image, input.Description, input.Duration).Scan(
		&newTest.ID, &newTest.Name, &newTest.Image, &newTest.Description, &newTest.Duration, &newTest.CreatedAt, &newTest.UpdatedAt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create test"})
	}

	// Insert the related questions into the junction table (test_series_questions)
	for _, questionID := range input.Questions {
		questionQuery := `
			INSERT INTO test_series_questions (test_series_id, question_id)
			VALUES ($1, $2)
		`
		_, err := database.DB.Exec(context.Background(), questionQuery, newTest.ID, questionID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to link questions"})
		}
	}

	// Return the newly created test in the response
	return c.JSON(fiber.Map{
		"id":          newTest.ID,
		"name":        newTest.Name,
		"image":       newTest.Image,
		"description": newTest.Description,
		"duration":    newTest.Duration,
		"created_at":  newTest.CreatedAt,
		"updated_at":  newTest.UpdatedAt,
	})
}
