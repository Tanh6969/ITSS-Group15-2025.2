package main

import (
	"database/sql"
	"log"
	"time"

	"gym-management/tools/seeder/common"
)

type MemberSeed struct {
	Username string
	Password string
	FullName string
	Phone    string
	Email    string
	Gender   string
	DOB      string
	Address  string
}

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding members...")

	if _, err := common.EnsureRoles(db, []string{"MEMBER"}); err != nil {
		log.Fatalf("failed to ensure role MEMBER: %v", err)
	}

	seeds := []MemberSeed{
		{
			Username: "member01", Password: "Member@123", FullName: "Pham Minh Duc",
			Phone: "0911000001", Email: "member01@gym.local", Gender: "Male", DOB: "1998-04-12",
			Address: "District 1, Ho Chi Minh City",
		},
		{
			Username: "member02", Password: "Member@123", FullName: "Nguyen Thanh Ha",
			Phone: "0911000002", Email: "member02@gym.local", Gender: "Female", DOB: "2000-09-01",
			Address: "District 7, Ho Chi Minh City",
		},
		{
			Username: "member03", Password: "Member@123", FullName: "Le Quoc Bao",
			Phone: "0911000003", Email: "member03@gym.local", Gender: "Male", DOB: "1995-11-24",
			Address: "Thu Duc City, Ho Chi Minh City",
		},
	}

	for _, seed := range seeds {
		accountID, err := common.EnsureAccount(db, common.AccountSeed{
			Username: seed.Username,
			Password: seed.Password,
			RoleName: "MEMBER",
		})
		if err != nil {
			log.Fatalf("failed to ensure account %s: %v", seed.Username, err)
		}

		memberID, err := ensureMember(db, accountID, seed)
		if err != nil {
			log.Fatalf("failed to ensure member %s: %v", seed.Username, err)
		}

		log.Printf("ok member %-10s member_id=%d", seed.Username, memberID)
	}

	log.Println("done seeding members")
}

func ensureMember(db *sql.DB, accountID int, seed MemberSeed) (int, error) {
	var memberID int
	err := db.QueryRow(`SELECT id FROM "Member" WHERE account_id=$1`, accountID).Scan(&memberID)
	if err == nil {
		return memberID, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	dob, err := time.Parse("2006-01-02", seed.DOB)
	if err != nil {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Member" (full_name, phone, email, gender, dob, address, account_id)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id`,
		seed.FullName,
		seed.Phone,
		seed.Email,
		seed.Gender,
		dob,
		seed.Address,
		accountID,
	).Scan(&memberID)
	if err != nil {
		return 0, err
	}
	return memberID, nil
}
