package main

import (
	"database/sql"
	"log"
	"time"

	"gym-management/tools/seeder/common"
)

type FacilitySeed struct {
	Name   string
	Type   string
	Status string
}

type EquipmentSeed struct {
	FacilityName        string
	EquipmentName       string
	Origin              string
	MaintenanceDeadline string
	Status              string
}

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding facilities and equipment...")

	facilities := []FacilitySeed{
		{Name: "Main Weight Room", Type: "Weight Training", Status: "Operating"},
		{Name: "Cardio Zone", Type: "Cardio", Status: "Operating"},
		{Name: "Yoga Studio", Type: "Group Class", Status: "Operating"},
	}

	facilityIDs := make(map[string]int, len(facilities))
	for _, facility := range facilities {
		id, err := ensureFacility(db, facility)
		if err != nil {
			log.Fatalf("failed to ensure facility %s: %v", facility.Name, err)
		}
		facilityIDs[facility.Name] = id
		log.Printf("ok facility %-18s id=%d", facility.Name, id)
	}

	equipment := []EquipmentSeed{
		{FacilityName: "Main Weight Room", EquipmentName: "Olympic Bench Press", Origin: "USA", MaintenanceDeadline: "2026-10-01", Status: "New"},
		{FacilityName: "Main Weight Room", EquipmentName: "Smith Machine X2", Origin: "Germany", MaintenanceDeadline: "2026-09-15", Status: "New"},
		{FacilityName: "Cardio Zone", EquipmentName: "Treadmill Pro 3000", Origin: "Japan", MaintenanceDeadline: "2026-08-20", Status: "Old"},
		{FacilityName: "Yoga Studio", EquipmentName: "Reformer Pilates Set", Origin: "Korea", MaintenanceDeadline: "2026-12-05", Status: "New"},
	}

	for _, item := range equipment {
		facilityID, found := facilityIDs[item.FacilityName]
		if !found {
			log.Fatalf("missing facility for equipment %s", item.EquipmentName)
		}

		id, err := ensureEquipment(db, facilityID, item)
		if err != nil {
			log.Fatalf("failed to ensure equipment %s: %v", item.EquipmentName, err)
		}
		log.Printf("ok equipment %-22s id=%d", item.EquipmentName, id)
	}

	log.Println("done seeding facilities and equipment")
}

func ensureFacility(db *sql.DB, seed FacilitySeed) (int, error) {
	var id int
	err := db.QueryRow(`SELECT id FROM "Facility" WHERE facility_name=$1`, seed.Name).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Facility" (facility_name, facility_type, status)
		 VALUES ($1, $2, $3)
		 RETURNING id`,
		seed.Name,
		seed.Type,
		seed.Status,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func ensureEquipment(db *sql.DB, facilityID int, seed EquipmentSeed) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT id FROM "Equipment" WHERE facility_id=$1 AND equipment_name=$2`,
		facilityID,
		seed.EquipmentName,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	maintenanceDate, err := time.Parse("2006-01-02", seed.MaintenanceDeadline)
	if err != nil {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Equipment" (facility_id, equipment_name, origin, maintenance_deadline, status)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id`,
		facilityID,
		seed.EquipmentName,
		seed.Origin,
		maintenanceDate,
		seed.Status,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}
