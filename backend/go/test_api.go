package main

import (
	
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func createToken(accountID int, username, role string) string {
	claims := jwt.MapClaims{
		"sub":        fmt.Sprintf("%d", accountID),
		"username":   username,
		"role":       role,
		"token_type": "access",
		"exp":        time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := "7L8AkJj37hsCT8jeBl73R9wlQ+JS9RKqDcRnERr14bw=" // From auth_jwt.go
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

func main() {
	// Test Member 1 (Account 4)
	token1 := createToken(4, "Nguyễn Văn A", "MEMBER")
	req1, _ := http.NewRequest("GET", "http://localhost:8080/members/me/subscriptions", nil)
	req1.Header.Set("Authorization", "Bearer "+token1)
	
	// Test Member 2 (Account 30 - Hồng Nhân - Member 22)
	token2 := createToken(30, "Hồng Nhân", "MEMBER")
	req2, _ := http.NewRequest("GET", "http://localhost:8080/members/me/subscriptions", nil)
	req2.Header.Set("Authorization", "Bearer "+token2)

	client := &http.Client{}
	
	resp1, err := client.Do(req1)
	if err != nil {
		log.Fatal(err)
	}
	defer resp1.Body.Close()
	body1, _ := ioutil.ReadAll(resp1.Body)
	fmt.Println("Member 1 (Account 4) Subscriptions:")
	fmt.Println(string(body1)[:min(len(body1), 200)] + "...\n")

	resp2, err := client.Do(req2)
	if err != nil {
		log.Fatal(err)
	}
	defer resp2.Body.Close()
	body2, _ := ioutil.ReadAll(resp2.Body)
	fmt.Println("Member 22 (Account 30) Subscriptions:")
	fmt.Println(string(body2)[:min(len(body2), 200)] + "...\n")
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
