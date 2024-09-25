package history

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/middleware"
)

func AddRoutes(app *fiber.App) {

	hy := app.Group("/history")
	hy.Use(middleware.AuthMiddleware())

	hy.Get("/all", func(ctx *fiber.Ctx) error {
		history := HistoryModel{}
		histories, err := history.GetAll()
		if err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return ctx.Status(200).JSON(fiber.Map{
			"histories": histories,
		})
	})

	hy.Get("/", func(ctx *fiber.Ctx) error {
		id := ctx.Locals("userId").(int)

		// get the page, limit & filter from the query or set a default
		var params config.ParamsHandler
		params.Init()

		if err := ctx.QueryParser(&params); err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		}

		history := HistoryModel{}
		histories, err := history.GetByUserId(id, params.Page, params.Limit, params.Filter)
		if err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		}
		return ctx.Status(200).JSON(fiber.Map{
			"success": true,
			"history": histories,
		})
	})

	hy.Get("/Overview", func(ctx *fiber.Ctx) error {
		id := ctx.Locals("userId").(int)
		h := HistoryModel{}

		overview, err := h.Overview(id)
		if err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		}
		return ctx.Status(200).JSON(fiber.Map{
			"success":  true,
			"overview": overview,
		})
	})
}
