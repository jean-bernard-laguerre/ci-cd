package connection_test

import (
	"fmt"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/connection"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test"
)

func TestConnRepository(t *testing.T) {
	db, err := test.SetupTestDB()
	if err != nil {
		t.Fatalf("setupTestDB failed: %v", err)
	}
	defer db.Close()

	config.DB = db
	var testId int
	conn := connection.ConnectionModel{}

	t.Run("Create", func(t *testing.T) {
		created, err := conn.Create("test", "localhost", "3306", "root", "", "test", "mysql", 1)
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}
		if created == 0 {
			t.Fatalf("Create failed")
		}

		testId = created

		result, connErr := conn.GetById(testId)
		if connErr != nil {
			fmt.Println(connErr)
			t.Fatalf("GetById failed: %v", connErr)
		}
		if result.Id != testId {
			fmt.Println(result.Id)
			t.Fatalf("Create failed")
		}
	})

	t.Run("GetById", func(t *testing.T) {
		result, err := conn.GetById(testId)
		if err != nil {
			t.Fatalf("GetById failed: %v", err)
		}
		if result.Id != testId {
			t.Fatalf("GetById failed")
		}
	})

	t.Run("GetByUserId", func(t *testing.T) {
		result, err := conn.GetByUserId(1)
		if err != nil {
			t.Fatalf("GetByUserId failed: %v", err)
		}
		if len(result) == 0 {
			t.Fatalf("GetByUserId failed")
		}
	})

	t.Run("Delete", func(t *testing.T) {
		result, err := conn.Delete(testId)
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}
		if result != true {
			t.Fatalf("Delete failed")
		}

		_, connErr := conn.GetById(testId)
		if connErr == nil {
			t.Fatalf("Delete failed")
		}
	})
}
