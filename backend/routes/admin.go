package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/quizrr/controllers/user"
)

func AdminRoutes(app *fiber.App) {
	adminGroup := app.Group("/admin")

	adminGroup.Post("/create-test", user.CreateNote)

	// get list of all test

	// buy test api
	//get the test api and add the testid to the user

	//get testid and token
	// check in user purchased section that testid is present or not
	// if present then return the test data of id=testid

}
