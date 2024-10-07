package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/quizrr/controllers/user"
)

func AuthRoutes(app *fiber.App) {
	app.Post("/user/register", user.Register)
	app.Post("/user/login", user.Login)
}
