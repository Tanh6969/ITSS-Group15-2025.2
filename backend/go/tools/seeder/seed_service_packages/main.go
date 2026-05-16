package main

import (
	"database/sql"
	"log"

	"gym-management/tools/seeder/common"
)

type CategorySeed struct {
	Name          string
	Benefits      string
	AllowedGender string
}

type PackageSeed struct {
	CategoryName string
	PackageName  string
	DurationDays int
	Price        float64
	IsActive     bool
}

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding service categories and membership packages...")

	categories := []CategorySeed{
		{Name: "NORMAL", Benefits: "Gym floor access during opening hours", AllowedGender: "All"},
		{Name: "VIP", Benefits: "Priority support, PT consultation, sauna included", AllowedGender: "All"},
		{Name: "FEMALE_ONLY", Benefits: "Women-only classes and private area access", AllowedGender: "Female"},
	}

	categoryIDs := make(map[string]int, len(categories))
	for _, category := range categories {
		id, err := ensureCategory(db, category)
		if err != nil {
			log.Fatalf("failed to ensure category %s: %v", category.Name, err)
		}
		categoryIDs[category.Name] = id
		log.Printf("ok category %-12s id=%d", category.Name, id)
	}

	packages := []PackageSeed{
		{CategoryName: "NORMAL", PackageName: "BASIC_30", DurationDays: 30, Price: 500000, IsActive: true},
		{CategoryName: "NORMAL", PackageName: "STANDARD_90", DurationDays: 90, Price: 1350000, IsActive: true},
		{CategoryName: "VIP", PackageName: "VIP_ELITE_180", DurationDays: 180, Price: 4200000, IsActive: true},
		{CategoryName: "FEMALE_ONLY", PackageName: "WOMEN_FIT_30", DurationDays: 30, Price: 620000, IsActive: true},
	}

	hasIsActive, err := common.ColumnExists(db, "MembershipPackage", "is_active")
	if err != nil {
		log.Fatalf("failed to check MembershipPackage.is_active: %v", err)
	}

	for _, pkg := range packages {
		categoryID, found := categoryIDs[pkg.CategoryName]
		if !found {
			log.Fatalf("missing category id for package %s", pkg.PackageName)
		}

		id, err := ensureMembershipPackage(db, categoryID, pkg, hasIsActive)
		if err != nil {
			log.Fatalf("failed to ensure package %s: %v", pkg.PackageName, err)
		}
		log.Printf("ok package %-15s id=%d", pkg.PackageName, id)
	}

	log.Println("done seeding service categories and membership packages")
}

func ensureCategory(db *sql.DB, seed CategorySeed) (int, error) {
	var id int
	err := db.QueryRow(`SELECT id FROM "ServiceCategory" WHERE category_name=$1`, seed.Name).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "ServiceCategory" (category_name, benefits_description, allowed_gender)
		 VALUES ($1, $2, $3)
		 RETURNING id`,
		seed.Name,
		seed.Benefits,
		seed.AllowedGender,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func ensureMembershipPackage(db *sql.DB, categoryID int, seed PackageSeed, hasIsActive bool) (int, error) {
	var id int
	err := db.QueryRow(`SELECT id FROM "MembershipPackage" WHERE package_name=$1`, seed.PackageName).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	if hasIsActive {
		err = db.QueryRow(
			`INSERT INTO "MembershipPackage" (category_id, package_name, duration_days, price, is_active)
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING id`,
			categoryID,
			seed.PackageName,
			seed.DurationDays,
			seed.Price,
			seed.IsActive,
		).Scan(&id)
	} else {
		err = db.QueryRow(
			`INSERT INTO "MembershipPackage" (category_id, package_name, duration_days, price)
			 VALUES ($1, $2, $3, $4)
			 RETURNING id`,
			categoryID,
			seed.PackageName,
			seed.DurationDays,
			seed.Price,
		).Scan(&id)
	}
	if err != nil {
		return 0, err
	}
	return id, nil
}
