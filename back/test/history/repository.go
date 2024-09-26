package history_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/history"
)

func CreateHistory(t *testing.T) {
	history := history.HistoryModel{}
	created, err := history.Create("test", true, "Backup", "2021-01-01 00:00:00", 1, nil)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if created == 0 {
		t.Fatalf("Create failed")
	}
}

func GetAllHistory(t *testing.T) {
	history := history.HistoryModel{}
	result, err := history.GetAll()
	if err != nil {
		t.Fatalf("GetAll failed: %v", err)
	}
	if len(result) == 0 {
		t.Fatalf("GetAll failed")
	}
}
