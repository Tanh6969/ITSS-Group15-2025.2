ALTER TABLE "TrainingBooking" ADD COLUMN IF NOT EXISTS intensity varchar;
ALTER TABLE "TrainingBooking" ADD COLUMN IF NOT EXISTS roadmap_goal text;
ALTER TABLE "TrainingBooking" ADD COLUMN IF NOT EXISTS member_free_schedule text;
ALTER TABLE "TrainingBooking" ADD COLUMN IF NOT EXISTS rejection_reason text DEFAULT '';
