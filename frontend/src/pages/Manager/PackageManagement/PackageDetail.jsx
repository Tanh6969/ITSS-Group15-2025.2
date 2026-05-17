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
    <div className="space-y-6">
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

      {/* Content - title: value rows, centered and fit to content */}
      <div>
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-800 p-4 w-fit ml-0 min-w-[220px]">
          <div className="flex flex-col gap-3 items-start text-left">
            <div className="flex items-center gap-2 justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">Giá:</span>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{formatPriceVND ? formatPriceVND(packageData.price) : `${packageData.price.toLocaleString('vi-VN')} đ`}</span>
            </div>

            <div className="flex items-center gap-2 justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">Thời hạn:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{getDurationDisplay(packageData.duration_days)}</span>
            </div>

            <div className="flex items-center gap-2 justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">Trạng thái:</span>
              {packageData.is_active ? (
                <><CheckCircle size={16} className="text-green-600" /><span className="text-sm font-semibold text-green-700 dark:text-green-300">Đang bán</span></>
              ) : (
                <><XCircle size={16} className="text-red-600" /><span className="text-sm font-semibold text-red-700 dark:text-red-300">Tạm dừng</span></>
              )}
            </div>

            <div className="flex items-center gap-2 justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">Mã gói:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{packageData?.id}</span>
            </div>

            <div className="flex items-center gap-2 justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">Tên gói:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{packageData?.package_name}</span>
            </div>

            <div className="flex items-center gap-2 justify-start">
              <span className="text-xs text-gray-500 dark:text-gray-400">Danh mục:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{categoryData?.category_name || '—'}</span>
            </div>

            <div className="w-full max-w-xl mt-2">
              <div className="flex items-start justify-start gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Mô tả:</span>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-left">{categoryData?.benefits_description || 'Không có mô tả.'}</div>
              </div>
            </div>
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
