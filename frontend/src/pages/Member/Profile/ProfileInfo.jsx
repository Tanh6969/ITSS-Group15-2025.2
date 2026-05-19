import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, MapPin, Edit3, ShieldCheck, Calendar, Loader2, Target, Clock, Lock, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import { memberService } from '@/services/memberService';
import { useChangePassword } from '@/hooks/mutations/useAuthMutations';
import useAuthStore from '@/store/useAuthStore';
import { toast } from '@/utils/toast';

const ProfileInfo = () => {
  const { user } = useAuthStore();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwShow, setPwShow] = useState({ old: false, new: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const changePwMutation = useChangePassword();

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        // Lấy thông tin member dựa trên account_id
        const response = await memberService.getMemberByAccountId(user.id);
        setMember(response);
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy thông tin thành viên.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-20 md:max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tài Khoản</h1>
        <Link to="/member/profile/edit">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-blue-200 px-5 font-semibold text-blue-600 shadow-sm hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40"
            leftIcon={<Edit3 className="h-4 w-4" />}
          >
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="relative h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <ShieldCheck className="h-3 w-3" /> {member.is_active ? 'Đã xác thực' : 'Chưa kích hoạt'}
          </div>
          <div className="absolute -bottom-12 left-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gray-100 shadow-md dark:border-gray-950">
            <User className="h-14 w-14 text-gray-400" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-16 sm:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{member.full_name || 'Chưa cập nhật'}</h2>
          <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-blue-600">MEM-{member.id}</p>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-lg font-medium leading-none">{member.phone || 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Mail className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">{member.email || 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">Giới tính: {member.gender || 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">Ngày sinh: {member.dob ? new Date(member.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="font-medium leading-snug text-gray-600 dark:text-gray-400">
                {member.address || 'Chưa cập nhật địa chỉ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 px-6 py-5 sm:px-8 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Thông tin tập luyện</h3>

        <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
          <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">Mục tiêu lộ trình</p>
            <p className="font-medium text-gray-600 dark:text-gray-400 leading-snug">
              {member.roadmap_goal || <span className="italic text-gray-400 dark:text-gray-600">Chưa cập nhật</span>}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
          <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">Lịch rảnh</p>
            <p className="font-medium text-gray-600 dark:text-gray-400 leading-snug">
              {member.member_free_schedule || <span className="italic text-gray-400 dark:text-gray-600">Chưa cập nhật</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Đổi mật khẩu */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <button
          type="button"
          onClick={() => { setShowPwForm(v => !v); setPwError(''); setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); }}
          className="flex w-full items-center justify-between px-6 py-5 sm:px-8"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
              <Lock className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Đổi mật khẩu</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Cập nhật mật khẩu đăng nhập</p>
            </div>
          </div>
          {showPwForm ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>

        {showPwForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPwError('');
              if (pwForm.newPassword.length < 6) { setPwError('Mật khẩu mới phải có ít nhất 6 ký tự'); return; }
              if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Mật khẩu mới và xác nhận không khớp'); return; }
              changePwMutation.mutate(
                { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword },
                { onSuccess: () => { setShowPwForm(false); setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); } }
              );
            }}
            className="border-t border-gray-100 dark:border-gray-800 px-6 pb-6 pt-5 sm:px-8 space-y-4"
          >
            {pwError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                {pwError}
              </div>
            )}

            {[
              { key: 'old', label: 'Mật khẩu hiện tại', field: 'oldPassword' },
              { key: 'new', label: 'Mật khẩu mới', field: 'newPassword' },
              { key: 'confirm', label: 'Xác nhận mật khẩu mới', field: 'confirmPassword' },
            ].map(({ key, label, field }) => (
              <div key={key} className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                <div className="relative">
                  <input
                    type={pwShow[key] ? 'text' : 'password'}
                    value={pwForm[field]}
                    onChange={(e) => setPwForm(prev => ({ ...prev, [field]: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setPwShow(prev => ({ ...prev, [key]: !prev[key] }))}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {pwShow[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowPwForm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={changePwMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {changePwMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...</> : 'Lưu mật khẩu'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
