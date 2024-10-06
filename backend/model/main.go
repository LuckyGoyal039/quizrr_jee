package models

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey"`               // Auto-incrementing ID, primary key
	Username  string    `gorm:"size:100;not null;unique"` // Username field with a size of 100 characters, unique
	Email     string    `gorm:"size:100;not null;unique"` // Email field, unique and required
	Password  string    `gorm:"not null"`                 // Password field, required
	CreatedAt time.Time // Timestamp for when the user was created
	UpdatedAt time.Time // Timestamp for when the user was last updated
}
