// services/contact/internal/interfaces/usecase.go
package interfaces

import "services/contact/internal/domain"

type ContactUseCase interface {
    GetAllContacts() ([]*domain.Contact, error)
    GetContactByID(id int) (*domain.Contact, error)
    CreateContact(contact *domain.Contact) error
    UpdateContact(contact *domain.Contact) error
    DeleteContact(id int) error
}
