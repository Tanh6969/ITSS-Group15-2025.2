import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Save, Plus } from 'lucide-react';
import { employeeService } from '@/services/employeeService';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';

const formatVND = (amount) =>
  Number(amount || 0).toLocaleString('vi-VN') + ' ₫';

const PERFORMANCE_OPTIONS = [
  { label: 'Xuất sắc (120%)',      multiplier: 1.2 },
  { label: 'Tốt (110%)',           multiplier: 1.1 },
  { label: 'Đạt yêu cầu (100%)',   multiplier: 1.0 },
  { label: 'Cần cải thiện (90%)',  multiplier: 0.9 },
];

const StaffSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingBonus, setAddingBonus] = useState(false);

  const [baseSalaryInput, setBaseSalaryInput] = useState('');
  const [performance, setPerformance] = useState(1.0);

  const [bonusInput, setBonusInput] = useState('');
  const [bonusNote, setBonusNote] = useState('');

  useEffect(() => {
    employeeService.getEmployeeById(id)
      .then((data) => {
        setEmployee(data);
        setBaseSalaryInput(String(data?.salary || 0));
      })
      .catch(() => toast.error('Không tải được thông tin nhân viên'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateSalaryInDB = async (newSalary) => {
    await employeeService.updateEmployee(id, { ...employee, id: parseInt(id), salary: newSalary });
    setEmployee((prev) => ({ ...prev, salary: newSalary }));
  };

  const handleSave = async () => {
    if (!employee) return;
    // Chỉ lưu lương cơ bản — multiplier chỉ để tính "Dự kiến", không ghi vào DB
    const base = parseFloat(baseSalaryInput.replace(/[^\d.]/g, '')) || 0;
    setSaving(true);
    try {
      await updateSalaryInDB(base);
      toast.success('Đã cập nhật lương cơ bản');
    } catch {
      toast.error('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBonus = async () => {
    const bonus = parseFloat(bonusInput.replace(/[^\d.]/g, '')) || 0;
    if (!bonus) return;
    const newSalary = (employee?.salary || 0) + bonus;
    setAddingBonus(true);
    try {
      await updateSalaryInDB(newSalary);
      setBaseSalaryInput(String(newSalary));
      setBonusInput('');
      setBonusNote('');
      toast.success(`Đã cộng thêm ${formatVND(bonus)}${bonusNote ? ` — ${bonusNote}` : ''}`);
    } catch {
      toast.error('Thêm thưởng thất bại');
    } finally {
      setAddingBonus(false);
    }
  };

  const estimatedSalary = () => {
    const base = parseFloat(baseSalaryInput.replace(/[^\d.]/g, '')) || employee?.salary || 0;
    return base * performance;
  };

  const name = employee?.full_name || `Nhân viên #${id}`;
  const position = employee?.position || '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/owner/staffs')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Quản lý lương — {name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {position} · Điều chỉnh lương theo năng suất làm việc
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lương hiện tại</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {employee?.salary ? formatVND(employee.salary) : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Thực nhận tháng này (tính toán)</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {formatVND(estimatedSalary())}
          </p>
          <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">Cơ bản × hệ số — không lưu vào DB</p>
        </div>
      </div>

      {/* Điều chỉnh lương cơ bản */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Điều chỉnh lương</h2>
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Lương cơ bản (VNĐ/tháng)</label>
          <input
            type="text"
            value={baseSalaryInput}
            onChange={(e) => setBaseSalaryInput(e.target.value)}
            placeholder="VD: 10000000"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Đánh giá năng suất</label>
          <select
            value={performance}
            onChange={(e) => setPerformance(parseFloat(e.target.value))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PERFORMANCE_OPTIONS.map((opt) => (
              <option key={opt.multiplier} value={opt.multiplier}>{opt.label}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            Lương thực nhận = Lương cơ bản × hệ số năng suất
          </p>
        </div>

        <Button onClick={handleSave} className="w-full" leftIcon={<Save className="h-4 w-4" />} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>

      {/* Thưởng thêm */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Cộng thêm thưởng / tips</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Số tiền sẽ được cộng trực tiếp vào lương hiện tại.
        </p>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Số tiền (VNĐ)</label>
          <input
            type="text"
            value={bonusInput}
            onChange={(e) => setBonusInput(e.target.value)}
            placeholder="VD: 500000"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">Lý do (tuỳ chọn)</label>
          <input
            type="text"
            value={bonusNote}
            onChange={(e) => setBonusNote(e.target.value)}
            placeholder="VD: Tips từ học viên, thưởng hoàn thành chỉ tiêu..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          onClick={handleAddBonus}
          variant="outline"
          className="w-full"
          leftIcon={<Plus className="h-4 w-4" />}
          disabled={!bonusInput || addingBonus}
        >
          {addingBonus ? 'Đang cộng...' : 'Cộng thêm vào lương'}
        </Button>
      </div>
    </div>
  );
};

export default StaffSalary;
