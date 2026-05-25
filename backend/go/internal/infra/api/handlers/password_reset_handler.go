package handlers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/infra/email"
)

type PasswordResetHandler struct {
	authRepo adapter.AuthRepository
	emailSvc *email.Service
}

func NewPasswordResetHandler(authRepo adapter.AuthRepository, emailSvc *email.Service) *PasswordResetHandler {
	return &PasswordResetHandler{authRepo: authRepo, emailSvc: emailSvc}
}

func (h *PasswordResetHandler) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	req.Email = strings.TrimSpace(req.Email)
	if req.Email == "" {
		http.Error(w, "email is required", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Kiểm tra tài khoản có tồn tại không
	account, err := h.authRepo.FindAccountByUsername(ctx, req.Email)
	if err != nil || account == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Email này không tồn tại trong hệ thống. Vui lòng kiểm tra lại.",
		})
		return
	}

	// Generate raw token + SHA-256 hash
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}
	rawToken := hex.EncodeToString(b)
	hash := sha256.Sum256([]byte(rawToken))
	tokenHash := hex.EncodeToString(hash[:])

	expiresAt := time.Now().Add(15 * time.Minute)
	if err := h.authRepo.SavePasswordResetToken(ctx, account.ID, tokenHash, expiresAt); err != nil {
		http.Error(w, "failed to save token", http.StatusInternalServerError)
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}
	resetLink := frontendURL + "/reset-password?token=" + rawToken

	if err := h.emailSvc.SendPasswordResetEmail(req.Email, account.Username, resetLink); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau.",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "ok"})
}

func (h *PasswordResetHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	req.Token = strings.TrimSpace(req.Token)
	req.NewPassword = strings.TrimSpace(req.NewPassword)

	if req.Token == "" || req.NewPassword == "" {
		http.Error(w, "token and new_password are required", http.StatusBadRequest)
		return
	}
	if len(req.NewPassword) < 6 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Mật khẩu phải có ít nhất 6 ký tự."})
		return
	}

	hash := sha256.Sum256([]byte(req.Token))
	tokenHash := hex.EncodeToString(hash[:])

	ctx := r.Context()
	record, err := h.authRepo.GetPasswordResetToken(ctx, tokenHash)
	if err != nil || record == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Liên kết không hợp lệ hoặc đã hết hạn."})
		return
	}
	if record.Used {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Liên kết này đã được sử dụng. Vui lòng yêu cầu đặt lại mật khẩu mới."})
		return
	}
	if time.Now().After(record.ExpiresAt) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"message": "Liên kết đã hết hạn (15 phút). Vui lòng yêu cầu lại."})
		return
	}

	if err := h.authRepo.UpdatePassword(ctx, record.AccountID, req.NewPassword, false); err != nil {
		http.Error(w, "failed to update password", http.StatusInternalServerError)
		return
	}
	if err := h.authRepo.MarkPasswordResetTokenUsed(ctx, tokenHash); err != nil {
		// Non-fatal: password was already updated successfully
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Mật khẩu đã được đặt lại thành công."})
}
