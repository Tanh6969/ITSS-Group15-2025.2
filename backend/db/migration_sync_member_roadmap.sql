-- Đồng bộ roadmap_goal và member_free_schedule từ TrainingBooking vào Member.
-- Logic: lấy booking MỚI NHẤT (requested_start DESC) có dữ liệu không rỗng
-- cho từng member, rồi cập nhật vào bảng Member.
-- An toàn khi chạy nhiều lần (chỉ ghi đè nếu TrainingBooking có dữ liệu).

UPDATE "Member" m
SET
    roadmap_goal         = latest.roadmap_goal,
    member_free_schedule = latest.member_free_schedule
FROM (
    SELECT DISTINCT ON (member_id)
        member_id,
        roadmap_goal,
        member_free_schedule
    FROM "TrainingBooking"
    WHERE roadmap_goal         IS NOT NULL AND roadmap_goal         <> ''
      AND member_free_schedule IS NOT NULL AND member_free_schedule <> ''
    ORDER BY member_id, requested_start DESC
) latest
WHERE m.id = latest.member_id;
