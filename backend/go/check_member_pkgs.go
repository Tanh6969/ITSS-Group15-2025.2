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

	query := `SELECT m.id, COALESCE(m.full_name, ''), COALESCE(p.package_name, '')
	FROM "Member" m
	LEFT JOIN (
		SELECT DISTINCT ON (member_id) member_id, package_id, registration_date
		FROM "Subscription"
		ORDER BY member_id, id DESC
	) s ON m.id = s.member_id
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id
	ORDER BY m.id DESC LIMIT 10`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var name, pkg string
		rows.Scan(&id, &name, &pkg)
		fmt.Printf("MemberID: %d, Name: %s, Package: %s\n", id, name, pkg)
	}
}
