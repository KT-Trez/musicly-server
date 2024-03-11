package validators

import (
	"net/http"
)

func MakeIdValidator(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		if len(id) == 0 {
			http.Error(w, "Param: 'id' is required", http.StatusBadRequest)
		}
		fn(w, r)
	}
}

func MakePathValidator(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path[0:4] != "/v3/" {
			http.Error(w, "Resource not found", http.StatusNotFound)
			return
		}

		//if r.Method != "GET" || r.Method != "POST" {
		//	http.Error(w, "temp", http.StatusMethodNotAllowed)
		//	return
		//}

		fn(w, r)
	}
}
