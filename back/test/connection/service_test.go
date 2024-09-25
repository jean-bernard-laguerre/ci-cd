package connection_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/connection"
)

func TestConnService(t *testing.T) {
	t.Run("TestConnectionMySql", func(t *testing.T) {
		conn := connection.ConnectionModel{
			Id:       1,
			Name:     "Test",
			Host:     "localhost",
			Port:     "3306",
			User:     "root",
			Password: "",
			Db_name:  "test",
			Db_type:  "mysql",
			User_id:  1,
		}
		result, err := connection.TestConnectionMySql(conn)
		if err != nil {
			t.Fatalf("TestConnectionMySql failed: %v", err)
		}
		if result != true {
			t.Fatalf("TestConnectionMySql failed")
		}
	})

	t.Run("TestConnectionPostgres", func(t *testing.T) {
		conn := connection.ConnectionModel{
			Id:       1,
			Name:     "Test",
			Host:     "localhost",
			Port:     "3308",
			User:     "root",
			Password: "",
			Db_name:  "prod",
			Db_type:  "postgres",
			User_id:  1,
		}

		result, err := connection.TestConnectionPostgres(conn)
		if err != nil {
			t.Fatalf("TestConnectionPostgres failed: %v", err)
		}
		if result != true {
			t.Fatalf("TestConnectionPostgres failed")
		}
	})
}
