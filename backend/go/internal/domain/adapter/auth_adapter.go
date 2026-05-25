package adapter

import (
	"context"
	"time"

	"gym-management/internal/domain/entity"
)

type RefreshTokenRecord struct {
	TokenHash string
	AccountID int
	ExpiresAt time.Time
	RevokedAt *time.Time
}

type PasswordResetRecord struct {
	AccountID int
	ExpiresAt time.Time
	Used      bool
}

type AuthRepository interface {
	CreateAccount(ctx context.Context, account *entity.Account) error
	FindAccountByUsername(ctx context.Context, username string) (*entity.Account, error)
	GetAccountByID(ctx context.Context, id int) (*entity.Account, error)
	GetRoleNameByID(ctx context.Context, roleID int) (string, error)
	GetRoleIDByName(ctx context.Context, roleName string) (int, error)
	UpdatePassword(ctx context.Context, accountID int, newPassword string, isFirstLogin bool) error
	SaveRefreshToken(ctx context.Context, record *RefreshTokenRecord) error
	GetRefreshToken(ctx context.Context, tokenHash string) (*RefreshTokenRecord, error)
	RevokeRefreshToken(ctx context.Context, tokenHash string) error
	RotateRefreshToken(ctx context.Context, oldTokenHash string, newRecord *RefreshTokenRecord) error
	RevokeAllRefreshTokensByAccountID(ctx context.Context, accountID int) error
	SavePasswordResetToken(ctx context.Context, accountID int, tokenHash string, expiresAt time.Time) error
	GetPasswordResetToken(ctx context.Context, tokenHash string) (*PasswordResetRecord, error)
	MarkPasswordResetTokenUsed(ctx context.Context, tokenHash string) error
}
