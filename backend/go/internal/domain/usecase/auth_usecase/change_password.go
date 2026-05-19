package auth_usecase

import (
	"context"
	"errors"
)

func (u *authUsecase) ChangePassword(ctx context.Context, input ChangePasswordInput) error {
	if input.AccountID <= 0 || input.OldPassword == "" || input.NewPassword == "" {
		return errors.New("Vui lòng nhập đầy đủ thông tin")
	}
	if len(input.NewPassword) < 6 {
		return errors.New("Mật khẩu mới phải có ít nhất 6 ký tự")
	}

	account, err := u.repo.GetAccountByID(ctx, input.AccountID)
	if err != nil {
		return ErrUnauthorized
	}

	if account.Password != input.OldPassword {
		return errors.New("Mật khẩu cũ không đúng")
	}

	if input.OldPassword == input.NewPassword {
		return errors.New("Mật khẩu mới không được trùng mật khẩu cũ")
	}

	return u.repo.UpdatePassword(ctx, input.AccountID, input.NewPassword, false)
}
