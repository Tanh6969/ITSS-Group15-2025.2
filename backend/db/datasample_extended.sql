-- ============================================================
-- EXTENDED SEED DATA  (chạy SAU datasample.sql)
-- Mục tiêu:
--   • Mỗi member có tài khoản riêng
--   • Gói tập đa dạng (Aerobic, Yoga, Boxing, Pilates, Dưỡng sinh)
--   • Nhiều gói tập cùng lúc nếu khác category
--   • Lịch tập kín - đa dạng trạng thái
--   • PT mới với lịch bận rộn
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ACCOUNTS cho 9 member hiện có chưa có account (member 2-10)
-- ────────────────────────────────────────────────────────────
INSERT INTO "Account" ("username", "password", "role_id", "email", "is_first_login") VALUES
('mem2@test.com',  '123456', 4, 'mem2@test.com',  false),  -- account_id 7
('mem3@test.com',  '123456', 4, 'mem3@test.com',  false),  -- 8
('mem4@test.com',  '123456', 4, 'mem4@test.com',  false),  -- 9
('mem5@test.com',  '123456', 4, 'mem5@test.com',  false),  -- 10
('mem6@test.com',  '123456', 4, 'mem6@test.com',  false),  -- 11
('mem7@test.com',  '123456', 4, 'mem7@test.com',  false),  -- 12
('mem8@test.com',  '123456', 4, 'mem8@test.com',  false),  -- 13
('mem9@test.com',  '123456', 4, 'mem9@test.com',  false),  -- 14
('mem10@test.com', '123456', 4, 'mem10@test.com', false);  -- 15

-- Gán account vừa tạo cho member 2-10
UPDATE "Member" SET account_id = 7  WHERE id = 2;
UPDATE "Member" SET account_id = 8  WHERE id = 3;
UPDATE "Member" SET account_id = 9  WHERE id = 4;
UPDATE "Member" SET account_id = 10 WHERE id = 5;
UPDATE "Member" SET account_id = 11 WHERE id = 6;
UPDATE "Member" SET account_id = 12 WHERE id = 7;
UPDATE "Member" SET account_id = 13 WHERE id = 8;
UPDATE "Member" SET account_id = 14 WHERE id = 9;
UPDATE "Member" SET account_id = 15 WHERE id = 10;

-- ────────────────────────────────────────────────────────────
-- 2. ACCOUNTS + EMPLOYEES cho 3 PT mới
-- ────────────────────────────────────────────────────────────
INSERT INTO "Account" ("username", "password", "role_id", "email", "is_first_login") VALUES
('pt4@gym.com', '123456', 3, 'pt4@gym.com', false),   -- account_id 16
('pt5@gym.com', '123456', 3, 'pt5@gym.com', false),   -- 17
('pt6@gym.com', '123456', 3, 'pt6@gym.com', false);   -- 18

INSERT INTO "Employee" ("full_name","phone","position","salary","account_id","gender","dob","email","address") VALUES
('Trần Đức Anh',   '0901000011', 'PT', 17000000, 16, 'Male',   '1993-04-12', 'anh.td@gym.com',  'Hà Nội'),   -- employee_id 11
('Nguyễn Thị Mai', '0901000012', 'PT', 16500000, 17, 'Female', '1997-07-25', 'mai.nt@gym.com',  'TP.HCM'),   -- 12
('Lê Minh Tuấn',   '0901000013', 'PT', 18500000, 18, 'Male',   '1991-11-03', 'tuan.lm@gym.com', 'Đà Nẵng'); -- 13

INSERT INTO "PT_Detail" ("employee_id","professional_profile","body_index","experience_years","achievements","available_schedule") VALUES
(
  11,
  'Chuyên gia Aerobic và HIIT với 7 năm kinh nghiệm. Cựu vận động viên thể dục nhịp điệu quốc gia. Chứng chỉ ACE Group Fitness và Les Mills BODYCOMBAT.',
  '{"height": 180, "weight": 74, "chest": 100, "bicep": 37, "waist": 79, "forearm": 28, "thigh": 57, "calf": 39}',
  '7',
  'HCV Aerobic Đồng đội - Giải Quốc gia 2019; Chứng chỉ ACE Group Fitness; Les Mills BODYCOMBAT Certified',
  '{"Mon": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Tue": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Wed": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Thu": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Fri": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Sat": ["07:00","08:00","09:00","10:00"], "Sun": ["08:00","09:00","10:00"]}'
),
(
  12,
  'Huấn luyện viên Yoga và Dưỡng sinh 6 năm. Tốt nghiệp Yoga Alliance 300h, chuyên trị liệu cột sống và cân bằng tâm lý. Từng giảng dạy tại các spa 5 sao Đà Lạt và Phú Quốc.',
  '{"height": 160, "weight": 50, "chest": 82, "bicep": 24, "waist": 60, "forearm": 20, "thigh": 50, "calf": 33}',
  '6',
  'Yoga Alliance 300h RYT; Giải thưởng Best Yoga Instructor - FitExpo 2024; Yin Yoga & Restorative Certified',
  '{"Mon": ["08:00","09:00","10:00","14:00","15:00","16:00"], "Wed": ["08:00","09:00","10:00","14:00","15:00","16:00"], "Fri": ["08:00","09:00","10:00","14:00","15:00","16:00"], "Sat": ["07:00","08:00","09:00","10:00","11:00"], "Sun": ["09:00","10:00","11:00","14:00","15:00"]}'
),
(
  13,
  'Huấn luyện viên Boxing và MMA 8 năm kinh nghiệm. Cựu võ sĩ hạng Welterweight tại giải Boxing toàn quốc. Chứng chỉ AIBA Level 2 Coach và USA Boxing Coach.',
  '{"height": 177, "weight": 78, "chest": 105, "bicep": 40, "waist": 82, "forearm": 31, "thigh": 60, "calf": 41}',
  '8',
  'HCB Boxing Hạng 69kg - Giải Quốc gia 2018; AIBA Level 2 Coach Certified; USA Boxing Coach Certified',
  '{"Mon": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Tue": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Thu": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Fri": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Sat": ["08:00","09:00","10:00","11:00"], "Sun": ["10:00","11:00","14:00","15:00"]}'
);

