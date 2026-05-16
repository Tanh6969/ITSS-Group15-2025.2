package main

import (
	"database/sql"
	"log"
	"time"

	"gym-management/tools/seeder/common"
)

type FeedbackSeed struct {
	MemberUsername    string
	ProcessorUsername string
	EquipmentName     string
	Content           string
	SentAt            string
	ResolutionNote    string
	Status            string
}

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding feedback...")

	seeds := []FeedbackSeed{
		{
			MemberUsername:    "member01",
			ProcessorUsername: "manager01",
			EquipmentName:     "Olympic Bench Press",
			Content:           "Bench surface feels unstable on the left side.",
			SentAt:            "2026-04-10 11:00:00",
			ResolutionNote:    "Maintenance team tightened all bolts and retested.",
			Status:            "Resolved",
		},
		{
			MemberUsername:    "member02",
			ProcessorUsername: "manager01",
			EquipmentName:     "Treadmill Pro 3000",
			Content:           "Speed changes are delayed at higher levels.",
			SentAt:            "2026-04-11 19:30:00",
			ResolutionNote:    "Firmware update scheduled.",
			Status:            "Pending",
		},
	}

	for _, seed := range seeds {
		memberID, err := findMemberIDByUsername(db, seed.MemberUsername)
		if err != nil {
			log.Fatalf("cannot find member %s: %v", seed.MemberUsername, err)
		}

		processorID, err := findEmployeeIDByUsername(db, seed.ProcessorUsername)
		if err != nil {
			log.Fatalf("cannot find processor %s: %v", seed.ProcessorUsername, err)
		}

		equipmentID, err := findEquipmentIDByName(db, seed.EquipmentName)
		if err != nil {
			log.Fatalf("cannot find equipment %s: %v", seed.EquipmentName, err)
		}

		feedbackID, err := ensureFeedback(db, memberID, processorID, equipmentID, seed)
		if err != nil {
			log.Fatalf("failed to ensure feedback for member %s: %v", seed.MemberUsername, err)
		}

		log.Printf("ok feedback member=%s feedback_id=%d", seed.MemberUsername, feedbackID)
	}

	log.Println("done seeding feedback")
}

func findMemberIDByUsername(db *sql.DB, username string) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT m.id
		 FROM "Member" m
		 JOIN "Account" a ON a.id = m.account_id
		 WHERE a.username=$1`,
		username,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func findEmployeeIDByUsername(db *sql.DB, username string) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT e.id
		 FROM "Employee" e
		 JOIN "Account" a ON a.id = e.account_id
		 WHERE a.username=$1`,
		username,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func findEquipmentIDByName(db *sql.DB, equipmentName string) (int, error) {
	var id int
	err := db.QueryRow(`SELECT id FROM "Equipment" WHERE equipment_name=$1 ORDER BY id LIMIT 1`, equipmentName).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func ensureFeedback(db *sql.DB, memberID, processorID, equipmentID int, seed FeedbackSeed) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT id
		 FROM "Feedback"
		 WHERE member_id=$1 AND processor_id=$2 AND equipment_id=$3 AND content=$4`,
		memberID,
		processorID,
		equipmentID,
		seed.Content,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	sentAt, err := time.Parse("2006-01-02 15:04:05", seed.SentAt)
	if err != nil {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Feedback" (member_id, processor_id, equipment_id, content, sent_at, resolution_note, status)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id`,
		memberID,
		processorID,
		equipmentID,
		seed.Content,
		sentAt,
		seed.ResolutionNote,
		seed.Status,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}
