package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/quizrr/controllers/user"
)

func UserRoutes(app *fiber.App) {
	userGroup := app.Group("/user")

	// userGroup.Post("/register", user.Register)
	// userGroup.Post("/login", user.Login)
	userGroup.Get("/board-list", user.GetBoardList)
	userGroup.Get("/profile", user.GetAllProfileData)
	userGroup.Patch("/profile", user.SetPortfolioData)
	userGroup.Get("/my-notes", user.GetNotesList)

}
