package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	database "go-project/db"
	"go-project/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Initialize the database connection pool
	database.ConnectDatabase()

	// Ensure the connection pool is closed when the app shuts down
	defer database.CloseDatabase()

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello from the server")
	})

	// Register routes
	routes.UserRoutes(app)

	// Graceful shutdown handling
	go func() {
		if err := app.Listen(":3000"); err != nil {
			log.Printf("Server stopped with error: %v\n", err)
		}
	}()

	// Capture shutdown signal to ensure the DB pool is closed
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down the server...")
}
