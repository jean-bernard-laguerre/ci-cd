package dump

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"time"

	"github.com/jean-bernard-laguerre/plateforme-safebase/connection"
	"github.com/jean-bernard-laguerre/plateforme-safebase/history"
)

func SaveHistory(name string, status bool, action string, created_at string, bdd_source int, bdd_target *int) (int, error) {
	h := history.HistoryModel{}
	return h.Create(name, status, action, created_at, bdd_source, bdd_target)
}

func PostgresDump(c *connection.ConnectionModel) string {
	fmt.Println("Ok cron job")
	time := time.Now().Local().Format("2006-01-02T15-04-05")
	fileName := c.Db_name + "_" + time + ".sql"

	cmd := exec.Command("pg_dump", "-h", c.Host, "-p", c.Port, "-U", c.User, c.Db_name)
	cmd.Env = append(os.Environ(), "PGPASSWORD="+c.Password)

	outfile, err := os.Create("./backups/postgres/" + fileName)
	defer outfile.Close()

	var stderr bytes.Buffer
	cmd.Stdout = outfile
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		SaveHistory(fileName, false, "Backup", time, c.Id, nil)
		return fmt.Sprintf("Error: %v: %e", err.Error(), stderr.String())
	} else {
		SaveHistory(fileName, true, "Backup", time, c.Id, nil)
		return fmt.Sprintf("Backup created successfully")
	}
}

func MysqlDump(c *connection.ConnectionModel) string {
	fmt.Println("Ok cron job")
	time := time.Now().Local().Format("2006-01-02T15-04-05")
	fileName := c.Db_name + "_" + time + ".sql"

	cmd := exec.Command("mysqldump", "-h", c.Host, "--port", c.Port, "--user", c.User, "--password="+c.Password, c.Db_name)
	outfile, err := os.Create("./backups/mysql/" + fileName)
	defer outfile.Close()

	var stderr bytes.Buffer
	cmd.Stdout = outfile
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		SaveHistory(fileName, false, "Backup", time, c.Id, nil)
		return fmt.Sprintf("Error: %v: %e", err.Error(), stderr.String())
	} else {
		SaveHistory(fileName, true, "Backup", time, c.Id, nil)
		return fmt.Sprintf("Backup created successfully")
	}
}

func MysqlRestore(c *connection.ConnectionModel, fileName string, source int) string {
	fmt.Println("Ok cron job")
	cmd := exec.Command("mysql", "-h", c.Host, "--port", c.Port, "-u", c.User, "--password="+c.Password, c.Db_name)
	infile, err := os.Open("./backups/mysql/" + fileName)
	defer infile.Close()
	cmd.Stdin = infile
	err = cmd.Run()
	if err != nil {
		SaveHistory(fileName, false, "Restore", time.Now().Local().Format("2006-01-02T15-04-05"), source, &c.Id)
		return fmt.Sprintf("Error:", err)
	} else {
		SaveHistory(fileName, true, "Restore", time.Now().Local().Format("2006-01-02T15-04-05"), source, &c.Id)
		return fmt.Sprintf("Restore created successfully")
	}
}

func PostgresRestore(c *connection.ConnectionModel, fileName string, source int) string {
	fmt.Println("Ok cron job")
	cmd := exec.Command("psql", "-h", c.Host, "-p", c.Port, "-U", c.User, "-d", c.Db_name)
	cmd.Env = append(os.Environ(), "PGPASSWORD="+c.Password)
	infile, err := os.Open("./backups/postgres/" + fileName)
	defer infile.Close()

	var stderr bytes.Buffer
	cmd.Stdin = infile
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		fmt.Println(err.Error(), stderr.String())
		SaveHistory(fileName, false, "Restore", time.Now().Local().Format("2006-01-02T15-04-05"), source, &c.Id)
		return fmt.Sprintf("Error:", err.Error())
	} else {
		SaveHistory(fileName, true, "Restore", time.Now().Local().Format("2006-01-02T15-04-05"), source, &c.Id)
		return fmt.Sprintf("Restore created successfully")
	}
}
