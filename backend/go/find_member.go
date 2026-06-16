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

	query := `SELECT s.member_id, p.package_name
	FROM "Subscription" s
	JOIN "MembershipPackage" p ON s.package_id = p.id
	WHERE p.package_name IN ('Gói bơi lội 10 buổi', 'Gói VIP nửa năm', 'Gói Pilates Tháng')`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var memberId int
		var pkg string
		rows.Scan(&memberId, &pkg)
		fmt.Printf("MemberID: %d, Package: %s\n", memberId, pkg)
	}
}
