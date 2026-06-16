package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "postgres://postgres:Megake123@localhost:5432/gymdb?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query(`SELECT s.id, p.package_name, p.pricing_type, p.total_sessions FROM "Subscription" s JOIN "MembershipPackage" p ON s.package_id = p.id WHERE p.package_name ILIKE '%bơi lội%' ORDER BY s.id DESC`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var name, pType string
		var sessions sql.NullInt32
		rows.Scan(&id, &name, &pType, &sessions)
		fmt.Printf("SubID: %d, Name: %s, Type: %s, Sessions: %d (Valid: %v)\n", id, name, pType, sessions.Int32, sessions.Valid)
	}
}
