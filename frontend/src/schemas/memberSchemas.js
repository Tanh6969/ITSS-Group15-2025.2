import { z } from 'zod';

// Rule kiểm tra chuẩn hóa thông tin tạo Hội Viên
export const memberSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phoneNumber: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại di động không hợp lệ"),
  email: z.string().email("Email không đúng định dạng").optional().or(z.literal('')),
  address: z.string().optional(),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: "Vui lòng chọn giới tính hợp lệ" })
  }),
  dateOfBirth: z.string().optional(),
  roadmapGoal: z.string().optional(),
  memberFreeSchedule: z.string().optional(),
});
