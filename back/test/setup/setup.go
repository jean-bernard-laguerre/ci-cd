package setup

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB
var IdList = make(map[string]int)

func SetupTestDB() (*sql.DB, error) {
	config := mysql.Config{
		User:                 os.Getenv("DB_USER"),
		Passwd:               os.Getenv("DB_PASSWORD"),
		Net:                  "tcp",
		Addr:                 fmt.Sprintf("%s:%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT")),
		DBName:               os.Getenv("DB_NAME"),
		AllowNativePasswords: true,
		ParseTime:            true,
	}

	DBCONN, err := sql.Open("mysql", config.FormatDSN())
	if err != nil {
		panic(err)
	}

	err = DBCONN.Ping()
	if err != nil {
		return nil, fmt.Errorf("error pinging database: %v", err)
	}

	err = SetupDatabase(DBCONN)
	if err != nil {
		fmt.Println(err)
	}

	return DBCONN, nil
}

// SetupDatabase is a function that will create the database and the tables if they don't exist
func SetupDatabase(DBCONN *sql.DB) error {

	// Create the user table
	_, err := DBCONN.Exec(`CREATE TABLE IF NOT EXISTS user (
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
	_, err = DBCONN.Exec(`CREATE TABLE IF NOT EXISTS connection (
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
	_, err = DBCONN.Exec(`CREATE TABLE IF NOT EXISTS backup (	
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
	_, err = DBCONN.Exec(`CREATE TABLE IF NOT EXISTS history (
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

func CleanDB(DB *sql.DB) error {

	for _, table := range []string{"user", "connection", "backup", "history"} {
		_, err := DB.Exec("DELETE FROM " + table)
		if err != nil {
			return err
		}
	}
	return nil
}
