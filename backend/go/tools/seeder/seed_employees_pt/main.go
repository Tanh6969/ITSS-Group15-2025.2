package main

import (
	"database/sql"
	"log"

	"gym-management/tools/seeder/common"
)

type EmployeeSeed struct {
	Username            string
	Password            string
	RoleName            string
	FullName            string
	Phone               string
	Position            string
	Salary              float64
	ProfessionalProfile string
	BodyIndex           string
	ExperienceYears     string
	Achievements        string
	AvailableSchedule   string
}

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding employees and pt detail...")

	seeds := []EmployeeSeed{
		{
			Username: "manager01", Password: "Manager@123", RoleName: "MANAGER",
			FullName: "Nguyen Manh Quan", Phone: "0900000001", Position: "MANAGER", Salary: 22000000,
		},
		{
			Username: "pt01", Password: "Trainer@123", RoleName: "PT",
			FullName: "Tran Hai Nam", Phone: "0900000002", Position: "PT", Salary: 18000000,
			ProfessionalProfile: "Certified personal trainer with strength focus",
			BodyIndex:           "Height 178cm, Weight 75kg",
			ExperienceYears:     "5",
			Achievements:        "Top PT of quarter",
			AvailableSchedule:   "Mon-Fri 06:00-11:00, 17:00-21:00",
		},
		{
			Username: "pt02", Password: "Trainer@123", RoleName: "PT",
			FullName: "Le Thi Thu", Phone: "0900000003", Position: "PT", Salary: 17000000,
			ProfessionalProfile: "Nutrition and fat-loss specialist",
			BodyIndex:           "Height 165cm, Weight 54kg",
			ExperienceYears:     "4",
			Achievements:        "Led 50+ successful transformation programs",
			AvailableSchedule:   "Tue-Sun 08:00-12:00, 16:00-20:00",
		},
	}

	if _, err := common.EnsureRoles(db, []string{"MANAGER", "PT"}); err != nil {
		log.Fatalf("failed to ensure roles: %v", err)
	}

	for _, seed := range seeds {
		accountID, err := common.EnsureAccount(db, common.AccountSeed{
			Username: seed.Username,
			Password: seed.Password,
			RoleName: seed.RoleName,
		})
		if err != nil {
			log.Fatalf("failed to ensure account %s: %v", seed.Username, err)
		}

		employeeID, err := ensureEmployee(db, accountID, seed)
		if err != nil {
			log.Fatalf("failed to ensure employee for %s: %v", seed.Username, err)
		}

		if seed.Position == "PT" {
			if err := ensurePTDetail(db, employeeID, seed); err != nil {
				log.Fatalf("failed to ensure pt detail for %s: %v", seed.Username, err)
			}
		}

		log.Printf("ok employee %-10s employee_id=%d", seed.Username, employeeID)
	}

	log.Println("done seeding employees and pt detail")
}

func ensureEmployee(db *sql.DB, accountID int, seed EmployeeSeed) (int, error) {
	var employeeID int
	err := db.QueryRow(`SELECT id FROM "Employee" WHERE account_id=$1`, accountID).Scan(&employeeID)
	if err == nil {
		return employeeID, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Employee" (full_name, phone, position, salary, account_id)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id`,
		seed.FullName, seed.Phone, seed.Position, seed.Salary, accountID,
	).Scan(&employeeID)
	if err != nil {
		return 0, err
	}
	return employeeID, nil
}

func ensurePTDetail(db *sql.DB, employeeID int, seed EmployeeSeed) error {
	var exists bool
	if err := db.QueryRow(`SELECT EXISTS(SELECT 1 FROM "PT_Detail" WHERE employee_id=$1)`, employeeID).Scan(&exists); err != nil {
		return err
	}
	if exists {
		return nil
	}

	_, err := db.Exec(
		`INSERT INTO "PT_Detail"
		 (employee_id, professional_profile, body_index, experience_years, achievements, available_schedule)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		employeeID,
		seed.ProfessionalProfile,
		seed.BodyIndex,
		seed.ExperienceYears,
		seed.Achievements,
		seed.AvailableSchedule,
	)
	return err
}
