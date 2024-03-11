package controllers

import (
	"net/http"
)

func GETPing(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func GETSong(w http.ResponseWriter, r *http.Request) {
	println("GET song")
}

func GETSongSearch(w http.ResponseWriter, r *http.Request) {
	println("GET song search")
}
