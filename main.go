package main

import (
	"log"
	"net/http"
	"os"
	"symfi-api/controllers"
	"symfi-api/validators"
)

func main() {
	log.Println("Starting server at :8080")

	addr := os.Getenv("SERVER_ADDRESS")
	if len(addr) == 0 {
		addr = ":8080"
	}

	m := http.NewServeMux()

	m.HandleFunc("/v3/ping", validators.MakePathValidator(validators.MakeIdValidator(controllers.GETPing)))
	m.HandleFunc("/v3/song/{id}", validators.MakePathValidator(controllers.GETSong))

	m.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "Resource not found", http.StatusNotFound)
	})

	if err := http.ListenAndServe(addr, m); err != nil {
		log.Fatal(err)
	}
}
