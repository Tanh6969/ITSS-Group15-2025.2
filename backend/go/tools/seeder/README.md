# Seeder Tools

This folder now supports modular seeding commands so each dataset can be seeded independently.

## Requirements

- PostgreSQL database created from backend/db/gymdb.sql (and migrations applied)
- Correct DB values in backend/go/.env

## Run commands

Run from backend/go:

- Roles + Accounts:
  - go run ./tools/seeder/seed_roles_accounts
- Employees + PT detail:
  - go run ./tools/seeder/seed_employees_pt
- Members:
  - go run ./tools/seeder/seed_members
- Service categories + Membership packages:
  - go run ./tools/seeder/seed_service_packages
- Facilities + Equipment:
  - go run ./tools/seeder/seed_facilities_equipment
- Subscriptions + Invoices:
  - go run ./tools/seeder/seed_subscriptions_invoices
- Training bookings + Sessions:
  - go run ./tools/seeder/seed_training
- Feedback:
  - go run ./tools/seeder/seed_feedback

## Suggested execution order

1. seed_roles_accounts
2. seed_employees_pt
3. seed_members
4. seed_service_packages
5. seed_facilities_equipment
6. seed_subscriptions_invoices
7. seed_training
8. seed_feedback

## Chi tiet tac dung cua tung seeder

### Shared helper

- Duong dan: `tools/seeder/common/common.go`
- Tac dung:
  - Nap cau hinh DB tu file `.env`.
  - Tao ket noi den database.
  - Cung cap cac ham dung chung cho tat ca seeder.
- Hanh vi chinh:
  - `EnsureRole`: tao role neu chua ton tai.
  - `EnsureAccount`: tao account neu chua ton tai va hash mat khau bang bcrypt.
  - `ResetSequenceIfTableEmpty`: reset sequence chi khi bang dang rong.
  - `ColumnExists`: kiem tra cot co ton tai hay khong de tuong thich schema (vi du `is_active`).

### 1) seed_roles_accounts

- Duong dan: `tools/seeder/seed_roles_accounts/main.go`
- Seed cac bang:
  - `Role`
  - `Account`
- Tac dung:
  - Tao cac role nen tang: `OWNER`, `MANAGER`, `PT`, `MEMBER`.
  - Tao cac tai khoan mac dinh de test dang nhap.
  - Reset sequence cua Role/Account khi bang tuong ung dang rong.
- Ly do nen chay dau tien:
  - Nhieu seeder khac phu thuoc vao role va account da ton tai.

### 2) seed_employees_pt

- Duong dan: `tools/seeder/seed_employees_pt/main.go`
- Seed cac bang:
  - `Employee`
  - `PT_Detail`
- Phu thuoc:
  - Can account cho manager/PT (seeder tu tao neu chua co).
- Tac dung:
  - Tao ho so nhan su cho manager va PT.
  - Tao thong tin chi tiet PT chi voi nhung employee co position la `PT`.

### 3) seed_members

- Duong dan: `tools/seeder/seed_members/main.go`
- Seed cac bang:
  - `Member`
- Phu thuoc:
  - Can account member (seeder tu tao neu chua co).
- Tac dung:
  - Tao du lieu ho so member: ho ten, so dien thoai, email, gioi tinh, ngay sinh, dia chi.

### 4) seed_service_packages

- Duong dan: `tools/seeder/seed_service_packages/main.go`
- Seed cac bang:
  - `ServiceCategory`
  - `MembershipPackage`
- Tac dung:
  - Tao nhom dich vu (NORMAL, VIP, FEMALE_ONLY).
  - Tao cac goi tap gan voi tung nhom dich vu.
  - Neu cot `MembershipPackage.is_active` ton tai thi se set gia tri; neu khong ton tai van insert duoc.

### 5) seed_facilities_equipment

- Duong dan: `tools/seeder/seed_facilities_equipment/main.go`
- Seed cac bang:
  - `Facility`
  - `Equipment`
- Tac dung:
  - Tao khu vuc/co so vat chat cua phong gym.
  - Tao danh sach thiet bi va lien ket voi facility tuong ung.

### 6) seed_subscriptions_invoices

- Duong dan: `tools/seeder/seed_subscriptions_invoices/main.go`
- Seed cac bang:
  - `Subscription`
  - `Invoice`
- Phu thuoc:
  - Member phai ton tai truoc.
  - MembershipPackage phai ton tai truoc.
- Tac dung:
  - Tim member theo username cua account.
  - Tim package theo ten goi.
  - Tao ban ghi dang ky goi va hoa don thanh toan cho tung member.

### 7) seed_training

- Duong dan: `tools/seeder/seed_training/main.go`
- Seed cac bang:
  - `TrainingBooking`
  - `TrainingSession`
- Phu thuoc:
  - Member phai ton tai.
  - PT phai ton tai trong `Employee` va `PT_Detail`.
  - Facility phai ton tai.
- Tac dung:
  - Tao yeu cau dat lich tap voi PT cho member.
  - Tao buoi tap thuc te gan voi booking va facility.

### 8) seed_feedback

- Duong dan: `tools/seeder/seed_feedback/main.go`
- Seed cac bang:
  - `Feedback`
- Phu thuoc:
  - Member phai ton tai.
  - Nhan vien xu ly (processor) phai ton tai.
  - Equipment phai ton tai.
- Tac dung:
  - Tao du lieu feedback mau, kem trang thai xu ly va ghi chu xu ly.

## Notes

- All seeders are idempotent by natural-key checks (running multiple times will skip existing rows).
- You can run one seeder independently, but you must satisfy its dependencies first.
