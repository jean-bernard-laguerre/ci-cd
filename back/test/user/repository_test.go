package user_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test"
	"github.com/jean-bernard-laguerre/plateforme-safebase/user"
)

func TestUserRepository(t *testing.T) {

	db, err := test.SetupTestDB()
	if err != nil {
		t.Fatalf("setupTestDB failed: %v", err)
	}
	defer db.Close()

	config.DB = db
	var testId int
	user := user.UserModel{}

	t.Run("Create", func(t *testing.T) {
		created, err := user.Create("testUser@mail.test", "testPassword")
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}
		if created == 0 {
			t.Fatalf("Create failed")
		}
		testId = created

		result := user.GetById(testId)
		if result.Id != testId {
			t.Fatalf("Create failed")
		}
	})

	t.Run("GetById", func(t *testing.T) {
		result := user.GetById(1)
		if result.Id != 1 {
			t.Fatalf("GetById failed: %v", result.Id)
		}
	})

	t.Run("GetByEmail", func(t *testing.T) {
		result, err := user.GetByEmail("john@doe.com")

		if err != nil {
			t.Fatalf("GetByEmail failed: %v", err)
		}

		if result.Email != "john@doe.com" {
			t.Fatalf("GetByEmail failed: %v", result.Email)
		}
	})

	t.Run("Delete", func(t *testing.T) {
		deleted, err := user.Delete(testId)
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}
		if deleted == false {
			t.Fatalf("Delete failed")
		}
	})
}
