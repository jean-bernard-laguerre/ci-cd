package connection

import (
	"database/sql"
	"fmt"

	"github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

func TestConnection(c ConnectionModel) (bool, error) {
	var result bool
	var err error

	if c.Db_type == "mysql" {
		result, err = TestConnectionMySql(c)
	} else if c.Db_type == "postgres" {
		result, err = TestConnectionPostgres(c)
	}
	return result, err
}

func TestConnectionMySql(c ConnectionModel) (bool, error) {
	config := mysql.Config{
		User:   c.User,
		Passwd: c.Password,
		Net:    "tcp",
		Addr:   fmt.Sprintf("%s:%s", c.Host, c.Port),
		DBName: c.Db_name,
	}

	db, err := sql.Open(c.Db_type, config.FormatDSN())

	err = db.Ping()
	if err != nil {
		fmt.Println("Invalid Connection:", c.Db_type, fmt.Sprintf("%s:%s", c.Host, c.Port), c.Db_name, err)
		return false, err
	}
	fmt.Println("Valid Connection:", c.Db_type, fmt.Sprintf("%s:%s", c.Host, c.Port), c.Db_name)

	defer db.Close()
	return true, nil
}

func TestConnectionPostgres(c ConnectionModel) (bool, error) {
	connString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", c.User, c.Password, c.Host, c.Port, c.Db_name)
	db, err := sql.Open(c.Db_type, connString)

	err = db.Ping()
	if err != nil {
		fmt.Println("Invalid Connection:", connString, err)
		return false, err
	}
	fmt.Println("Valid Connection:", connString)
	defer db.Close()
	return true, nil
}
