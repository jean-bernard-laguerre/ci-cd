package dump

import (
	"time"
)

type DumpModel struct {
	Id            int
	Name          string
	Cron_job      string
	Connection_id int
	Created_at    time.Time
	Active        bool
	Db_name       string
	Db_type       string
}