-- ────────────────────────────────────────────────────────────
-- 3. MEMBER MỚI (11-20) mỗi người có account riêng
-- ────────────────────────────────────────────────────────────
INSERT INTO "Account" ("username","password","role_id","email","is_first_login") VALUES
('mem11@test.com', '123456', 4, 'mem11@test.com', false),  -- 19
('mem12@test.com', '123456', 4, 'mem12@test.com', false),  -- 20
('mem13@test.com', '123456', 4, 'mem13@test.com', false),  -- 21
('mem14@test.com', '123456', 4, 'mem14@test.com', false),  -- 22
('mem15@test.com', '123456', 4, 'mem15@test.com', false),  -- 23
('mem16@test.com', '123456', 4, 'mem16@test.com', false),  -- 24
('mem17@test.com', '123456', 4, 'mem17@test.com', false),  -- 25
('mem18@test.com', '123456', 4, 'mem18@test.com', false),  -- 26
('mem19@test.com', '123456', 4, 'mem19@test.com', false),  -- 27
('mem20@test.com', '123456', 4, 'mem20@test.com', false);  -- 28

INSERT INTO "Member" ("full_name","phone","email","gender","dob","address","account_id") VALUES
('Phạm Thị Lan',      '0920000011', 'mem11@test.com', 'Female', '1995-03-10', 'Hà Nội',    19),  -- member_id 11
('Hoàng Văn Bình',    '0920000012', 'mem12@test.com', 'Male',   '1992-07-22', 'TP.HCM',    20),  -- 12
('Vũ Thị Cẩm',        '0920000013', 'mem13@test.com', 'Female', '1998-11-15', 'Đà Nẵng',   21),  -- 13
('Đặng Quốc Dũng',    '0920000014', 'mem14@test.com', 'Male',   '1989-05-08', 'Cần Thơ',   22),  -- 14
('Bùi Thị Emilia',    '0920000015', 'mem15@test.com', 'Female', '2000-01-30', 'Hải Phòng', 23),  -- 15
('Lý Văn Phong',      '0920000016', 'mem16@test.com', 'Male',   '1994-09-18', 'Huế',       24),  -- 16
('Trịnh Thị Giang',   '0920000017', 'mem17@test.com', 'Female', '1996-12-05', 'Nha Trang', 25),  -- 17
('Ngô Đình Hải',      '0920000018', 'mem18@test.com', 'Male',   '1991-04-27', 'Bình Dương',26),  -- 18
('Đinh Thị Iris',     '0920000019', 'mem19@test.com', 'Female', '1997-08-14', 'Vũng Tàu',  27),  -- 19
('Cao Minh Khoa',     '0920000020', 'mem20@test.com', 'Male',   '1993-06-20', 'Đồng Nai',  28);  -- 20

-- ────────────────────────────────────────────────────────────
-- 4. SERVICE CATEGORIES MỚI
-- ────────────────────────────────────────────────────────────
INSERT INTO "ServiceCategory" ("category_name","benefits_description","allowed_gender") VALUES
('Aerobic',   'Lớp học Aerobic, HIIT, Zumba cường độ cao - đốt mỡ hiệu quả',                     'All'),     -- category_id 4
('Yoga',      'Yoga, Pilates, Dưỡng sinh - cải thiện linh hoạt và tâm trí',                       'All'),     -- 5
('Boxing',    'Boxing, Kickboxing, MMA - rèn sức mạnh và phản xạ',                                'All'),     -- 6
('Pilates',   'Pilates Reformer, Mat Pilates - phục hồi chức năng và tăng cơ lõi',                'All'),     -- 7
('Dưỡng sinh','Khí công, Thái cực quyền, thiền định - cân bằng thể chất lẫn tinh thần',           'All');     -- 8

-- ────────────────────────────────────────────────────────────
-- 5. MEMBERSHIP PACKAGES MỚI (đa dạng thời hạn & giá)
-- ────────────────────────────────────────────────────────────
-- Gói VIP thêm (package_id 7-8)
INSERT INTO "MembershipPackage" ("category_id","package_name","duration_days","price","is_active") VALUES
(1, 'Gói VIP 3 tháng',       90,  2800000, true),
(2, 'Gói Cơ Bản 3 tháng',    90,  1300000, true),

-- Aerobic (package_id 9-11)
(4, 'Gói Aerobic Tháng',      30,   400000, true),
(4, 'Gói Aerobic 3 tháng',    90,  1050000, true),
(4, 'Gói Aerobic 6 tháng',   180,  1900000, true),

