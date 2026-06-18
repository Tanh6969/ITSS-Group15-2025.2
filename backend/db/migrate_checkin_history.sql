-- ============================================================
-- MIGRATE: CheckInHistory (v2 - giờ hành chính)
-- Quy tắc:
--  - Buổi có PT: check_in_time = requested_start của booking
--    (nằm trong khoảng [requested_start, requested_end])
--  - Buổi tự tập: giờ hành chính 07:00–17:00
-- ============================================================
SET client_encoding = 'UTF8';

TRUNCATE TABLE "CheckInHistory" RESTART IDENTITY;

-- ─────────────────────────────────────────────────────────────
-- MEMBER 1 | mem1@gym.com
--   PT: PT2 (Khoa) 2026-05-03 07:00-08:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 1, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=1 AND tb.pt_id=2 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(1, 1, '2026-04-15 08:00:00', NULL),
(1, 1, '2026-04-22 09:00:00', NULL),
(1, 3, '2026-05-10 08:30:00', NULL),
(1, 1, '2026-05-24 09:00:00', NULL),
(1, 1, '2026-06-01 08:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 2 | mem2@gym.com
--   PT: PT9 (Hung) 2026-05-01 07:00-08:00
--   PT: PT11 (Anh) 2026-04-28 06:00-07:00 → check in 06:10
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 2, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=2 AND tb.pt_id=9 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 2, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=2 AND tb.pt_id=11 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(2, 2, '2026-03-10 08:30:00', NULL),
(2, 2, '2026-03-17 09:00:00', NULL),
(2, 1, '2026-04-05 08:00:00', NULL),
(2, 2, '2026-05-20 09:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 3 | mem3@gym.com
--   PT: PT2 (Khoa) 2026-05-08 08:00-09:00
--   PT: PT13 (Tuan) 2026-04-25 07:00-08:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 3, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=3 AND tb.pt_id=2 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 3, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=3 AND tb.pt_id=13 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(3, 1, '2026-04-02 08:00:00', NULL),
(3, 3, '2026-04-16 09:00:00', NULL),
(3, 1, '2026-05-20 08:30:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 4 | mem4@gym.com
--   PT: PT5 (Lan) 2026-05-05 09:00-10:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 4, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=4 AND tb.pt_id=5 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(4, 2, '2026-03-12 09:00:00', NULL),
(4, 2, '2026-03-19 09:30:00', NULL),
(4, 2, '2026-04-08 09:00:00', NULL),
(4, 2, '2026-05-14 09:30:00', NULL),
(4, 2, '2026-06-04 09:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 5 | mem5@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(5, 1, '2026-03-05 08:00:00', NULL),
(5, 1, '2026-03-12 08:30:00', NULL),
(5, 1, '2026-04-09 09:00:00', NULL),
(5, 1, '2026-04-23 08:00:00', NULL),
(5, 8, '2026-05-07 09:30:00', NULL),
(5, 1, '2026-05-28 08:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 6 | mem6@gym.com
--   PT: PT9 (Hung) 2026-05-15 19:00-20:00  → giữ nguyên (lịch PT tối)
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 6, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=6 AND tb.pt_id=9 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(6, 2, '2026-04-14 09:00:00', NULL),
(6, 2, '2026-04-28 09:30:00', NULL),
(6, 2, '2026-05-26 10:00:00', NULL),
(6, 3, '2026-06-10 08:30:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 7 | mem7@gym.com
--   PT: PT13 (Tuan) 2026-05-12 19:00-20:00 → giữ nguyên (lịch PT tối)
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 7, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=7 AND tb.pt_id=13 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(7, 8, '2026-04-06 09:00:00', NULL),
(7, 8, '2026-04-20 09:30:00', NULL),
(7, 1, '2026-05-25 08:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 8 | mem8@gym.com
--   PT: PT5 (Lan) 2026-05-11 14:00-15:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 8, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=8 AND tb.pt_id=5 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(8, 2, '2026-03-18 14:00:00', NULL),
(8, 2, '2026-04-01 14:30:00', NULL),
(8, 2, '2026-04-22 14:00:00', NULL),
(8, 2, '2026-05-20 14:30:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 9 | mem9@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(9, 1, '2026-04-01 08:00:00', NULL),
(9, 1, '2026-04-15 08:30:00', NULL),
(9, 8, '2026-05-06 09:00:00', NULL),
(9, 1, '2026-05-20 08:00:00', NULL),
(9, 1, '2026-06-03 08:30:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 10 | mem10@gym.com
--   PT: PT12 (Mai) 2026-05-14 14:00-15:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 10, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=10 AND tb.pt_id=12 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(10, 2, '2026-03-11 14:00:00', NULL),
(10, 2, '2026-03-25 14:30:00', NULL),
(10, 2, '2026-04-10 14:00:00', NULL),
(10, 2, '2026-05-28 14:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 11 | mem11@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(11, 2, '2026-04-08 09:00:00', NULL),
(11, 2, '2026-04-22 09:30:00', NULL),
(11, 2, '2026-05-13 09:00:00', NULL),
(11, 2, '2026-06-03 09:30:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 12 | mem12@gym.com
--   PT: PT2 (Khoa) 2026-05-13 09:00-10:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 12, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=12 AND tb.pt_id=2 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(12, 1, '2026-04-07 09:00:00', NULL),
(12, 8, '2026-04-21 10:00:00', NULL),
(12, 1, '2026-05-19 09:00:00', NULL),
(12, 1, '2026-06-02 09:30:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 13 | mem13@gym.com
--   PT: PT11 (Anh) 2026-05-09 17:00-18:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 13, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=13 AND tb.pt_id=11 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(13, 3, '2026-04-03 09:00:00', NULL),
(13, 3, '2026-04-17 09:30:00', NULL),
(13, 3, '2026-05-22 10:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 14 | mem14@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(14, 1, '2026-03-08 08:00:00', NULL),
(14, 2, '2026-03-22 09:00:00', NULL),
(14, 1, '2026-04-12 08:30:00', NULL),
(14, 1, '2026-05-03 08:00:00', NULL),
(14, 1, '2026-05-17 09:00:00', NULL),
(14, 1, '2026-06-07 08:30:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 15 | mem15@gym.com
--   PT: PT12 (Mai) 2026-05-07 08:00-09:00
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id")
SELECT 15, ts.facility_id, ts.session_time, tb.id
FROM "TrainingBooking" tb JOIN "TrainingSession" ts ON ts.booking_id = tb.id
WHERE tb.member_id=15 AND tb.pt_id=12 AND tb.status='Completed';

INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(15, 2, '2026-03-14 08:00:00', NULL),
(15, 2, '2026-04-04 08:30:00', NULL),
(15, 2, '2026-04-25 08:00:00', NULL),
(15, 2, '2026-05-30 09:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 16 | mem16@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(16, 1, '2026-04-07 09:00:00', NULL),
(16, 8, '2026-04-21 10:00:00', NULL),
(16, 1, '2026-05-05 09:30:00', NULL),
(16, 1, '2026-05-19 08:30:00', NULL),
(16, 8, '2026-06-02 09:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 17 | mem17@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(17, 2, '2026-03-16 10:00:00', NULL),
(17, 2, '2026-03-23 10:30:00', NULL),
(17, 2, '2026-04-06 10:00:00', NULL),
(17, 2, '2026-04-20 10:00:00', NULL),
(17, 2, '2026-05-04 10:30:00', NULL),
(17, 2, '2026-05-18 10:00:00', NULL),
(17, 2, '2026-06-01 10:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 18 | mem18@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(18, 1, '2026-03-09 08:00:00', NULL),
(18, 1, '2026-03-23 08:30:00', NULL),
(18, 8, '2026-04-13 09:00:00', NULL),
(18, 1, '2026-05-04 08:00:00', NULL),
(18, 1, '2026-05-18 08:30:00', NULL),
(18, 1, '2026-06-01 08:00:00', NULL),
(18, 1, '2026-06-08 09:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 19 | mem19@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(19, 2, '2026-04-10 10:00:00', NULL),
(19, 2, '2026-04-24 10:30:00', NULL),
(19, 2, '2026-05-08 10:00:00', NULL),
(19, 3, '2026-05-22 10:30:00', NULL),
(19, 2, '2026-06-05 10:00:00', NULL);

-- ─────────────────────────────────────────────────────────────
-- MEMBER 20 | mem20@gym.com – không có PT Completed
-- ─────────────────────────────────────────────────────────────
INSERT INTO "CheckInHistory" ("member_id","facility_id","check_in_time","booking_id") VALUES
(20, 1, '2026-03-01 09:00:00', NULL),
(20, 1, '2026-03-15 09:30:00', NULL),
(20, 8, '2026-03-29 08:00:00', NULL),
(20, 1, '2026-04-05 09:00:00', NULL),
(20, 1, '2026-04-19 09:30:00', NULL),
(20, 8, '2026-05-03 08:00:00', NULL),
(20, 1, '2026-05-17 09:00:00', NULL),
(20, 1, '2026-06-01 09:30:00', NULL),
(20, 8, '2026-06-14 08:00:00', NULL);
