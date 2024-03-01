// services/contact/internal/container.go
package internal

import (
    "services/contact/internal/delivery"
    "services/contact/internal/repository"
    "services/contact/internal/usecase"
)

// Container представл€ет контейнер зависимостей
type Container struct {
    ContactRepository repository.ContactRepository
    GroupRepository   repository.GroupRepository
    ContactUseCase    usecase.ContactUseCase
    GroupUseCase      usecase.GroupUseCase
    ContactHandler    *delivery.ContactHandler
}

// NewContainer создает новый экземпл€р контейнера зависимостей
func NewContainer(contactRepo repository.ContactRepository, groupRepo repository.GroupRepository) *Container {
    return &Container{
        ContactRepository: contactRepo,
        GroupRepository:   groupRepo,
        ContactUseCase:    usecase.NewContactUseCase(contactRepo),
        GroupUseCase:      usecase.NewGroupUseCase(groupRepo),
        ContactHandler:    delivery.NewContactHandler(usecase.NewContactUseCase(contactRepo)),
    }
}
