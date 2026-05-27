package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type UploadHandler struct{}

func NewUploadHandler() *UploadHandler {
	return &UploadHandler{}
}

func (h *UploadHandler) UploadAvatar(w http.ResponseWriter, r *http.Request) {
	const maxSize = 5 << 20 // 5MB
	r.Body = http.MaxBytesReader(w, r.Body, maxSize)

	if err := r.ParseMultipartForm(maxSize); err != nil {
		http.Error(w, "file too large (max 5MB)", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("avatar")
	if err != nil {
		http.Error(w, "missing avatar field", http.StatusBadRequest)
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowed := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true}
	if !allowed[ext] {
		http.Error(w, "unsupported file type (jpg, jpeg, png, gif only)", http.StatusBadRequest)
		return
	}

	dir := "./uploads/avatars"
	if err := os.MkdirAll(dir, 0755); err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	b := make([]byte, 16)
	rand.Read(b)
	filename := fmt.Sprintf("%s%s", hex.EncodeToString(b), ext)

	dst, err := os.Create(filepath.Join(dir, filename))
	if err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	avatarURL := fmt.Sprintf("/uploads/avatars/%s", filename)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"avatar_url": avatarURL})
}
