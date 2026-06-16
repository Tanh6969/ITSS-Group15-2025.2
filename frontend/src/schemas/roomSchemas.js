import { z } from 'zod';

export const roomSchema = z.object({
  facility_name: z.string().min(2, { message: 'Tên phòng phải có ít nhất 2 ký tự' }).max(100),
  facility_type: z.string().min(1, { message: 'Vui lòng chọn loại phòng' }),
  status: z.enum(['Operating', 'Maintenance', 'Closed']).optional().default('Operating'),
  description: z.string().optional(),
  amenities: z.string().optional(),
  max_capacity: z.coerce.number().min(1, { message: 'Sức chứa tối thiểu 1 người' }).max(1000, { message: 'Sức chứa tối đa 1000 người' }),
});
