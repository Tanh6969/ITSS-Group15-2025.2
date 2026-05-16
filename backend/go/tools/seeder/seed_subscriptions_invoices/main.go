package main

import (
	"database/sql"
	"log"
	"time"

	"gym-management/tools/seeder/common"
)

type SubscriptionInvoiceSeed struct {
	MemberUsername string
	PackageName    string
	RegistrationAt string
	StartDate      string
	EndDate        string
	Status         string
	TotalAmount    float64
	PaymentStatus  string
	PaymentMethod  string
	InvoiceNotes   string
}

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding subscriptions and invoices...")

	seeds := []SubscriptionInvoiceSeed{
		{
			MemberUsername: "member01",
			PackageName:    "BASIC_30",
			RegistrationAt: "2026-04-01 09:00:00",
			StartDate:      "2026-04-01",
			EndDate:        "2026-05-01",
			Status:         "Active",
			TotalAmount:    500000,
			PaymentStatus:  "Paid",
			PaymentMethod:  "Cash",
			InvoiceNotes:   "Walk-in registration",
		},
		{
			MemberUsername: "member02",
			PackageName:    "STANDARD_90",
			RegistrationAt: "2026-04-02 10:00:00",
			StartDate:      "2026-04-02",
			EndDate:        "2026-07-01",
			Status:         "Active",
			TotalAmount:    1350000,
			PaymentStatus:  "Paid",
			PaymentMethod:  "Card",
			InvoiceNotes:   "Card POS payment",
		},
		{
			MemberUsername: "member03",
			PackageName:    "VIP_ELITE_180",
			RegistrationAt: "2026-04-03 14:15:00",
			StartDate:      "2026-04-03",
			EndDate:        "2026-09-30",
			Status:         "Active",
			TotalAmount:    4200000,
			PaymentStatus:  "Pending",
			PaymentMethod:  "Bank Transfer",
			InvoiceNotes:   "Waiting for transfer confirmation",
		},
	}

	for _, seed := range seeds {
		memberID, err := findMemberIDByUsername(db, seed.MemberUsername)
		if err != nil {
			log.Fatalf("cannot find member by username %s: %v", seed.MemberUsername, err)
		}

		packageID, err := findPackageIDByName(db, seed.PackageName)
		if err != nil {
			log.Fatalf("cannot find package %s: %v", seed.PackageName, err)
		}

		subscriptionID, err := ensureSubscription(db, memberID, packageID, seed)
		if err != nil {
			log.Fatalf("failed to ensure subscription for %s: %v", seed.MemberUsername, err)
		}

		invoiceID, err := ensureInvoice(db, memberID, subscriptionID, seed)
		if err != nil {
			log.Fatalf("failed to ensure invoice for %s: %v", seed.MemberUsername, err)
		}

		log.Printf("ok member=%s subscription_id=%d invoice_id=%d", seed.MemberUsername, subscriptionID, invoiceID)
	}

	log.Println("done seeding subscriptions and invoices")
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

func findPackageIDByName(db *sql.DB, packageName string) (int, error) {
	var id int
	err := db.QueryRow(`SELECT id FROM "MembershipPackage" WHERE package_name=$1`, packageName).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func ensureSubscription(db *sql.DB, memberID, packageID int, seed SubscriptionInvoiceSeed) (int, error) {
	startDate, err := time.Parse("2006-01-02", seed.StartDate)
	if err != nil {
		return 0, err
	}

	var id int
	err = db.QueryRow(
		`SELECT id FROM "Subscription" WHERE member_id=$1 AND package_id=$2 AND start_date=$3`,
		memberID,
		packageID,
		startDate,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	registrationAt, err := time.Parse("2006-01-02 15:04:05", seed.RegistrationAt)
	if err != nil {
		return 0, err
	}
	endDate, err := time.Parse("2006-01-02", seed.EndDate)
	if err != nil {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Subscription" (member_id, package_id, registration_date, start_date, end_date, status)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id`,
		memberID,
		packageID,
		registrationAt,
		startDate,
		endDate,
		seed.Status,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func ensureInvoice(db *sql.DB, memberID, subscriptionID int, seed SubscriptionInvoiceSeed) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT id FROM "Invoice" WHERE member_id=$1 AND subscription_id=$2`,
		memberID,
		subscriptionID,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Invoice" (member_id, subscription_id, total_amount, payment_status, payment_method, notes)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id`,
		memberID,
		subscriptionID,
		seed.TotalAmount,
		seed.PaymentStatus,
		seed.PaymentMethod,
		seed.InvoiceNotes,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}
