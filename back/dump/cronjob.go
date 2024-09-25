package dump

import (
	"fmt"

	"github.com/go-co-op/gocron/v2"
	"github.com/google/uuid"
	"github.com/jean-bernard-laguerre/plateforme-safebase/connection"
)

var Cr gocron.Scheduler
var CronList = make(map[int]uuid.UUID)

func InitCron() {
	dumpModel := DumpModel{}
	dumps, err := dumpModel.GetAll()
	if err != nil {
		fmt.Print(err)
	}

	Cr, _ = gocron.NewScheduler()
	for _, d := range dumps {
		if !d.Active {
			continue
		}
		job, _ := Cr.NewJob(
			gocron.CronJob(d.Cron_job, false),
			gocron.NewTask(func() {
				connection := connection.ConnectionModel{}
				dbConn, error := connection.GetById(d.Connection_id)
				if error != nil {
					fmt.Print(error)
				}
				var result string
				if dbConn.Db_type == "postgres" {
					result = PostgresDump(&dbConn)
				} else if dbConn.Db_type == "mysql" {
					result = MysqlDump(&dbConn)
				} else {
					fmt.Print("Invalid database type")
				}
				fmt.Print(result)
			}),
		)

		CronList[d.Id] = job.ID()
	}
	fmt.Print(CronList)
	Cr.Start()

}

func AddCronJob(cronJob string, co_id int, id int) {
	connection := connection.ConnectionModel{}
	dbConn, error := connection.GetById(co_id)
	if error != nil {
		fmt.Print(error)
	}

	NewJob, _ := Cr.NewJob(
		gocron.CronJob(cronJob, false),
		gocron.NewTask(func() {
			var result string
			if dbConn.Db_type == "postgres" {
				result = PostgresDump(&dbConn)
			} else if dbConn.Db_type == "mysql" {
				result = MysqlDump(&dbConn)
			} else {
				fmt.Print("Invalid database type")
			}
			fmt.Print(result)
		}),
	)

	CronList[int(id)] = NewJob.ID()

}

func RemoveCronJob(id int) {
	Cr.RemoveJob(CronList[id])
	delete(CronList, id)
}
