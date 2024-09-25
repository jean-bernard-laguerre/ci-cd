package middleware

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware() func(*fiber.Ctx) error {
	return func(ctx *fiber.Ctx) error {
		// get the user id from the header
		userId := ctx.Get("userId")
		if userId == "" {
			return ctx.Status(400).JSON(fiber.Map{
				"error": "User id is missing",
			})
		}

		id, err := strconv.Atoi(userId)
		if err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"error": "User id is not a number",
			})
		}

		ctx.Locals("userId", id)
		return ctx.Next()
	}
}
