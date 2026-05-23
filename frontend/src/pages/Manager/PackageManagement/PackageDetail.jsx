import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Package, Tag } from 'lucide-react';
import { usePackageDetails } from '@/hooks/queries/usePackages';
import { useServiceCategoryDetails } from '@/hooks/queries/useServiceCategories';
import { formatPriceVND } from '@/utils/formatters';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: packageData, isLoading, isError } = usePackageDetails(id);
  const { data: categoryData } = useServiceCategoryDetails(packageData?.category_id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Đang tải chi tiết gói tập...</div>
      </div>
    );
  }

  if (isError || !packageData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-red-500">Không tìm thấy gói tập</div>
        <button
          onClick={() => navigate('/manager/packages')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // Hàm helper để chuyển đổi ngày thành "X tháng" hoặc "X ngày"
  const getDurationDisplay = (days) => {
    if (days >= 30) {
      const months = Math.round(days / 30);
      return `${months} tháng`;
    }
    return `${days} ngày`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/manager/packages')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Quay lại"
        >
          <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{packageData.package_name}</h1>
        </div>
      </div>

      {/* Content - Grid Layout */}
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Giá */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Giá</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatPriceVND ? formatPriceVND(packageData.price) : `${packageData.price.toLocaleString('vi-VN')} đ`}</span>
          </div>

          {/* Thời hạn */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Thời hạn</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{getDurationDisplay(packageData.duration_days)}</span>
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Trạng thái</span>
            <div className="flex items-center gap-2">
              {packageData.is_active ? (
                <>
                  <CheckCircle size={20} className="text-green-600" />
                  <span className="text-lg font-semibold text-green-700 dark:text-green-300">Đang bán</span>
                </>
              ) : (
                <>
                  <XCircle size={20} className="text-red-600" />
                  <span className="text-lg font-semibold text-red-700 dark:text-red-300">Tạm dừng</span>
                </>
              )}
            </div>
          </div>

          {/* Mã gói */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Mã gói</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white font-mono">{packageData?.id}</span>
          </div>

          {/* Danh mục */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Danh mục</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">{categoryData?.category_name || '—'}</span>
          </div>

          {/* Tên gói */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tên gói</span>
            <span className="text-lg font-medium text-gray-900 dark:text-white">{packageData?.package_name}</span>
          </div>

          {/* Mô tả - Full Width */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Mô tả & Quyền lợi</span>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{categoryData?.benefits_description || 'Không có mô tả.'}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/manager/packages')}
          className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default PackageDetail;
