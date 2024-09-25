package history

import (
	"time"
)

type HistoryModel struct {
	Id         int
	Name       string
	Status     bool
	Action     string
	Created_at time.Time
	Bdd_source int
	Bdd_target *int

	Bdd_source_type string
	Bdd_source_name string
	Bdd_target_name *string
}
