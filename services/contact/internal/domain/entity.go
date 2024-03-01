// services/contact/internal/domain/entity.go
package domain

import (
    "fmt"
    "strings"
)

// Contact представл€ет сущность контакта
type Contact struct {
    ID          int
    FirstName   string
    LastName    string
    PhoneNumber string
}

// NewContact создает новый экземпл€р структуры Contact
func NewContact(id int, firstName, lastName, phoneNumber string) *Contact {
    return &Contact{
        ID:          id,
        FirstName:   firstName,
        LastName:    lastName,
        PhoneNumber: phoneNumber,
    }
}

// FullName возвращает полное им€ контакта
func (c *Contact) FullName() string {
    return fmt.Sprintf("%s %s", c.FirstName, c.LastName)
}

// Group представл€ет сущность группы
type Group struct {
    ID   int
    Name string
}

// NewGroup создает новый экземпл€р структуры Group
func NewGroup(id int, name string) *Group {
    return &Group{
        ID:   id,
        Name: name,
    }
}
