package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/quizrr/controllers/user"
)

func UserRoutes(app *fiber.App) {
	userGroup := app.Group("/users")

	userGroup.Post("/register", user.Register)
	userGroup.Post("/login", user.Login)
}
