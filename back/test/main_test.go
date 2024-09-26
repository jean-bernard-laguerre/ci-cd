package test

import (
	"log"
	"os"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
	"github.com/jean-bernard-laguerre/plateforme-safebase/test/setup"
)

func TestMain(m *testing.M) {
	var err error

	// Setup the test database
	setup.DB, err = setup.SetupTestDB()
	if err != nil {
		log.Fatal(err) // Log the error and exit the program
	}

	// Run the tests
	config.DB = setup.DB
	code := m.Run()

	// Clean up
	if setup.DB != nil {
		err = setup.CleanDB(setup.DB)
		if err != nil {
			log.Fatal(err)
		}
		setup.DB.Close()
	}

	// Exit with the test code
	os.Exit(code)
}
