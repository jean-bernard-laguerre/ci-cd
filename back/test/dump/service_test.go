package dump_test

import (
	"testing"
	"time"

	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/dump"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test"
)

func TestDumpService(t *testing.T) {

	db, err := test.SetupTestDB()
	if err != nil {
		t.Fatalf("setupTestDB failed: %v", err)
	}
	defer db.Close()

	config.DB = db

	t.Run("SaveHistory", func(t *testing.T) {

		_, err := dump.SaveHistory("test", true, "Backup", time.Now().Format("2006-01-02 15:04:05"), 1, nil)
		if err != nil {
			t.Fatalf("SaveHistory failed: %v", err)
		}
	})
}
