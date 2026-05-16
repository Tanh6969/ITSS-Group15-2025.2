package common

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type AccountSeed struct {
	Username string
	Password string
	RoleName string
}

func LoadEnv() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("warning: .env not found, falling back to system env")
	}
}

func ConnectDB() (*sql.DB, error) {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "gymdb")
	sslMode := getEnv("DB_SSLMODE", "disable")

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbName, sslMode,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func EnsureRoles(db *sql.DB, roles []string) (map[string]int, error) {
	ids := make(map[string]int, len(roles))
	for _, role := range roles {
		id, err := EnsureRole(db, role)
		if err != nil {
			return nil, err
		}
		ids[strings.ToUpper(role)] = id
	}
	return ids, nil
}

func EnsureRole(db *sql.DB, roleName string) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT id FROM "Role" WHERE UPPER(role_name)=UPPER($1)`,
		roleName,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Role" (role_name) VALUES (UPPER($1)) RETURNING id`,
		roleName,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func EnsureAccount(db *sql.DB, seed AccountSeed) (int, error) {
	var id int
	err := db.QueryRow(
		`SELECT id FROM "Account" WHERE username=$1`,
		seed.Username,
	).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	roleID, err := EnsureRole(db, seed.RoleName)
	if err != nil {
		return 0, err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(seed.Password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}

	err = db.QueryRow(
		`INSERT INTO "Account" (username, password, role_id) VALUES ($1, $2, $3) RETURNING id`,
		seed.Username, string(hash), roleID,
	).Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func ResetSequenceIfTableEmpty(db *sql.DB, tableName, sequenceName string) error {
	query := fmt.Sprintf(`SELECT COUNT(*) FROM "%s"`, tableName)
	var count int
	if err := db.QueryRow(query).Scan(&count); err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	_, err := db.Exec(fmt.Sprintf(`ALTER SEQUENCE "%s" RESTART WITH 1`, sequenceName))
	return err
}

func ColumnExists(db *sql.DB, tableName, columnName string) (bool, error) {
	var exists bool
	err := db.QueryRow(
		`SELECT EXISTS (
			SELECT 1
			FROM information_schema.columns
			WHERE table_schema='public' AND table_name=$1 AND column_name=$2
		)`,
		tableName,
		columnName,
	).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
