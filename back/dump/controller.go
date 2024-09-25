package dump

import (
	"github.com/gofiber/fiber/v2"

	"github.com/jean-bernard-laguerre/plateforme-safebase/connection"
	"github.com/jean-bernard-laguerre/plateforme-safebase/history"
	"github.com/jean-bernard-laguerre/plateforme-safebase/middleware"
)

type updateDTO struct {
	Active bool `json:"active"`
}

type restoreDTO struct {
	HistoryId    int
	ConnectionId int
}

func createErrorResponse(ctx *fiber.Ctx, statusCode int, message string) error {
	return ctx.Status(statusCode).JSON(fiber.Map{
		"success": false,
		"message": message,
	})
}

func createSuccessResponse(ctx *fiber.Ctx, message string) error {
	return ctx.Status(200).JSON(fiber.Map{
		"success": true,
		"message": message,
	})
}

func AddRoutes(app *fiber.App) {

	du := app.Group("/dump")
	re := app.Group("/restore")
	du.Use(middleware.AuthMiddleware())
	re.Use(middleware.AuthMiddleware())

	du.Post("/task", func(ctx *fiber.Ctx) error {
		tasks := new(DumpModel)
		if err := ctx.BodyParser(tasks); err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"success": false,
				"message": "Invalid input",
			})
		}

		id, err := tasks.Create(tasks.Name, tasks.Cron_job, tasks.Connection_id)
		if err != nil {
			return createErrorResponse(ctx, 500, err.Error())
		} else {
			AddCronJob(tasks.Cron_job, tasks.Connection_id, id)
			return createSuccessResponse(ctx, "Task created successfully")
		}
	})

	// du.Get("/task/:id", func(ctx *fiber.Ctx) error {
	// 	id, err := ctx.ParamsInt("id")
	// 	if err != nil {
	// 		return createErrorResponse(ctx, 400, "Invalid input")
	// 	}
	// 	RemoveCronJob(id)
	// 	return createSuccessResponse(ctx, "Task paused successfully")
	// })

	du.Patch("/task/:id", func(ctx *fiber.Ctx) error {
		id, err := ctx.ParamsInt("id")
		if err != nil {
			return createErrorResponse(ctx, 400, "Invalid input"+err.Error())
		}
		tasks := new(DumpModel)
		dto := new(updateDTO)
		if err := ctx.BodyParser(dto); err != nil {
			return createErrorResponse(ctx, 400, "Parse error")
		}
		task, taskErr := tasks.GetById(id)
		if taskErr != nil {
			return createErrorResponse(ctx, 404, "Task not found")
		}

		_, updateErr := task.Update(id, dto.Active)
		if updateErr != nil {
			return createErrorResponse(ctx, 500, "Internal server error")
		}
		if dto.Active {
			AddCronJob(task.Cron_job, task.Connection_id, id)
			return createSuccessResponse(ctx, "Task updated successfully")
		} else {
			RemoveCronJob(id)
			return createSuccessResponse(ctx, "Task paused successfully")
		}
	})

	du.Get("/", func(ctx *fiber.Ctx) error {
		id := ctx.Locals("userId").(int)

		backup := new(DumpModel)
		backups, err := backup.GetByUserId(id)

		if err != nil {
			// return fiber.NewError(500, "Internal server error")
			return createErrorResponse(ctx, 500, "Internal server error")
		}

		return ctx.Status(200).JSON(fiber.Map{
			"success": true,
			"data":    backups,
		})
	})

	du.Get("/run/:id", func(ctx *fiber.Ctx) error {

		id, _ := ctx.ParamsInt("id")

		connection := connection.ConnectionModel{}
		dbConn, error := connection.GetById(id)

		if error != nil {
			return createErrorResponse(ctx, 404, "Connection not found")
		}

		var result string
		if dbConn.Db_type == "postgres" {
			result = PostgresDump(&dbConn)
		} else if dbConn.Db_type == "mysql" {
			result = MysqlDump(&dbConn)
		} else {
			return createErrorResponse(ctx, 400, "Invalid database type")
		}

		if result != "Backup created successfully" {
			return createErrorResponse(ctx, 500, result)
		}

		return createSuccessResponse(ctx, "Backup created successfully")

	})

	du.Delete("/:id", func(ctx *fiber.Ctx) error {
		id, _ := ctx.ParamsInt("id")
		bool, err := new(DumpModel).Delete(id)
		if err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"success": false,
				"message": "Invalid input",
			})
		} else {
			RemoveCronJob(id)
			return ctx.Status(200).JSON(fiber.Map{
				"success": bool,
				"message": "Task deleted successfully",
			})
		}
	})

	re.Post("/", func(ctx *fiber.Ctx) error {
		restore := new(restoreDTO)
		if err := ctx.BodyParser(restore); err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		history := history.HistoryModel{}
		h, err := history.GetById(restore.HistoryId)
		if err != nil {
			return ctx.Status(400).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		if h.Action != "Backup" {
			createErrorResponse(ctx, 400, "This history is not a backup")
		}

		if h.Status == false {
			createErrorResponse(ctx, 400, "This backup is not valid")
		}

		connection := connection.ConnectionModel{}
		dbConn, err := connection.GetById(restore.ConnectionId)
		if err != nil {
			createErrorResponse(ctx, 400, err.Error())
		}

		var result string
		if dbConn.Db_type == "postgres" {
			result = PostgresRestore(&dbConn, h.Name, h.Bdd_source)
		}
		if dbConn.Db_type == "mysql" {
			result = MysqlRestore(&dbConn, h.Name, h.Bdd_source)
		}

		if result != "Restore created successfully" {
			createErrorResponse(ctx, 500, result)
		}

		return createSuccessResponse(ctx, "Restore created successfully")
	})

}
