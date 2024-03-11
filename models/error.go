package models

import (
	"net/http"
)

type ApiError struct {
	HttpCode int    `json:"http_code"`
	Message  string `json:"message"`
}

func (e ApiError) NewInvalidRequest(msg string) ApiError {
	e.HttpCode = http.StatusBadRequest
	e.Message = "Invalid request: " + msg

	return e
}
