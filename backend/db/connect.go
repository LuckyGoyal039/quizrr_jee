package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool // Global connection pool
func ConnectDatabase() error {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		return fmt.Errorf("DATABASE_URL environment variable not set")
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return fmt.Errorf("failed to parse database connection string: %v", err)
	}

	dbPool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return fmt.Errorf("failed to connect to the database: %v", err)
	}

	DB = dbPool
	fmt.Println("Database connected successfully...")

	createUserTable()
	return nil
}

// closes database connection pool.
func CloseDatabase() {
	if DB != nil {
		DB.Close()
		fmt.Println("Database connection pool closed.")
	}
}

func createUserTable() {
	query := `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(100) NOT NULL UNIQUE,
			displayname VARCHAR(100),
			email VARCHAR(100) NOT NULL UNIQUE,
			password TEXT NOT NULL,
			isverified BOOLEAN DEFAULT FALSE,
			lastlogin TIMESTAMP,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create 'users' table: %v", err)
	}

	fmt.Println("'users' table created successfully.")
}
