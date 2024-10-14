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
	userGroup.Post("/my-notes", user.CreateNote)
	userGroup.Delete("/my-notes/:id", user.DeleteNote)
	userGroup.Patch("/my-notes/:id", user.UpdateNote)
	userGroup.Get("/test-list", user.GetTestSeriesList)
	userGroup.Get("/test-data/:testId", user.GetTestData)
	userGroup.Post("/submit-test", user.SubmitTest)
	userGroup.Get("/results-list", user.GetAllResults)
	userGroup.Get("/test-result-data/:id", user.GetTestResultData)

	// get list of all test

	// buy test api
	//get the test api and add the testid to the user

	//get testid and token
	// check in user purchased section that testid is present or not
	// if present then return the test data of id=testid

}
