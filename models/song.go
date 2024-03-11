package models

type Song struct {
	Channel   Channel
	Duration  Duration
	Id        string
	Name      string
	Published string
	Thumbnail string
	Views     Views
}

type Channel struct {
	Name string
	Url  string
}

type Duration struct {
	Label   string
	Seconds int32
}

type Views struct {
	Count uint32
	Label string
}
