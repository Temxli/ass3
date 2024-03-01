// services/contact/internal/repository/repository.go
package repository

import "services/contact/internal/domain"

// ContactRepository представляет интерфейс репозитория для работы с контактами
type ContactRepository interface {
    // CreateContact создает новый контакт
    CreateContact(contact *domain.Contact) error
    
    // GetContactByID возвращает контакт по его идентификатору
    GetContactByID(contactID int) (*domain.Contact, error)
    
    // UpdateContact обновляет информацию о контакте
    UpdateContact(contact *domain.Contact) error
    
    // DeleteContact удаляет контакт
    DeleteContact(contactID int) error
}

// GroupRepository представляет интерфейс репозитория для работы с группами
type GroupRepository interface {
    // CreateGroup создает новую группу
    CreateGroup(group *domain.Group) error
    
    // GetGroupByID возвращает группу по ее идентификатору
    GetGroupByID(groupID int) (*domain.Group, error)
    
    // AddContactToGroup добавляет контакт в группу
    AddContactToGroup(contactID, groupID int) error
    
    // GetContactsInGroup возвращает список контактов в группе
    GetContactsInGroup(groupID int) ([]*domain.Contact, error)
}
