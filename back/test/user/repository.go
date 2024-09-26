package user_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/test/setup"
	"github.com/jean-bernard-laguerre/plateforme-safebase/user"
)

const Email = "testUser@mail.test"
const Password = "testPassword"

var u = user.UserModel{}

func CreateUser(t *testing.T) {
	created, err := u.Create(Email, Password)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if created == 0 {
		t.Fatalf("Create failed")
	}
	setup.IdList["user"] = created

	result := u.GetById(setup.IdList["user"])
	if result.Id != setup.IdList["user"] {
		t.Fatalf("Create failed")
	}
}

func GetUserById(t *testing.T) {
	result := u.GetById(1)
	if result.Id != 1 {
		t.Fatalf("GetById failed: %v", result.Id)
	}
}

func GetUserByEmail(t *testing.T) {
	result, err := u.GetByEmail(Email)

	if err != nil {
		t.Fatalf("GetByEmail failed: %v", err)
	}

	if result.Email != Email {
		t.Fatalf("GetByEmail failed: %v", result.Email)
	}
}
