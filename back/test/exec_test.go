package test

import (
	"testing"

	conn_test "github.com/jean-bernard-laguerre/plateforme-safebase/test/connection"
	dump_test "github.com/jean-bernard-laguerre/plateforme-safebase/test/dump"
	history_test "github.com/jean-bernard-laguerre/plateforme-safebase/test/history"
	user_test "github.com/jean-bernard-laguerre/plateforme-safebase/test/user"
)

func TestUserR(t *testing.T) {

	t.Run("CreateUser", user_test.CreateUser)
	t.Run("GetUserById", user_test.GetUserById)
	t.Run("GetUserByEmail", user_test.GetUserByEmail)
}

func TestUserS(t *testing.T) {

	t.Run("Registering", user_test.Registering)
	t.Run("Logging", user_test.Logging)
}

func TestConnR(t *testing.T) {

	t.Run("CreateConnection", conn_test.CreateConn)
	t.Run("GetConnectionById", conn_test.GetConnById)
	t.Run("GetConnectionByUser", conn_test.GetUserConn)
}

/* func TestConnS(t *testing.T) {

	t.Run("TestConnection", conn_test.TestConnService)
} */

func TestDumpR(t *testing.T) {

	t.Run("CreateDump", dump_test.CreateDump)
	t.Run("GetDumpById", dump_test.GetDumpById)
	t.Run("GetDumpByUser", dump_test.GetAllDumps)
}

func TestDumpS(t *testing.T) {

	t.Run("SaveHistory", dump_test.OperationSave)
}

func TestHistoryR(t *testing.T) {

	t.Run("CreateHistory", history_test.CreateHistory)
	t.Run("GetHistoryById", history_test.GetAllHistory)
}
