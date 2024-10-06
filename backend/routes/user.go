package routes

import (
	"go-project/controllers/user"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app *fiber.App) {
	userGroup := app.Group("/users")

	userGroup.Post("/register", user.Register)
	userGroup.Post("/login", user.Login)
}
