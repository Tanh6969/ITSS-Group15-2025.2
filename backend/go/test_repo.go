package main

import (
	"encoding/json"
	"fmt"
	"log"

	
	"gym-management/internal/repository"

	"database/sql"
	_ "github.com/lib/pq"
)

func main() {
	connStr := "postgres://postgres:Megake123@localhost:5432/gymdb?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	repo := repository.NewSubscriptionRepository(db)
	histories, _, err := repo.GetByMemberID(1, 1, 10)
	if err != nil {
		log.Fatal(err)
	}

	for _, h := range histories {
		b, _ := json.Marshal(h)
		fmt.Printf("History: %s\n", string(b))
	}
}
