package config

import (
	"database/sql"
	"fmt"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitDB() {
	var err error

	config := mysql.Config{
		User:                 "root",
		Passwd:               "verysecure",
		Net:                  "tcp",
		Addr:                 "mysql:3306",
		AllowNativePasswords: true,
		ParseTime:            true,
	}

	DB, err = sql.Open("mysql", config.FormatDSN())
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("Connected to: ", fmt.Sprintf(config.Addr))

	err = SetupDatabase()
	if err != nil {
		fmt.Println(err)
	}
}

func CloseDB() {
	DB.Close()
	fmt.Println("Closed database connection")
}

// SetupDatabase is a function that will create the database and the tables if they don't exist
func SetupDatabase() error {

	// Create the database
	_, err := DB.Exec("CREATE DATABASE IF NOT EXISTS safebase")
	if err != nil {
		fmt.Println("Error creating database safebase: ", err)
	} else {
		fmt.Println("Database: ok")
	}

	// Use the database
	_, err = DB.Exec("USE safebase")
	if err != nil {
		fmt.Println("Error using database safebase: ", err)
	} else {
		fmt.Println("Using database safebase")
	}

	// Create the user table
	_, err = DB.Exec(`CREATE TABLE IF NOT EXISTS user (
		id INT AUTO_INCREMENT PRIMARY KEY,
		email VARCHAR(255) NOT NULL,
		password VARCHAR(255) NOT NULL
	)`)

	if err != nil {
		fmt.Println("User table: ", err)
	} else {
		fmt.Println("User table: ok")
	}

	// Create the connection table
	_, err = DB.Exec(`CREATE TABLE IF NOT EXISTS connection (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		host VARCHAR(255) NOT NULL,
		port VARCHAR(255) NOT NULL,
		user VARCHAR(255) NOT NULL,
		password VARCHAR(255) NOT NULL,
		db_name VARCHAR(255) NOT NULL,
		db_type VARCHAR(255) NOT NULL,
		user_id INT NOT NULL,
		FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
	)`)
	if err != nil {
		fmt.Println("Connection table: ", err)
	} else {
		fmt.Println("Connection table: ok")
	}

	// Create the backup table
	_, err = DB.Exec(`CREATE TABLE IF NOT EXISTS backup (	
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		cron_job VARCHAR(255) NOT NULL,
		connection_id INT NOT NULL,
		created_at DATETIME NOT NULL,
		active BOOLEAN NOT NULL DEFAULT 1,
		FOREIGN KEY (connection_id) REFERENCES connection(id) ON DELETE CASCADE
		
	)`)
	if err != nil {
		fmt.Println("Backup table: ", err)
	} else {
		fmt.Println("Backup table: ok")
	}

	// Create the history table
	_, err = DB.Exec(`CREATE TABLE IF NOT EXISTS history (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		status BOOLEAN NOT NULL,
		action VARCHAR(255) NOT NULL,
		created_at DATETIME NOT NULL,
		bdd_source INT NOT NULL,
		bdd_target INT,
		FOREIGN KEY (bdd_source) REFERENCES connection(id) ON DELETE CASCADE,
		FOREIGN KEY (bdd_target) REFERENCES connection(id) ON DELETE CASCADE
	)`)
	if err != nil {
		fmt.Println("History table: ", err)
	} else {
		fmt.Println("History table: ok")
	}

	return nil
}
