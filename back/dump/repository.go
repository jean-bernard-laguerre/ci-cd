package dump

import (
	"fmt"

	_ "github.com/go-sql-driver/mysql"

	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
)

func (d *DumpModel) Create(name string, cron_job string, connection_id int) (int, error) {
	task, err := config.DB.Exec("INSERT INTO backup ( name, cron_job, connection_id, created_at) VALUES( ?, ?, ?, NOW())", name, cron_job, connection_id)
	if err != nil {
		return 0, err
	}
	id, _ := task.LastInsertId()
	return int(id), nil
}

func (d *DumpModel) GetById(id int) (DumpModel, error) {
	err := config.DB.QueryRow("SELECT * FROM backup WHERE id = ?", id).Scan(&d.Id, &d.Name, &d.Cron_job, &d.Connection_id, &d.Created_at, &d.Active)
	if err != nil {
		return DumpModel{}, err
	}
	return *d, nil
}

func (d *DumpModel) GetAll() ([]DumpModel, error) {
	rows, err := config.DB.Query("SELECT * FROM backup")
	if err != nil {
		return []DumpModel{}, err
	}
	defer rows.Close()

	backups := []DumpModel{}

	for rows.Next() {
		var d DumpModel
		err := rows.Scan(&d.Id, &d.Name, &d.Cron_job, &d.Connection_id, &d.Created_at, &d.Active)
		if err != nil {
			return []DumpModel{}, err
		}
		backups = append(backups, d)
	}
	return backups, nil
}

func (d *DumpModel) GetByUserId(userId int) ([]DumpModel, error) {
	rows, err := config.DB.Query(`
		SELECT backup.id, backup.name, backup.cron_job, backup.connection_id, backup.created_at, backup.active, connection.db_name, connection.db_type
		FROM backup
		Join connection ON backup.connection_id = connection.id
		WHERE connection.user_id = ?`, userId)
	if err != nil {
		return []DumpModel{}, err
	}
	defer rows.Close()

	backups := []DumpModel{}

	for rows.Next() {
		var d DumpModel
		err := rows.Scan(&d.Id, &d.Name, &d.Cron_job, &d.Connection_id, &d.Created_at, &d.Active, &d.Db_name, &d.Db_type)
		if err != nil {
			return []DumpModel{}, err
		}
		backups = append(backups, d)
	}
	return backups, nil
}

func (d *DumpModel) Update(id int, active bool) (bool, error) {
	fmt.Println(active)
	_, err := config.DB.Exec("UPDATE backup SET active = ? WHERE id = ?", active, id)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (d *DumpModel) Delete(id int) (bool, error) {
	_, err := config.DB.Exec("DELETE FROM backup WHERE id = ?", id)
	if err != nil {
		return false, err
	}
	return true, nil
}
