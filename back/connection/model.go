package connection

type ConnectionModel struct {
	Id       int
	Name     string
	Host     string
	Port     string
	User     string
	Password string
	Db_name  string
	Db_type  string
	User_id  int
}
