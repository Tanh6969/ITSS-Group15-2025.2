import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePackages } from '@/hooks/queries/usePackages';
import { useServiceCategories } from '@/hooks/queries/useServiceCategories';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Input from '@/components/Common/Input';
import { formatPriceVND } from '@/utils/formatters';
import { slideUpVariants, sectionStaggerVariants } from '@/lib/animations';

import { useTranslation } from 'react-i18next';
const PackageList = () => {
    const { t } = useTranslation('manager');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: packages, isLoading, isError } = usePackages();
  const { data: serviceCategories } = useServiceCategories();

  // Hàm helper để tính thời lượng hoặc số buổi
  const getDurationDisplay = (pkg) => {
    if (pkg.pricing_type === 'session_based') {
      return `${pkg.total_sessions || 0} buổi`;
    }
    const days = pkg.duration_days || 0;
    if (days >= 30) {
      const months = Math.round(days / 30);
      return `${months} tháng`;
    }
    return `${days} ngày`;
  };

  // Transform backend data để phù hợp với table
  const displayPackages = packages ? packages
    .filter(pkg => {
      if (!searchTerm) return true;
      return pkg.package_name?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map((pkg) => {
    // Tìm category tương ứng từ serviceCategories
    const category = serviceCategories?.find(cat => cat.id === pkg.category_id);

    return {
      id: pkg.id,
      name: pkg.package_name,
      duration: getDurationDisplay(pkg),
      price: pkg.price,
      status: pkg.is_active ? 'active' : 'inactive',
      categoryId: pkg.category_id,
      categoryName: category?.category_name || 'N/A',
      description: pkg.description || pkg.features?.join(", ") || category?.benefits_description || 'Không có mô tả',
    };
  }) : [];

  // Handler xem chi tiết gói tập
  const handleViewDetails = (packageId) => {
    navigate(`/manager/packages/${packageId}`);
  };

  return (
    <div className="space-y-6 relative">
      <motion.div variants={slideUpVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danh sách Gói tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem các dịch vụ gói tập do Gym cung cấp.
          </p>
        </div>
      </motion.div>

      {/* Filter Section */}
      <motion.div variants={slideUpVariants} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Tìm kiếm gói tập theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={slideUpVariants} className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải biểu giá...</div>
        ) : isError && !packages ? (
          <div className="p-8 text-center text-red-500">Lỗi lấy dữ liệu Gói tập.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Gói</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Giá (VND)</TableHead>
                <TableHead>Mô tả ngắn</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-center">Chi tiết gói</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayPackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                    Chưa có cấu hình gói tập nào.
                  </TableCell>
                </TableRow>
              ) : (
                displayPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{pkg.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {pkg.duration}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatPriceVND ? formatPriceVND(pkg.price) : `${pkg.price.toLocaleString('vi-VN')} đ`}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[250px] truncate" title={pkg.description}>
                      {pkg.description}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${pkg.status === 'active'
                        ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-50 text-gray-600 ring-gray-600/20 dark:bg-gray-800/50 dark:text-gray-400'
                        }`}>
                        {pkg.status === 'active' ? 'Đang bán' : 'Tạm dừng bán'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleViewDetails(pkg.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </div>
  );
};

export default PackageList;
