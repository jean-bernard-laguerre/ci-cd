package dump_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/dump"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test"
)

func TestDumpRepository(t *testing.T) {

	db, err := test.SetupTestDB()
	if err != nil {
		t.Fatalf("setupTestDB failed: %v", err)
	}
	defer db.Close()

	config.DB = db
	var testId int
	dump := dump.DumpModel{}

	t.Run("Create", func(t *testing.T) {
		created, err := dump.Create("test", "test", 1)
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}
		if created == 0 {
			t.Fatalf("Create failed")
		}
		testId = created

		result, dumpErr := dump.GetById(testId)
		if dumpErr != nil {
			t.Fatalf("GetById failed: %v", dumpErr)
		}
		if result.Id != testId {
			t.Fatalf("Create failed")
		}
	})

	t.Run("GetById", func(t *testing.T) {
		result, err := dump.GetById(testId)
		if err != nil {
			t.Fatalf("GetById failed: %v", err)
		}
		if result.Id != testId {
			t.Fatalf("GetById failed")
		}
	})

	t.Run("GetAll", func(t *testing.T) {
		result, err := dump.GetAll()
		if err != nil {
			t.Fatalf("GetAll failed: %v", err)
		}
		if len(result) == 0 {
			t.Fatalf("GetAll failed")
		}
	})

	t.Run("Update", func(t *testing.T) {
		update, err := dump.Update(testId, false)
		if err != nil {
			t.Fatalf("Update failed: %v", err)
		}
		if update != true {
			t.Fatalf("Update failed")
		}

		result, dumpErr := dump.GetById(testId)
		if dumpErr != nil {
			t.Fatalf("GetById failed: %v", dumpErr)
		}

		if result.Active != false {
			t.Fatalf("Update failed")
		}
	})

	t.Run("Delete", func(t *testing.T) {
		result, err := dump.Delete(testId)
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}
		if result != true {
			t.Fatalf("Delete failed")
		}

		_, dumpErr := dump.GetById(testId)
		if dumpErr == nil {
			t.Fatalf("Delete failed")
		}
	})
}
