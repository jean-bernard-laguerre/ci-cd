package history

import (
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
)

type Overview struct {
	Total          int `json:"total"`
	BackupSuccess  int `json:"backup_success"`
	BackupFail     int `json:"backup_fail"`
	RestoreSuccess int `json:"restore_success"`
	RestoreFail    int `json:"restore_fail"`
}

// to create an history
func (h *HistoryModel) Create(name string, status bool, action string, created_at string, bdd_source int, bdd_target *int) (int, error) {
	result, err := config.DB.Exec("INSERT INTO history (name, status, action, created_at, bdd_source, bdd_target) VALUES(?, ?, ?, ?, ?, ?)", name, status, action, created_at, bdd_source, bdd_target)
	if err != nil {
		return 0, err
	}
	id, _ := result.LastInsertId()
	return int(id), nil
}

// to get an history by id
func (h *HistoryModel) GetById(id int) (HistoryModel, error) {
	err := config.DB.QueryRow("SELECT * FROM history WHERE id = ?", id).Scan(&h.Id, &h.Name, &h.Status, &h.Action, &h.Created_at, &h.Bdd_source, &h.Bdd_target)
	if err != nil {
		return HistoryModel{}, err
	}
	return *h, nil
}

// TODO :=> TEST THIS FUNCTION
func (h *HistoryModel) GetAll() ([]HistoryModel, error) {
	rows, err := config.DB.Query("SELECT * FROM history")
	if err != nil {
		return []HistoryModel{}, err
	}
	defer rows.Close()

	histories := []HistoryModel{}

	for rows.Next() {
		var h HistoryModel
		err := rows.Scan(&h.Id, &h.Name, &h.Status, &h.Action, &h.Created_at, &h.Bdd_source, &h.Bdd_target)
		if err != nil {
			return []HistoryModel{}, err
		}
		histories = append(histories, h)
	}

	return histories, nil
}

func (h *HistoryModel) GetByUserId(userId int, page int, limit int, filter string) ([]HistoryModel, error) {

	if filter == "" {
		filter = "%"
	}
	rows, err := config.DB.Query(`
		SELECT history.id, history.name, history.status, history.action, history.created_at, history.bdd_source, history.bdd_target, connection.db_type AS bdd_source_type, connection.name AS bdd_source_name, connection2.name AS bdd_target_name
		FROM history
		JOIN connection ON history.bdd_source = connection.id
		LEFT JOIN connection AS connection2 ON history.bdd_target = connection2.id
		WHERE connection.user_id = ? AND history.action LIKE ?
		ORDER BY history.created_at DESC
		LIMIT ? OFFSET ?`, userId, filter, limit, (page-1)*limit)
	if err != nil {
		return []HistoryModel{}, err
	}
	defer rows.Close()

	histories := []HistoryModel{}

	for rows.Next() {
		var h HistoryModel
		err := rows.Scan(&h.Id, &h.Name, &h.Status, &h.Action, &h.Created_at, &h.Bdd_source, &h.Bdd_target, &h.Bdd_source_type, &h.Bdd_source_name, &h.Bdd_target_name)
		if err != nil {
			fmt.Println(err)
			return []HistoryModel{}, err
		}
		histories = append(histories, h)
	}

	return histories, nil
}

// To delete a history
func (h *HistoryModel) Delete(id int) (bool, error) {
	_, err := config.DB.Exec("DELETE FROM history WHERE id = ?", id)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (h *HistoryModel) Overview(id int) (Overview, error) {
	var overview Overview
	err := config.DB.QueryRow(`
		SELECT COUNT(history.id) AS total,
		SUM(CASE WHEN history.action = 'backup' AND history.status = 1 THEN 1 ELSE 0 END) AS backup_success,
		SUM(CASE WHEN history.action = 'backup' AND history.status = 0 THEN 1 ELSE 0 END) AS backup_fail,
		SUM(CASE WHEN history.action = 'restore' AND history.status = 1 THEN 1 ELSE 0 END) AS restore_success,
		SUM(CASE WHEN history.action = 'restore' AND history.status = 0 THEN 1 ELSE 0 END) AS restore_fail
		FROM history
		JOIN connection ON history.bdd_source = connection.id
		WHERE connection.user_id  = ?`, id).Scan(&overview.Total, &overview.BackupSuccess, &overview.BackupFail, &overview.RestoreSuccess, &overview.RestoreFail)
	if err != nil {
		return Overview{}, err
	}

	return overview, nil
}
