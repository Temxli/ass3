// services/contact/main.go
package main

import (
    "database/sql"
    "fmt"
    "log"
    "net/http"
    "services/contact/internal"
    "services/contact/internal/repository"
    "services/contact/internal/delivery"
    "services/contact/internal/usecase"

    _ "github.com/lib/pq"
)

func main() {
    // Подключение к базе данных PostgreSQL
    db, err := sql.Open("postgres", "postgres://user:password@localhost/contactdb?sslmode=disable")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Создание экземпляра контейнера зависимостей
    container := internal.NewContainer(
        repository.NewPostgresContactRepository(db),
        repository.NewPostgresGroupRepository(db),
    )

    // Запуск HTTP сервера
    http.Handle("/contacts", delivery.NewContactHandler(container.ContactUseCase))
    http.Handle("/groups", delivery.NewGroupHandler(container.GroupUseCase))

    // Старт HTTP сервера
    fmt.Println("Starting server on port 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
