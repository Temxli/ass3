// services/contact/internal/usecase/usecase.go
package usecase

import "services/contact/internal/domain"

// ContactUseCase представляет интерфейс Use Case для работы с контактами
type ContactUseCase interface {
    // CreateContact создает новый контакт
    CreateContact(firstName, lastName, phoneNumber string) (*domain.Contact, error)
    
    // GetContactByID возвращает контакт по его идентификатору
    GetContactByID(contactID int) (*domain.Contact, error)
    
    // UpdateContact обновляет информацию о контакте
    UpdateContact(contactID int, firstName, lastName, phoneNumber string) (*domain.Contact, error)
    
    // DeleteContact удаляет контакт
    DeleteContact(contactID int) error
}

// GroupUseCase представляет интерфейс Use Case для работы с группами
type GroupUseCase interface {
    // CreateGroup создает новую группу
    CreateGroup(name string) (*domain.Group, error)
    
    // GetGroupByID возвращает группу по ее идентификатору
    GetGroupByID(groupID int) (*domain.Group, error)
    
    // AddContactToGroup добавляет контакт в группу
    AddContactToGro
