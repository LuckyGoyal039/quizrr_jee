package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	database "github.com/quizrr/db"
	"github.com/quizrr/routes"
)

func main() {

	if err := database.ConnectDatabase(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	defer database.CloseDatabase()

	app := fiber.New()

	// Test route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello from the server")
	})
	routes.UserRoutes(app)

	// shutdown gracefully
	go func() {
		if err := app.Listen(":3000"); err != nil {
			log.Printf("Server stopped with error: %v\n", err)
		}
	}()

	// Capture shutdown signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down the server...")

	// Gracefully shutdown the Fiber app with a timeout
	_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := app.Shutdown(); err != nil {
		log.Printf("Fiber server forced to shutdown: %v\n", err)
	}

	log.Println("Server stopped.")
}
