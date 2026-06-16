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

	rows, err := db.Query(`SELECT id, account_id, full_name FROM "Member" LIMIT 10`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var accId sql.NullInt32
		var name string
		rows.Scan(&id, &accId, &name)
		fmt.Printf("MemberID: %d, AccountID: %v, Name: %s\n", id, accId.Int32, name)
	}
}
