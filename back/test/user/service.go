package user_test

import (
	"testing"

	"github.com/jean-bernard-laguerre/plateforme-safebase/user"
)

var email = "john@doeTest.com"
var password = "testPassword"

func Registering(t *testing.T) {
	created, err := user.Register(email, password)
	if !created {
		t.Fatalf("Register failed: %v", err)
	}
}

func Logging(t *testing.T) {
	_, err := user.Login(email, password)
	if err != nil {
		t.Fatalf("Login failed: %v", err)
	}
}
