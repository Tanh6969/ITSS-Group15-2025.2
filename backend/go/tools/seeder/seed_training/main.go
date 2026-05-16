package main

import (
	"database/sql"
	"log"
	"time"

	"gym-management/tools/seeder/common"
)

type TrainingSeed struct {
	MemberUsername   string
	PTUsername       string
	RequestedStart   string
	RequestedEnd     string
	TrainingPlanNote string
	BookingStatus    string
	FacilityName     string
	SessionTime      string
	AttendanceStatus string
	PTFeedback       string
}

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding training bookings and sessions...")

	seeds := []TrainingSeed{
		{
			MemberUsername:   "member01",
			PTUsername:       "pt01",
			RequestedStart:   "2026-04-20 18:00:00",
			RequestedEnd:     "2026-04-20 19:30:00",
			TrainingPlanNote: "Strength foundation and posture correction",
			BookingStatus:    "Accepted",
			FacilityName:     "Main Weight Room",
			SessionTime:      "2026-04-20 18:00:00",
			AttendanceStatus: "Present",
			PTFeedback:       "Good effort, increase squat volume next week",
		},
		{
			MemberUsername:   "member02",
			PTUsername:       "pt02",
			RequestedStart:   "2026-04-21 07:00:00",
			RequestedEnd:     "2026-04-21 08:30:00",
			TrainingPlanNote: "Fat-loss plan with HIIT and nutrition guidance",
			BookingStatus:    "Accepted",
			FacilityName:     "Cardio Zone",
			SessionTime:      "2026-04-21 07:00:00",
			AttendanceStatus: "Present",
			PTFeedback:       "Heart rate recovery improved",
		},
	}

	for _, seed := range seeds {
		memberID, err := findMemberIDByUsername(db, seed.MemberUsername)
		if err != nil {
			log.Fatalf("cannot find member by username %s: %v", seed.MemberUsername, err)
		}

		ptID, err := findPTEmployeeIDByUsername(db, seed.PTUsername)
		if err != nil {
			log.Fatalf("cannot find pt by username %s: %v", seed.PTUsername, err)
		}

		bookingID, err := ensureTrainingBooking(db, memberID, ptID, seed)
		if err != nil {
			log.Fatalf("failed to ensure training booking for %s: %v", seed.MemberUsername, err)
		}

		facilityID, err := findFacilityIDByName(db, seed.FacilityName)
		if err != nil {
			log.Fatalf("cannot find facility %s: %v", seed.FacilityName, err)
		}

		sessionID, err := ensureTrainingSession(db, bookingID, facilityID, seed)
		if err != nil {
			log.Fatalf("failed to ensure training session for %s: %v", seed.MemberUsername, err)
		}

		log.Printf("ok member=%s booking_id=%d session_id=%d", seed.MemberUsername, bookingID, sessionID)
	}

	log.Println("done seeding training bookings and sessions")
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

func findPTEmployeeIDByUsername(db *sql.DB, username string) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT e.id
		 FROM "Employee" e
		 JOIN "Account" a ON a.id = e.account_id
		 WHERE a.username=$1 AND UPPER(e.position)='PT'`,
		username,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func findFacilityIDByName(db *sql.DB, facilityName string) (int, error) {
	var id int
	err := db.QueryRow(`SELECT id FROM "Facility" WHERE facility_name=$1`, facilityName).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func ensureTrainingBooking(db *sql.DB, memberID, ptID int, seed TrainingSeed) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT id FROM "TrainingBooking"
		 WHERE member_id=$1 AND pt_id=$2 AND requested_start=$3 AND requested_end=$4`,
		memberID,
		ptID,
		seed.RequestedStart,
		seed.RequestedEnd,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "TrainingBooking" (member_id, pt_id, requested_start, requested_end, training_plan_note, status)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id`,
		memberID,
		ptID,
		seed.RequestedStart,
		seed.RequestedEnd,
		seed.TrainingPlanNote,
		seed.BookingStatus,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func ensureTrainingSession(db *sql.DB, bookingID, facilityID int, seed TrainingSeed) (int, error) {
	sessionTime, err := time.Parse("2006-01-02 15:04:05", seed.SessionTime)
	if err != nil {
		return 0, err
	}

	var id int
	err = db.QueryRow(
		`SELECT id FROM "TrainingSession" WHERE booking_id=$1 AND session_time=$2`,
		bookingID,
		sessionTime,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "TrainingSession" (booking_id, facility_id, session_time, attendance_status, pt_feedback)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id`,
		bookingID,
		facilityID,
		sessionTime,
		seed.AttendanceStatus,
		seed.PTFeedback,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}
