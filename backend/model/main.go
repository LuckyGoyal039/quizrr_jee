package models

import (
	"time"

	"github.com/lib/pq"
)

type JSON []byte

func (j *JSON) UnmarshalJSON(data []byte) error {
	*j = data
	return nil
}

func (j JSON) MarshalJSON() ([]byte, error) {
	return j, nil
}

type User struct {
	ID          uint          `gorm:"primaryKey"`
	Username    string        `gorm:"size:100;not null;unique"`
	Displayname string        `gorm:"size:100"`
	Email       string        `gorm:"size:100;not null;unique"`
	Password    string        `gorm:"not null"`
	Isverified  bool          `gorm:"default:false"`
	Purchases   pq.Int64Array `gorm:"type:integer[]"`
	Lastlogin   time.Time
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}

type Notebook struct {
	ID        uint      `gorm:"primaryKey"`
	UserId    uint      `gorm:"not null"`
	Topic     string    `gorm:"size:100;"`
	Content   string    `gorm:"type:text"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type Profile struct {
	ID        uint      `gorm:"primaryKey"`
	PhoneNo   string    `gorm:"size:15"`
	Country   string    `gorm:"size:100"`
	State     string    `gorm:"size:100"`
	City      string    `gorm:"size:100"`
	PinCode   string    `gorm:"size:10"`
	Standard  string    `gorm:"size:50"`
	Board     string    `gorm:"size:100"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type TestSeries struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string    `gorm:"size:100;not null"`
	Description string    `gorm:"type:text"`
	Data        JSON      `gorm:"type:json"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}

type Question struct {
	Text    string   `json:"text"`
	Image   string   `json:"image,omitempty"`
	Subject string   `json:"subject"`
	Section string   `json:"section"`
	Options []Option `json:"options"`
	Answer  string   `json:"answer"`
}

type Option struct {
	Text  string `json:"text"`
	Image string `json:"image,omitempty"`
}

type TestResult struct {
	ID         uint      `gorm:"primaryKey"`
	UserID     uint      `gorm:"not null"`
	TestID     uint      `gorm:"not null"`
	TotalMarks float64   `gorm:"not null"`
	TestDate   time.Time `gorm:"not null"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime"`
}
