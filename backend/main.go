package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	database "github.com/quizrr/db"
	"github.com/quizrr/middleware"
	"github.com/quizrr/routes"
)

func main() {

	if err := database.ConnectDatabase(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	defer database.CloseDatabase()

	app := fiber.New()

	app.Use(cors.New())
	routes.AuthRoutes(app)
	routes.AdminRoutes(app)
	app.Use(middleware.AuthMiddleware)

	routes.UserRoutes(app)
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	go func() {
		if err := app.Listen(fmt.Sprintf(":%s", port)); err != nil {
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
