// services/contact/internal/delivery/handler.go
package delivery

import (
    "net/http"
    "services/contact/internal/usecase"
)

type ContactHandler struct {
    UseCase usecase.ContactUseCase
}

func NewContactHandler(useCase usecase.ContactUseCase) *ContactHandler {
    return &ContactHandler{UseCase: useCase}
}