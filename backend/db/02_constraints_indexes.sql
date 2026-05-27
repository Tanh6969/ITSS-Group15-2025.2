-- ============================================================
-- FILE 2: COMMENTS, INDEXES, KHÓA NGOẠI
-- Chạy sau file 01_create_tables.sql
-- ============================================================

-- ─── COMMENTS ────────────────────────────────────────────
COMMENT ON COLUMN "Role"."role_name"                    IS 'OWNER, MANAGER, PT, MEMBER';
COMMENT ON COLUMN "Employee"."position"                 IS 'SALE, CS_STAFF, PT, MANAGER';
COMMENT ON COLUMN "ServiceCategory"."category_name"     IS 'VIP, Normal, Female-only';
COMMENT ON COLUMN "Subscription"."status"               IS 'Active, Paused, Expired, Transferred';
COMMENT ON COLUMN "Facility"."status"                   IS 'Operating, Maintenance';
COMMENT ON COLUMN "Equipment"."status"                  IS 'New, Old, Broken';
COMMENT ON COLUMN "TrainingBooking"."status"            IS 'Pending, Accepted, Rejected, Completed';
COMMENT ON COLUMN "TrainingSession"."attendance_status" IS 'Present, Absent';
COMMENT ON COLUMN "Feedback"."status"                   IS 'Pending, Resolved';
COMMENT ON COLUMN "MembershipPackage"."is_active"       IS 'true: Active, false: Disabled';
COMMENT ON COLUMN "Invoice"."payment_status"            IS 'Pending, Paid, Cancelled';
COMMENT ON COLUMN "Invoice"."payment_method"            IS 'Cash, Card, Bank Transfer';
COMMENT ON COLUMN "Member"."account_id"                 IS 'UNIQUE: mỗi account chỉ được liên kết 1 member';
COMMENT ON COLUMN "Employee"."account_id"               IS 'UNIQUE: mỗi account chỉ được liên kết 1 employee';

-- ─── INDEXES ─────────────────────────────────────────────
CREATE INDEX "idx_auth_refresh_token_account_id" ON "AuthRefreshToken" ("account_id");
CREATE INDEX "idx_auth_refresh_token_expires_at" ON "AuthRefreshToken" ("expires_at");
CREATE INDEX "idx_member_account_id"             ON "Member" ("account_id");
CREATE INDEX "idx_employee_account_id"           ON "Employee" ("account_id");
CREATE INDEX "idx_subscription_member_id"        ON "Subscription" ("member_id");
CREATE INDEX "idx_subscription_end_date"         ON "Subscription" ("end_date");
CREATE INDEX "idx_training_booking_member_id"    ON "TrainingBooking" ("member_id");
CREATE INDEX "idx_training_booking_pt_id"        ON "TrainingBooking" ("pt_id");
CREATE INDEX "idx_training_booking_status"       ON "TrainingBooking" ("status");

-- ─── FOREIGN KEYS (ALTER TABLE) ──────────────────────────
-- Ghi chú: Employee.account_id, PT_Detail.employee_id, Equipment.facility_id
--          đã được khai báo inline trong CREATE TABLE (có ON DELETE hành vi đúng).
--          Chỉ thêm FK cho các bảng còn lại ở đây.

ALTER TABLE "Account"
  ADD FOREIGN KEY ("role_id") REFERENCES "Role" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "AuthRefreshToken"
  ADD FOREIGN KEY ("account_id") REFERENCES "Account" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Member"
  ADD FOREIGN KEY ("account_id") REFERENCES "Account" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "MembershipPackage"
  ADD FOREIGN KEY ("category_id") REFERENCES "ServiceCategory" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Subscription"
  ADD FOREIGN KEY ("member_id") REFERENCES "Member" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Subscription"
  ADD FOREIGN KEY ("package_id") REFERENCES "MembershipPackage" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "TrainingBooking"
  ADD FOREIGN KEY ("member_id") REFERENCES "Member" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "TrainingBooking"
  ADD FOREIGN KEY ("pt_id") REFERENCES "PT_Detail" ("employee_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "TrainingSession"
  ADD FOREIGN KEY ("booking_id") REFERENCES "TrainingBooking" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "TrainingSession"
  ADD FOREIGN KEY ("facility_id") REFERENCES "Facility" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Feedback"
  ADD FOREIGN KEY ("member_id") REFERENCES "Member" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Feedback"
  ADD FOREIGN KEY ("processor_id") REFERENCES "Employee" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Feedback"
  ADD FOREIGN KEY ("equipment_id") REFERENCES "Equipment" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Invoice"
  ADD FOREIGN KEY ("member_id") REFERENCES "Member" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "Invoice"
  ADD FOREIGN KEY ("subscription_id") REFERENCES "Subscription" ("id") DEFERRABLE INITIALLY IMMEDIATE;
