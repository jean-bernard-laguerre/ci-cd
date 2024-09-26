package dump_test

import (
	"testing"
	"time"

	"github.com/jean-bernard-laguerre/plateforme-safebase/dump"
)

func OperationSave(t *testing.T) {

	_, err := dump.SaveHistory("test", true, "Backup", time.Now().Format("2006-01-02 15:04:05"), 1, nil)
	if err != nil {
		t.Fatalf("SaveHistory failed: %v", err)
	}
}
