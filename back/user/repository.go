package user

import (
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jean-bernard-laguerre/plateforme-safebase/config"
)

func (u *UserModel) Create(
	email string, password string,
) (int, error) {
	validation, _ := u.GetByEmail(email)
	if validation.Email != "" {
		return 0, fmt.Errorf("Email already exists")
	}
	result, err := config.DB.Exec("INSERT INTO user(email, password) VALUES(?, ?)", email, password)
	if err != nil {
		fmt.Println(err)
		return 0, err
	}

	id, _ := result.LastInsertId()
	return int(id), nil
}

func (u UserModel) GetById(id int) UserModel {
	err := config.DB.QueryRow("SELECT * FROM user WHERE id = ?", id).Scan(
		&u.Id, &u.Email, &u.Password)
	if err != nil {
		fmt.Println(err)
	}
	return u
}

func (u UserModel) GetByEmail(email string) (UserModel, error) {
	err := config.DB.QueryRow("SELECT * FROM user WHERE email = ?", email).Scan(
		&u.Id, &u.Email, &u.Password)
	if err != nil {
		return u, err
	}
	return u, nil
}

/* func (u *UserModel) GetAll() []UserModel {
	rows, err := config.DB.Query("SELECT * FROM user")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()

	users := []UserModel{}

	for rows.Next() {
		var user UserModel
		err := rows.Scan(&user.id, &user.Email, &user.Password)
		if err != nil {
			fmt.Println(err)
		}
		users = append(users, user)
	}

	return users
} */

func (u *UserModel) Delete(id int) (bool, error) {
	_, err := config.DB.Exec("DELETE FROM user WHERE id = ?", id)
	if err != nil {
		fmt.Println(err)
		return false, err
	}
	return true, nil
}