-- Yoga (package_id 12-14)
(5, 'Gói Yoga Tháng',         30,   450000, true),
(5, 'Gói Yoga 3 tháng',       90,  1200000, true),
(5, 'Gói Yoga Trị liệu',      60,   900000, true),

-- Boxing (package_id 15-16)
(6, 'Gói Boxing Tháng',       30,   500000, true),
(6, 'Gói Boxing 3 tháng',     90,  1300000, true),

-- Pilates (package_id 17-18)
(7, 'Gói Pilates Tháng',      30,   600000, true),
(7, 'Gói Pilates 3 tháng',    90,  1600000, true),

-- Dưỡng sinh (package_id 19-20)
(8, 'Gói Dưỡng sinh Tháng',   30,   300000, true),
(8, 'Gói Dưỡng sinh 6 tháng', 180,  1500000, true);

-- ────────────────────────────────────────────────────────────
-- 6. SUBSCRIPTIONS & INVOICES - đa dạng gói, nhiều combo
-- ────────────────────────────────────────────────────────────
-- member 1: VIP tháng (đã có sub_id=1), thêm Yoga
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(1, 12, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active');  -- sub_id 11

-- member 2: Cơ bản + Aerobic
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(2, 9, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active');   -- 12

-- member 3: VIP tháng (đã có sub_id=3), thêm Boxing
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(3, 15, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active');  -- 13

-- member 4: Nữ tháng (đã có), thêm Yoga
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(4, 12, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active');  -- 14

-- member 5: VIP nửa năm (đã có), thêm Pilates
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(5, 17, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active');  -- 15

-- member 6: Cơ bản tháng (đã có), thêm Aerobic 3 tháng
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(6, 10, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date, 'active');  -- 16

-- member 7: VIP nửa năm (đã có), thêm Yoga, Boxing
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(7, 13, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date, 'active'),  -- 17
(7, 15, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active');  -- 18

-- member 8: Nữ tháng (đã có), thêm Pilates, Dưỡng sinh
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(8, 17, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active'),  -- 19
(8, 19, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'active');  -- 20

-- member 9: VIP 1 năm (đã có), thêm Boxing 3 tháng + Yoga trị liệu
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(9, 16, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date, 'active'),  -- 21
(9, 14, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '60 days')::date, 'active');  -- 22

-- member 10: Nữ tháng (đã có), thêm Dưỡng sinh 6 tháng
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(10, 20, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'active'); -- 23

-- member 11-20: gói đầu tiên
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(11, 1,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 24 VIP tháng
(11, 12, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 25 Yoga tháng
(12, 7,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date,  'active'),  -- 26 VIP 3 tháng
(12, 15, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 27 Boxing tháng
(13, 9,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 28 Aerobic tháng
(13, 19, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 29 Dưỡng sinh
(14, 8,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date,  'active'),  -- 30 Cơ bản 3T
(14, 10, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date,  'active'),  -- 31 Aerobic 3T
(15, 3,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 32 Nữ tháng
(15, 12, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 33 Yoga tháng
(16, 1,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 34 VIP tháng
(16, 15, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 35 Boxing tháng
(17, 5,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'active'),  -- 36 Nữ nửa năm
(17, 13, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date,  'active'),  -- 37 Yoga 3T
(18, 4,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'active'),  -- 38 VIP nửa năm
(18, 16, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '90 days')::date,  'active'),  -- 39 Boxing 3T
(19, 12, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 40 Yoga tháng
(19, 9,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'active'),  -- 41 Aerobic tháng
(20, 6,  CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '365 days')::date, 'active'),  -- 42 VIP 1 năm
(20, 11, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'active');  -- 43 Aerobic 6T

-- Một số sub hết hạn/quá khứ để có dữ liệu lịch sử
INSERT INTO "Subscription" ("member_id","package_id","registration_date","start_date","end_date","status") VALUES
(1, 2, (CURRENT_TIMESTAMP - INTERVAL '3 months'), (CURRENT_DATE - INTERVAL '3 months')::date, (CURRENT_DATE - INTERVAL '60 days')::date, 'expired'),  -- 44
(3, 2, (CURRENT_TIMESTAMP - INTERVAL '4 months'), (CURRENT_DATE - INTERVAL '4 months')::date, (CURRENT_DATE - INTERVAL '90 days')::date, 'expired'),  -- 45
(5, 2, (CURRENT_TIMESTAMP - INTERVAL '2 months'), (CURRENT_DATE - INTERVAL '2 months')::date, (CURRENT_DATE - INTERVAL '30 days')::date, 'expired'),  -- 46
(12,(9),(CURRENT_TIMESTAMP - INTERVAL '5 months'), (CURRENT_DATE - INTERVAL '5 months')::date, (CURRENT_DATE - INTERVAL '4 months')::date,'expired'), -- 47
(14,(1),(CURRENT_TIMESTAMP - INTERVAL '6 months'), (CURRENT_DATE - INTERVAL '6 months')::date, (CURRENT_DATE - INTERVAL '5 months')::date,'expired'); -- 48

-- ────────────────────────────────────────────────────────────
-- 7. INVOICES cho tất cả subscription mới
-- ────────────────────────────────────────────────────────────
INSERT INTO "Invoice" ("member_id","subscription_id","total_amount","payment_status","payment_method","notes") VALUES
-- combo member 1-10
(1,  11,  450000, 'Paid', 'Card',          'Gói Yoga Tháng - combo với VIP'),
(2,  12,  400000, 'Paid', 'Cash',          'Gói Aerobic Tháng'),
(3,  13,  500000, 'Paid', 'Bank Transfer', 'Gói Boxing Tháng - combo với VIP'),
(4,  14,  450000, 'Paid', 'Cash',          'Gói Yoga Tháng - combo với Nữ'),
(5,  15,  600000, 'Paid', 'Card',          'Gói Pilates Tháng - combo với VIP nửa năm'),
(6,  16, 1050000, 'Paid', 'Bank Transfer', 'Gói Aerobic 3 tháng - combo với Cơ bản'),
(7,  17, 1200000, 'Paid', 'Card',          'Gói Yoga 3 tháng - combo VIP'),
(7,  18,  500000, 'Paid', 'Cash',          'Gói Boxing Tháng - combo VIP'),
(8,  19,  600000, 'Paid', 'Bank Transfer', 'Gói Pilates Tháng - combo Nữ'),
(8,  20,  300000, 'Paid', 'Cash',          'Gói Dưỡng sinh Tháng - combo Nữ'),
(9,  21, 1300000, 'Paid', 'Card',          'Gói Boxing 3 tháng - combo VIP 1 năm'),
(9,  22,  900000, 'Paid', 'Bank Transfer', 'Gói Yoga Trị liệu - combo VIP 1 năm'),
(10, 23, 1500000, 'Paid', 'Card',          'Gói Dưỡng sinh 6 tháng - combo Nữ'),
-- member 11-20
(11, 24, 1000000, 'Paid', 'Cash',          'Gói VIP Tháng'),
(11, 25,  450000, 'Paid', 'Card',          'Gói Yoga Tháng - combo VIP'),
(12, 26, 2800000, 'Paid', 'Bank Transfer', 'Gói VIP 3 tháng'),
(12, 27,  500000, 'Paid', 'Cash',          'Gói Boxing Tháng - combo VIP 3T'),
(13, 28,  400000, 'Paid', 'Card',          'Gói Aerobic Tháng'),
(13, 29,  300000, 'Paid', 'Cash',          'Gói Dưỡng sinh Tháng - combo Aerobic'),
(14, 30, 1300000, 'Paid', 'Bank Transfer', 'Gói Cơ Bản 3 tháng'),
(14, 31, 1050000, 'Paid', 'Card',          'Gói Aerobic 3 tháng - combo Cơ bản 3T'),
(15, 32,   50000, 'Paid', 'Cash',          'Gói Nữ Tháng'),
(15, 33,  450000, 'Paid', 'Card',          'Gói Yoga Tháng - combo Nữ'),
(16, 34, 1000000, 'Paid', 'Bank Transfer', 'Gói VIP Tháng'),
(16, 35,  500000, 'Paid', 'Cash',          'Gói Boxing Tháng - combo VIP'),
(17, 36, 2500000, 'Paid', 'Card',          'Gói Nữ nửa năm'),
(17, 37, 1200000, 'Paid', 'Bank Transfer', 'Gói Yoga 3 tháng - combo Nữ'),
(18, 38, 5000000, 'Paid', 'Card',          'Gói VIP nửa năm'),
(18, 39, 1300000, 'Paid', 'Cash',          'Gói Boxing 3 tháng - combo VIP'),
(19, 40,  450000, 'Paid', 'Bank Transfer', 'Gói Yoga Tháng'),
(19, 41,  400000, 'Paid', 'Card',          'Gói Aerobic Tháng - combo Yoga'),
(20, 42,10000000, 'Paid', 'Bank Transfer', 'Gói VIP 1 năm'),
(20, 43, 1900000, 'Paid', 'Card',          'Gói Aerobic 6 tháng - combo VIP 1 năm'),
-- invoice quá khứ
(1,  44,  500000, 'Paid', 'Cash',          'Gia hạn Gói Cơ Bản Tháng'),
(3,  45,  500000, 'Paid', 'Cash',          'Gia hạn Gói Cơ Bản Tháng'),
(5,  46,  500000, 'Paid', 'Card',          'Gia hạn Gói Cơ Bản Tháng'),
(12, 47,  400000, 'Paid', 'Cash',          'Gói Aerobic Tháng (đã hết hạn)'),
(14, 48, 1000000, 'Paid', 'Bank Transfer', 'Gói VIP Tháng (đã hết hạn)');

-- ────────────────────────────────────────────────────────────
-- 8. TRAINING BOOKINGS - đủ loại status, các PT bận rộn
-- ────────────────────────────────────────────────────────────
-- PT employee_id: 2=Khoa(Strength), 5=Lan(Yoga/Pilates), 9=Hùng(Calisthenics)
--                 11=Anh(Aerobic), 12=Mai(Yoga), 13=Tuấn(Boxing)

INSERT INTO "TrainingBooking"
  ("member_id","pt_id","requested_start","requested_end","training_plan_note","status","intensity","roadmap_goal","member_free_schedule","rejection_reason")
VALUES
-- PT 2 (Khoa - Strength): 8 bookings
(1,  2, (CURRENT_DATE - INTERVAL '20 days' + TIME '07:00')::timestamp,
        (CURRENT_DATE - INTERVAL '20 days' + TIME '08:00')::timestamp,
        'Tăng cơ ngực và vai', 'completed', 'High',
        'Tăng 5kg cơ trong 3 tháng', '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}', ''),

(3,  2, (CURRENT_DATE - INTERVAL '15 days' + TIME '08:00')::timestamp,
        (CURRENT_DATE - INTERVAL '15 days' + TIME '09:00')::timestamp,
        'Giảm mỡ bụng, tăng cơ lưng', 'completed', 'Medium',
        'Giảm 8kg mỡ trong 4 tháng', '{"Tue":"08:00","Thu":"08:00","Sat":"08:00"}', ''),

(12, 2, (CURRENT_DATE - INTERVAL '10 days' + TIME '09:00')::timestamp,
        (CURRENT_DATE - INTERVAL '10 days' + TIME '10:00')::timestamp,
        'Phục hồi sau chấn thương vai', 'completed', 'Low',
        'Phục hồi hoàn toàn và trở lại tập nặng', '{"Mon":"09:00","Thu":"09:00"}', ''),

(18, 2, (CURRENT_DATE + INTERVAL '2 days' + TIME '07:00')::timestamp,
        (CURRENT_DATE + INTERVAL '2 days' + TIME '08:00')::timestamp,
        'Strength training cơ bản', 'accepted', 'Medium',
        'Xây dựng nền tảng sức mạnh', '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}', ''),

(16, 2, (CURRENT_DATE + INTERVAL '3 days' + TIME '17:00')::timestamp,
        (CURRENT_DATE + INTERVAL '3 days' + TIME '18:00')::timestamp,
        'Deadlift và Squat kỹ thuật', 'accepted', 'High',
        'Thi đấu powerlifting', '{"Tue":"17:00","Thu":"17:00","Sat":"09:00"}', ''),

(5,  2, (CURRENT_DATE + INTERVAL '5 days' + TIME '08:00')::timestamp,
        (CURRENT_DATE + INTERVAL '5 days' + TIME '09:00')::timestamp,
        'Chương trình tăng cơ toàn thân', 'pending', 'High',
        'Tăng 10kg cơ trong 6 tháng', '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}', ''),

(20, 2, (CURRENT_DATE - INTERVAL '5 days' + TIME '09:00')::timestamp,
        (CURRENT_DATE - INTERVAL '5 days' + TIME '10:00')::timestamp,
        'Tập theo chương trình VIP', 'rejected', 'High',
        'Tham gia Mr. Vietnam', '{"Mon":"09:00"}', 'PT không có lịch trống giờ này, vui lòng chọn khung giờ khác'),

(9,  2, (CURRENT_DATE + INTERVAL '7 days' + TIME '17:00')::timestamp,
        (CURRENT_DATE + INTERVAL '7 days' + TIME '18:00')::timestamp,
        'Olympic lifting - Snatch và Clean & Jerk', 'pending', 'High',
        'Nâng cao kỹ thuật Olympic lifting', '{"Wed":"17:00","Fri":"17:00"}', ''),

-- PT 5 (Lan - Yoga/Pilates): 7 bookings
(4,  5, (CURRENT_DATE - INTERVAL '18 days' + TIME '09:00')::timestamp,
        (CURRENT_DATE - INTERVAL '18 days' + TIME '10:00')::timestamp,
        'Yoga trị liệu đau lưng', 'completed', 'Low',
        'Hết đau lưng mãn tính', '{"Mon":"09:00","Wed":"09:00","Fri":"09:00"}', ''),

(8,  5, (CURRENT_DATE - INTERVAL '12 days' + TIME '14:00')::timestamp,
        (CURRENT_DATE - INTERVAL '12 days' + TIME '15:00')::timestamp,
        'Pilates cải thiện tư thế', 'completed', 'Low',
        'Cải thiện tư thế, giảm gù lưng', '{"Tue":"14:00","Thu":"14:00"}', ''),

(15, 5, (CURRENT_DATE + INTERVAL '1 days' + TIME '09:00')::timestamp,
        (CURRENT_DATE + INTERVAL '1 days' + TIME '10:00')::timestamp,
        'Yoga dành cho người mới bắt đầu', 'accepted', 'Low',
        'Cân bằng tâm lý và thể chất', '{"Mon":"09:00","Wed":"09:00","Fri":"09:00"}', ''),

(17, 5, (CURRENT_DATE + INTERVAL '2 days' + TIME '14:00')::timestamp,
        (CURRENT_DATE + INTERVAL '2 days' + TIME '15:00')::timestamp,
        'Yoga giảm stress sau công việc', 'accepted', 'Low',
        'Giảm stress, ngủ ngon hơn', '{"Wed":"14:00","Fri":"14:00","Sat":"10:00"}', ''),

(19, 5, (CURRENT_DATE + INTERVAL '4 days' + TIME '10:00')::timestamp,
        (CURRENT_DATE + INTERVAL '4 days' + TIME '11:00')::timestamp,
        'Yoga kết hợp thiền định', 'pending', 'Low',
        'Cải thiện sức khỏe tinh thần', '{"Mon":"10:00","Wed":"10:00"}', ''),

(11, 5, (CURRENT_DATE - INTERVAL '3 days' + TIME '14:00')::timestamp,
        (CURRENT_DATE - INTERVAL '3 days' + TIME '15:00')::timestamp,
        'Pilates Reformer cá nhân', 'rejected', 'Medium',
        'Tăng cơ lõi và linh hoạt', '{"Sat":"14:00"}', 'Thiết bị Reformer đang bảo trì, vui lòng chọn ngày khác'),

(13, 5, (CURRENT_DATE + INTERVAL '6 days' + TIME '09:00')::timestamp,
        (CURRENT_DATE + INTERVAL '6 days' + TIME '10:00')::timestamp,
        'Yoga dành cho vận động viên', 'pending', 'Medium',
        'Tăng tính linh hoạt và phục hồi', '{"Wed":"09:00","Fri":"09:00"}', ''),

-- PT 9 (Hùng - Calisthenics): 7 bookings
(2,  9, (CURRENT_DATE - INTERVAL '22 days' + TIME '07:00')::timestamp,
        (CURRENT_DATE - INTERVAL '22 days' + TIME '08:00')::timestamp,
        'Calisthenics cơ bản - muscle up và planche', 'completed', 'High',
        'Học được muscle up trong 2 tháng', '{"Tue":"07:00","Thu":"07:00","Sat":"07:00"}', ''),

(6,  9, (CURRENT_DATE - INTERVAL '8 days' + TIME '19:00')::timestamp,
        (CURRENT_DATE - INTERVAL '8 days' + TIME '20:00')::timestamp,
        'Giảm mỡ kết hợp calisthenics', 'completed', 'Medium',
        'Giảm 6kg và tăng sức bền', '{"Tue":"19:00","Thu":"19:00"}', ''),

(14, 9, (CURRENT_DATE + INTERVAL '1 days' + TIME '08:00')::timestamp,
        (CURRENT_DATE + INTERVAL '1 days' + TIME '09:00')::timestamp,
        'Handstand và ring training', 'accepted', 'High',
        'Tự đứng được handstand', '{"Sat":"07:00","Sun":"09:00"}', ''),

(7,  9, (CURRENT_DATE + INTERVAL '3 days' + TIME '20:00')::timestamp,
        (CURRENT_DATE + INTERVAL '3 days' + TIME '21:00')::timestamp,
        'Chương trình nâng cao - front lever', 'accepted', 'High',
        'Hoàn thiện front lever và planche', '{"Tue":"20:00","Thu":"20:00"}', ''),

(10, 9, (CURRENT_DATE + INTERVAL '5 days' + TIME '07:00')::timestamp,
        (CURRENT_DATE + INTERVAL '5 days' + TIME '08:00')::timestamp,
        'Calisthenics nhẹ cho người cao tuổi', 'pending', 'Low',
        'Duy trì sức khỏe và linh hoạt', '{"Sat":"09:00","Sun":"10:00"}', ''),

(18, 9, (CURRENT_DATE - INTERVAL '2 days' + TIME '19:00')::timestamp,
        (CURRENT_DATE - INTERVAL '2 days' + TIME '20:00')::timestamp,
        'Kết hợp Strength và Calisthenics', 'rejected', 'High',
        'Xây dựng cơ thể toàn diện', '{"Tue":"19:00"}', 'Member chưa đủ nền tảng cho chương trình này, cần tập thêm 1 tháng cơ bản'),

(20, 9, (CURRENT_DATE + INTERVAL '8 days' + TIME '08:00')::timestamp,
        (CURRENT_DATE + INTERVAL '8 days' + TIME '09:00')::timestamp,
        'Chuẩn bị thi đấu Calisthenics', 'pending', 'High',
        'Đạt top 3 giải Calisthenics Hà Nội', '{"Sat":"07:00","Sun":"09:00"}', ''),

-- PT 11 (Anh - Aerobic): 8 bookings
(2,  11, (CURRENT_DATE - INTERVAL '25 days' + TIME '06:00')::timestamp,
         (CURRENT_DATE - INTERVAL '25 days' + TIME '07:00')::timestamp,
         'HIIT cho người mới', 'completed', 'Medium',
         'Tăng sức bền cardio', '{"Mon":"06:00","Wed":"06:00","Fri":"06:00"}', ''),

(13, 11, (CURRENT_DATE - INTERVAL '14 days' + TIME '17:00')::timestamp,
         (CURRENT_DATE - INTERVAL '14 days' + TIME '18:00')::timestamp,
         'Zumba kết hợp Aerobic', 'completed', 'Medium',
         'Giảm 5kg và có dáng đẹp', '{"Tue":"17:00","Thu":"17:00","Sat":"08:00"}', ''),

(6,  11, (CURRENT_DATE + INTERVAL '1 days' + TIME '07:00')::timestamp,
         (CURRENT_DATE + INTERVAL '1 days' + TIME '08:00')::timestamp,
         'HIIT nâng cao giảm mỡ', 'accepted', 'High',
         'Giảm 10kg trong 3 tháng', '{"Mon":"07:00","Tue":"07:00","Thu":"07:00"}', ''),

(19, 11, (CURRENT_DATE + INTERVAL '2 days' + TIME '17:00')::timestamp,
         (CURRENT_DATE + INTERVAL '2 days' + TIME '18:00')::timestamp,
         'Aerobic kết hợp bài tập tim mạch', 'accepted', 'Medium',
         'Cải thiện sức khỏe tim mạch', '{"Tue":"17:00","Thu":"17:00"}', ''),

(14, 11, (CURRENT_DATE + INTERVAL '4 days' + TIME '18:00')::timestamp,
         (CURRENT_DATE + INTERVAL '4 days' + TIME '19:00')::timestamp,
         'Aerobic và HIIT phối hợp', 'pending', 'High',
         'Tăng sức bền tổng thể', '{"Mon":"18:00","Wed":"18:00","Fri":"18:00"}', ''),

(20, 11, (CURRENT_DATE - INTERVAL '6 days' + TIME '06:00')::timestamp,
         (CURRENT_DATE - INTERVAL '6 days' + TIME '07:00')::timestamp,
         'Cardio dành cho powerlifter', 'rejected', 'Medium',
         'Tăng sức bền không ảnh hưởng sức mạnh', '{"Mon":"06:00"}', 'Lịch của PT đã kín giờ này'),

(16, 11, (CURRENT_DATE + INTERVAL '6 days' + TIME '07:00')::timestamp,
         (CURRENT_DATE + INTERVAL '6 days' + TIME '08:00')::timestamp,
         'Cardio kết hợp strength', 'pending', 'High',
         'Cải thiện sức bền và đốt mỡ', '{"Mon":"07:00","Fri":"07:00"}', ''),

(1,  11, (CURRENT_DATE + INTERVAL '9 days' + TIME '17:00')::timestamp,
         (CURRENT_DATE + INTERVAL '9 days' + TIME '18:00')::timestamp,
         'Aerobic buổi chiều sau giờ làm', 'pending', 'Medium',
         'Duy trì cân nặng lý tưởng', '{"Tue":"17:00","Thu":"17:00"}', ''),

-- PT 12 (Mai - Yoga): 7 bookings
(15, 12, (CURRENT_DATE - INTERVAL '16 days' + TIME '08:00')::timestamp,
         (CURRENT_DATE - INTERVAL '16 days' + TIME '09:00')::timestamp,
         'Yoga cơ bản cho người mới', 'completed', 'Low',
         'Giảm đau lưng và stress', '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}', ''),

(10, 12, (CURRENT_DATE - INTERVAL '9 days' + TIME '14:00')::timestamp,
         (CURRENT_DATE - INTERVAL '9 days' + TIME '15:00')::timestamp,
         'Dưỡng sinh và thiền dành cho người trung niên', 'completed', 'Low',
         'Cải thiện sức khỏe tổng thể', '{"Wed":"14:00","Sat":"09:00"}', ''),

(17, 12, (CURRENT_DATE + INTERVAL '1 days' + TIME '10:00')::timestamp,
         (CURRENT_DATE + INTERVAL '1 days' + TIME '11:00')::timestamp,
         'Yoga sâu - Yin Yoga', 'accepted', 'Low',
         'Thư giãn sâu và phục hồi', '{"Mon":"10:00","Wed":"10:00","Fri":"10:00"}', ''),

(4,  12, (CURRENT_DATE + INTERVAL '3 days' + TIME '15:00')::timestamp,
         (CURRENT_DATE + INTERVAL '3 days' + TIME '16:00')::timestamp,
         'Yoga tiếp theo sau buổi trị liệu', 'accepted', 'Low',
         'Duy trì không đau lưng', '{"Tue":"15:00","Thu":"15:00"}', ''),

(11, 12, (CURRENT_DATE + INTERVAL '5 days' + TIME '09:00')::timestamp,
         (CURRENT_DATE + INTERVAL '5 days' + TIME '10:00')::timestamp,
         'Power Yoga cho người năng động', 'pending', 'Medium',
         'Kết hợp yoga và thể lực', '{"Mon":"09:00","Thu":"09:00","Sat":"10:00"}', ''),

(8,  12, (CURRENT_DATE - INTERVAL '4 days' + TIME '14:00')::timestamp,
         (CURRENT_DATE - INTERVAL '4 days' + TIME '15:00')::timestamp,
         'Pilates mat level 2', 'rejected', 'Medium',
         'Tăng cường cơ lõi', '{"Tue":"14:00"}', 'Buổi này đã có member khác đặt trước'),

(13, 12, (CURRENT_DATE + INTERVAL '7 days' + TIME '16:00')::timestamp,
         (CURRENT_DATE + INTERVAL '7 days' + TIME '17:00')::timestamp,
         'Yoga phục hồi sau tập nặng', 'pending', 'Low',
         'Tăng tính linh hoạt', '{"Wed":"16:00","Fri":"16:00"}', ''),

-- PT 13 (Tuấn - Boxing): 8 bookings
(3,  13, (CURRENT_DATE - INTERVAL '28 days' + TIME '07:00')::timestamp,
         (CURRENT_DATE - INTERVAL '28 days' + TIME '08:00')::timestamp,
         'Boxing cơ bản - kỹ thuật đấm', 'completed', 'Medium',
         'Học boxing để tự vệ', '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}', ''),

(7,  13, (CURRENT_DATE - INTERVAL '11 days' + TIME '19:00')::timestamp,
         (CURRENT_DATE - INTERVAL '11 days' + TIME '20:00')::timestamp,
         'Kickboxing nâng cao', 'completed', 'High',
         'Thi đấu giải nghiệp dư', '{"Tue":"19:00","Thu":"19:00","Sat":"09:00"}', ''),

(16, 13, (CURRENT_DATE + INTERVAL '1 days' + TIME '18:00')::timestamp,
         (CURRENT_DATE + INTERVAL '1 days' + TIME '19:00')::timestamp,
         'Boxing giảm stress', 'accepted', 'High',
         'Rèn luyện sức mạnh và tư duy chiến thuật', '{"Mon":"18:00","Thu":"18:00","Fri":"18:00"}', ''),

(12, 13, (CURRENT_DATE + INTERVAL '2 days' + TIME '08:00')::timestamp,
         (CURRENT_DATE + INTERVAL '2 days' + TIME '09:00')::timestamp,
         'MMA cơ bản kết hợp Boxing', 'accepted', 'High',
         'Học MMA toàn diện', '{"Tue":"08:00","Thu":"08:00","Sat":"08:00"}', ''),

(18, 13, (CURRENT_DATE + INTERVAL '4 days' + TIME '19:00')::timestamp,
         (CURRENT_DATE + INTERVAL '4 days' + TIME '20:00')::timestamp,
         'Nâng cao kỹ thuật jab-cross-hook', 'pending', 'High',
         'Chuẩn bị thi đấu', '{"Mon":"19:00","Wed":"19:00","Fri":"19:00"}', ''),

(9,  13, (CURRENT_DATE - INTERVAL '7 days' + TIME '07:00')::timestamp,
         (CURRENT_DATE - INTERVAL '7 days' + TIME '08:00')::timestamp,
         'Boxing conditioning cho powerlifter', 'rejected', 'High',
         'Tăng tốc độ và phản xạ', '{"Sat":"07:00"}', 'PT Tuấn đang có giải đấu tuần này, vui lòng đặt lại'),

(20, 13, (CURRENT_DATE + INTERVAL '3 days' + TIME '08:00')::timestamp,
         (CURRENT_DATE + INTERVAL '3 days' + TIME '09:00')::timestamp,
         'Chuẩn bị thể lực thi boxing', 'pending', 'High',
         'Đạt HCV Boxing nghiệp dư', '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}', ''),

(14, 13, (CURRENT_DATE + INTERVAL '6 days' + TIME '07:00')::timestamp,
         (CURRENT_DATE + INTERVAL '6 days' + TIME '08:00')::timestamp,
         'Boxing cơ bản buổi sáng', 'pending', 'Medium',
         'Học boxing để giữ dáng và tự vệ', '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}', '');

-- ────────────────────────────────────────────────────────────
-- 9. TRAINING SESSIONS cho các booking đã completed/accepted
-- ────────────────────────────────────────────────────────────
-- Lấy booking_id từ các booking đã inserted ở trên
-- Thứ tự booking theo insert: PT2: 1-8, PT5: 9-15, PT9: 16-22, PT11: 23-30, PT12: 31-37, PT13: 38-45
-- Completed bookings: 1,2,3 (PT2), 9,10 (PT5), 16,17 (PT9), 23,24 (PT11), 31,32 (PT12), 38,39 (PT13)
-- Accepted bookings: 4,5 (PT2), 11 (PT5), 12 (PT5), 18,19 (PT9), 25,26 (PT11), 33,34 (PT12), 40,41 (PT13)

-- Sessions cho completed bookings (booking_id offset từ max id hiện tại)
-- Dùng subquery để lấy đúng booking_id
INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 1,
       b.requested_start,
       'present',
       'Buổi tập hiệu quả, kỹ thuật tốt, cần chú ý khởi động kỹ hơn'
FROM "TrainingBooking" b
WHERE b.status = 'completed' AND b.pt_id = 2
ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 2,
       b.requested_start,
       'present',
       'Học viên tiến bộ rõ rệt, tư thế Yoga cải thiện nhiều'
FROM "TrainingBooking" b
WHERE b.status = 'completed' AND b.pt_id = 5
ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 1,
       b.requested_start,
       CASE WHEN b.member_id % 3 = 0 THEN 'absent' ELSE 'present' END,
       CASE WHEN b.member_id % 3 = 0
            THEN 'Học viên vắng mặt không báo trước'
            ELSE 'Hoàn thành tốt bài Calisthenics, đang tiến gần đến Muscle Up'
       END
FROM "TrainingBooking" b
WHERE b.status = 'completed' AND b.pt_id = 9
ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 9,
       b.requested_start,
       'present',
       'Cardio tốt, nhịp tim ổn định, cần tăng cường độ thêm ở buổi sau'
FROM "TrainingBooking" b
WHERE b.status = 'completed' AND b.pt_id = 11
ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 2,
       b.requested_start,
       'present',
       'Học viên rất chăm chỉ, tư thế đẹp, tiếp tục duy trì'
FROM "TrainingBooking" b
WHERE b.status = 'completed' AND b.pt_id = 12
ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 8,
       b.requested_start,
       CASE WHEN b.member_id % 4 = 0 THEN 'absent' ELSE 'present' END,
       CASE WHEN b.member_id % 4 = 0
            THEN 'Học viên vắng mặt, cần liên hệ lại'
            ELSE 'Kỹ thuật đấm cải thiện, tiếp tục luyện footwork'
       END
FROM "TrainingBooking" b
WHERE b.status = 'completed' AND b.pt_id = 13
ORDER BY b.id;

-- Sessions cho accepted bookings (upcoming - chưa diễn ra)
INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 1, b.requested_start, 'present', ''
FROM "TrainingBooking" b
WHERE b.status = 'accepted'
ORDER BY b.id;
