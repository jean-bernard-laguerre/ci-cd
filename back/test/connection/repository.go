package conn_test

import (
	"fmt"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jean-bernard-laguerre/plateforme-safebase/connection"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test/setup"
)

var conn = connection.ConnectionModel{}

func CreateConn(t *testing.T) {
	created, err := conn.Create("test", "localhost", "3306", "root", "", "test", "mysql", setup.IdList["user"])
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if created == 0 {
		t.Fatalf("Create failed")
	}

	setup.IdList["connection"] = created

	result, connErr := conn.GetById(setup.IdList["connection"])
	if connErr != nil {
		fmt.Println(connErr)
		t.Fatalf("GetById failed: %v", connErr)
	}
	if result.Id != setup.IdList["connection"] {
		fmt.Println(result.Id)
		t.Fatalf("Create failed")
	}
}

func GetConnById(t *testing.T) {
	result, err := conn.GetById(setup.IdList["connection"])
	if err != nil {
		t.Fatalf("GetById failed: %v", err)
	}
	if result.Id != setup.IdList["connection"] {
		t.Fatalf("GetById failed")
	}
}

func GetUserConn(t *testing.T) {
	result, err := conn.GetByUserId(setup.IdList["user"])
	if err != nil {
		t.Fatalf("GetByUserId failed: %v", err)
	}
	if len(result) == 0 {
		t.Fatalf("GetByUserId failed")
	}
}
