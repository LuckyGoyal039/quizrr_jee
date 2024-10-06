package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool // Global connection pool variable

// ConnectDatabase initializes the database connection pool.
func ConnectDatabase() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	connStr := os.Getenv("DATABASE_URL")

	// Initialize the connection pool
	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal("Failed to parse database connection string:", err)
	}

	dbPool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	DB = dbPool
	fmt.Println("Database connected successfully...")

	// Create user table if it doesn't exist
	createUserTable()
}

// CloseDatabase closes the database connection pool.
func CloseDatabase() {
	if DB != nil {
		DB.Close()
		fmt.Println("Database connection pool closed.")
	}
}

// createUserTable creates the "users" table if it does not already exist
func createUserTable() {
	query := `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(100) NOT NULL UNIQUE,
			email VARCHAR(100) NOT NULL UNIQUE,
			password TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`

	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatal("Failed to create 'users' table:", err)
	}

	fmt.Println("'users' table created or already exists.")
}
