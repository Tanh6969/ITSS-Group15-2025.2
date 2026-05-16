package main

import (
	"log"

	"gym-management/tools/seeder/common"
)

func main() {
	common.LoadEnv()

	db, err := common.ConnectDB()
	if err != nil {
		log.Fatalf("cannot connect to db: %v", err)
	}
	defer db.Close()

	log.Println("seeding roles and accounts...")

	if err := common.ResetSequenceIfTableEmpty(db, "Role", "Role_id_seq"); err != nil {
		log.Printf("warning: could not reset Role sequence: %v", err)
	}
	if err := common.ResetSequenceIfTableEmpty(db, "Account", "Account_id_seq"); err != nil {
		log.Printf("warning: could not reset Account sequence: %v", err)
	}

	roles := []string{"OWNER", "MANAGER", "PT", "MEMBER"}
	if _, err := common.EnsureRoles(db, roles); err != nil {
		log.Fatalf("failed to seed roles: %v", err)
	}

	accounts := []common.AccountSeed{
		{Username: "owner", Password: "Admin@123", RoleName: "OWNER"},
		{Username: "manager01", Password: "Manager@123", RoleName: "MANAGER"},
		{Username: "pt01", Password: "Trainer@123", RoleName: "PT"},
		{Username: "pt02", Password: "Trainer@123", RoleName: "PT"},
		{Username: "member01", Password: "Member@123", RoleName: "MEMBER"},
		{Username: "member02", Password: "Member@123", RoleName: "MEMBER"},
		{Username: "member03", Password: "Member@123", RoleName: "MEMBER"},
	}

	for _, account := range accounts {
		id, err := common.EnsureAccount(db, account)
		if err != nil {
			log.Fatalf("failed to seed account %s: %v", account.Username, err)
		}
		log.Printf("ok account %-10s id=%d role=%s", account.Username, id, account.RoleName)
	}

	log.Println("done seeding roles and accounts")
}
