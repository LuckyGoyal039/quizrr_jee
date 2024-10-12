package admin

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	database "github.com/quizrr/db"
)

// Question struct to match the request body and to store the inserted data
type Question struct {
	ID        int               `json:"id"`
	Text      string            `json:"text"`
	Image     string            `json:"image"`
	Subject   string            `json:"subject"`
	Section   string            `json:"section"`
	Options   map[string]string `json:"options"`
	Answer    map[string]string `json:"answer"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
}

// Function to create a new question and return its details
func CreateQuestion(c *fiber.Ctx) error {
	// Parse request body into Question struct
	var input Question

	// Use BodyParser to parse the incoming JSON directly
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request format", "details": err.Error()})
	}

	// Prepare the query to insert the question and return the inserted row details
	query := `
		INSERT INTO questions (text, image, subject, section, options, answer, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, text, image, subject, section, options, answer, created_at, updated_at`

	// Create a variable to hold the inserted question details
	var newQuestion Question

	// Execute the query and return the inserted question details
	err := database.DB.QueryRow(context.Background(), query, input.Text, input.Image, input.Subject, input.Section, input.Options, input.Answer).Scan(
		&newQuestion.ID, &newQuestion.Text, &newQuestion.Image, &newQuestion.Subject, &newQuestion.Section, &newQuestion.Options, &newQuestion.Answer, &newQuestion.CreatedAt, &newQuestion.UpdatedAt)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create question", "details": err.Error()})
	}

	// Return the inserted question as a response
	return c.Status(fiber.StatusOK).JSON(newQuestion)
}

type TestSeries struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Image       string    `json:"image"`
	Description string    `json:"description"`
	Duration    int       `json:"duration"`
	Questions   []int     `json:"questions"`
	Batch       string    `json:"batch"`
	Target      string    `json:"target"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func CreateTest(c *fiber.Ctx) error {
	var input TestSeries
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request format", "details": err.Error()})
	}

	query := `
        INSERT INTO test_series (name, image, description, duration, questions, batch, target, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, name, image, description, duration, questions, batch, target, created_at, updated_at`

	var newTestSeries TestSeries

	err := database.DB.QueryRow(
		context.Background(),
		query,
		input.Name,
		input.Image,
		input.Description,
		input.Duration,
		pq.Array(input.Questions),
		input.Batch,
		input.Target,
	).Scan(
		&newTestSeries.ID,
		&newTestSeries.Name,
		&newTestSeries.Image,
		&newTestSeries.Description,
		&newTestSeries.Duration,
		&newTestSeries.Questions,
		&newTestSeries.Batch,
		&newTestSeries.Target,
		&newTestSeries.CreatedAt,
		&newTestSeries.UpdatedAt,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create test series", "details": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(newTestSeries)
}
