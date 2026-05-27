import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberSchema } from '@/schemas/memberSchemas';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const MemberForm = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema), // Gắn Schema Zod vào React Hook Form
    defaultValues: initialData || {
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      gender: 'male',
      dateOfBirth: '',
      roadmapGoal: '',
      memberFreeSchedule: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Họ và tên *"
          placeholder="Nhập họ và tên..."
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Số điện thoại *"
          placeholder="Nhập số di động..."
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Nhập email dự phòng..."
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Ngày tháng năm sinh"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register('dateOfBirth')}
        />
        
        {/* Khu vực Chọn Giới tính (Select Form) */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Giới tính *</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
            {...register('gender')}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
          {errors.gender && <span className="text-xs font-medium text-red-500">{errors.gender.message}</span>}
        </div>
        
        <Input
          label="Địa chỉ hiện tại"
          placeholder="Nhập số nhà, tên đường..."
          error={errors.address?.message}
          {...register('address')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mục tiêu tập luyện</label>
          <textarea
            rows={3}
            placeholder="Nhập mục tiêu tập luyện của hội viên..."
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-none"
            {...register('roadmapGoal')}
          />
          {errors.roadmapGoal && <span className="text-xs font-medium text-red-500">{errors.roadmapGoal.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Lịch tập tự do</label>
          <textarea
            rows={3}
            placeholder="Nhập lịch tập tự do của hội viên (ví dụ: Thứ 2, 4, 6 buổi sáng)..."
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-none"
            {...register('memberFreeSchedule')}
          />
          {errors.memberFreeSchedule && <span className="text-xs font-medium text-red-500">{errors.memberFreeSchedule.message}</span>}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t dark:border-gray-800">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData ? 'Lưu thay đổi' : 'Thêm Hội viên'}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
