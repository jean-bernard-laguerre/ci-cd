package config

type ParamsHandler struct {
	Page   int
	Limit  int
	Filter string
}

func (p *ParamsHandler) Init() *ParamsHandler {
	p.Page = 0
	p.Limit = 10
	p.Filter = ""

	return p
}
