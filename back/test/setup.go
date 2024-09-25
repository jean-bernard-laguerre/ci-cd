package test

import (
	"database/sql"

	"github.com/go-sql-driver/mysql"
)

func SetupTestDB() (*sql.DB, error) {
	config := mysql.Config{
		User:                 "root",
		Passwd:               "",
		Net:                  "tcp",
		Addr:                 "localhost:3306",
		DBName:               "safebase_test",
		AllowNativePasswords: true,
		ParseTime:            true,
	}

	db, err := sql.Open("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}
	return db, nil
}
