package user_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test"
	"github.com/jean-bernard-laguerre/plateforme-safebase/user"
)

func TestUserService(t *testing.T) {

	db, err := test.SetupTestDB()
	if err != nil {
		t.Fatalf("setupTestDB failed: %v", err)
	}
	defer db.Close()

	config.DB = db
	model := user.UserModel{}

	t.Run("Register", func(t *testing.T) {
		created, err := user.Register("john@doeTest.com", "testPassword")
		if !created {
			t.Fatalf("Register failed: %v", err)
		}
	})

	t.Run("Login", func(t *testing.T) {
		_, err := user.Login("john@smith.com", "password")
		if err != nil {
			t.Fatalf("Login failed: %v", err)
		}
	})

	t.Run("Delete", func(t *testing.T) {
		toDelete, _ := model.GetByEmail("john@doeTest.com")
		_, err := model.Delete(toDelete.Id)

		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}
	})
}
