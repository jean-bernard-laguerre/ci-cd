package history_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/history"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test"
)

func TestHistoryRepository(t *testing.T) {

	db, err := test.SetupTestDB()
	if err != nil {
		t.Fatalf("setupTestDB failed: %v", err)
	}
	defer db.Close()

	config.DB = db
	var testId int

	t.Run("Create", func(t *testing.T) {
		history := history.HistoryModel{}
		created, err := history.Create("test", true, "Backup", "2021-01-01 00:00:00", 1, nil)
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}
		if created == 0 {
			t.Fatalf("Create failed")
		}
		testId = created

	})

	t.Run("GetAll", func(t *testing.T) {
		history := history.HistoryModel{}
		result, err := history.GetAll()
		if err != nil {
			t.Fatalf("GetAll failed: %v", err)
		}
		if len(result) == 0 {
			t.Fatalf("GetAll failed")
		}
	})

	t.Run("Delete", func(t *testing.T) {
		history := history.HistoryModel{}
		deleted, err := history.Delete(testId)
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}
		if deleted == false {
			t.Fatalf("Delete failed")
		}
	})
}
