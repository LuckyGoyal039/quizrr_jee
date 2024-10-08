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
	createNotebookTable()
	createProfileTable()
	createTestSeriesTable()
	createTestResultTable()
	createQuestionTable()
	// createOptionTable()
	createBoardListTable()
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
			isadmin BOOLEAN DEFAULT FALSE,
			purchases INTEGER[],
			lastlogin TIMESTAMP WITH TIME ZONE,
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

func createNotebookTable() {
	query := `
		CREATE TABLE IF NOT EXISTS notebooks (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(id),
			topic VARCHAR(100),
			content TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create 'notebooks' table: %v", err)
	}

	fmt.Println("'notebooks' table created successfully.")
}

func createProfileTable() {
	query := `
	CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY, 
    user_id INT NOT NULL,    
    phone_no VARCHAR(15),
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    standard VARCHAR(50),
    board VARCHAR(100),
    onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES users(id)  
        ON DELETE CASCADE                           
);

`

	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create 'profiles' table: %v", err)
	}

	fmt.Println("'profiles' table created successfully.")
}

func createTestSeriesTable() {
	query := `
		CREATE TABLE IF NOT EXISTS test_series (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			image TEXT,
			description TEXT,
			duration INTEGER NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create 'test_series' table: %v", err)
	}

	fmt.Println("'test_series' table created successfully.")
}

func createTestResultTable() {
	query := `
		CREATE TABLE IF NOT EXISTS test_results (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(id),
			test_id INTEGER NOT NULL REFERENCES test_series(id),
			correct INTEGER NOT NULL,  
			incorrect INTEGER NOT NULL,
			data JSONB,                 
			test_date TIMESTAMP NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create 'test_results' table: %v", err)
	}

	fmt.Println("'test_results' table created successfully.")
}

func createQuestionTable() {
	query := `
		CREATE TABLE IF NOT EXISTS test_series_questions (
			test_series_id INTEGER NOT NULL REFERENCES test_series(id) ON DELETE CASCADE,
			question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
			PRIMARY KEY (test_series_id, question_id)
		);
	`
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create 'questions' table: %v", err)
	}

	fmt.Println("'questions' table created successfully.")
}

// func createOptionTable() {
// 	query := `
// 		CREATE TABLE IF NOT EXISTS options (
// 			id SERIAL PRIMARY KEY,
// 			text TEXT NOT NULL,
// 			image TEXT,
// 			question_id INTEGER NOT NULL REFERENCES questions(id),
// 			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// 		);
// 	`
// 	_, err := DB.Exec(context.Background(), query)
// 	if err != nil {
// 		log.Fatalf("Failed to create 'options' table: %v", err)
// 	}

// 	fmt.Println("'options' table created successfully.")
// }

func createBoardListTable() {
	query := `
		CREATE TABLE IF NOT EXISTS board_lists (
			id SERIAL PRIMARY KEY,
			full_name VARCHAR(255) NOT NULL,
			short_name VARCHAR(100) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Failed to create 'board_lists' table: %v", err)
	}

	fmt.Println("'board_lists' table created successfully.")
}
