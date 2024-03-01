// services/contact/internal/repository/postgres.go
package repository

import (
    "database/sql"
    "services/contact/internal/domain"
)

type PostgresRepository struct {
    db *sql.DB
}
func NewPostgresRepository(db *sql.DB) *PostgresRepository {
    return &PostgresRepository{db: db}
}
