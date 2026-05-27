import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';

// Hook lấy danh sách nhân viên với pagination
export const useEmployees = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['employees', page, limit],
    queryFn: () => employeeService.getEmployees(page, limit),
  });
};

export const useMyEmployee = () => {
  return useQuery({
    queryKey: ['employees', 'me'],
    queryFn: () => employeeService.getMe(),
  });
};

export const useUpdateMyEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => employeeService.updateMe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees', 'me'] }),
  });
};