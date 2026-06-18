import React from 'react';
import { User, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cardVariants, staggerContainerVariants } from '@/lib/animations';

const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PTCardList = ({ ptDetails, setSelectedTrainer, bookings = [], selectedDate }) => {
  const { t } = useTranslation('member');

  // Day-of-week key for selectedDate
  const dayOfWeek = selectedDate
    ? DAY_MAP[new Date(`${selectedDate}T00:00:00`).getDay()]
    : null;

  // Đếm tổng số booking đang active (Pending, Accepted) và chưa hết hạn để giới hạn 5 lần
  const activeBookingsCount = bookings.filter(b => {
    const isActive = ['Pending', 'Accepted', 'Confirmed'].includes(b.status);
    const isNotExpired = new Date(b.requested_end) >= new Date();
    return isActive && isNotExpired;
  }).length;

  const isLimitReached = activeBookingsCount >= 5;

  const getPTStatus = (ptId) => {
    const hasBookingToday = bookings.some(b => {
      const isThisPT = b.pt_id === ptId;
      const isThisDay = b.requested_start.startsWith(selectedDate);
      const isActive = ['Pending', 'Accepted', 'Confirmed'].includes(b.status);
      const isNotExpired = new Date(b.requested_end) >= new Date();
      return isThisPT && isThisDay && isActive && isNotExpired;
    });
    return hasBookingToday ? 'Pending' : 'Available';
  };

  // Get available slots for this PT on the selected day
  const getPTSlotsToday = (pt) => {
    if (!pt.available_schedule || !dayOfWeek) return [];
    try {
      const sched = JSON.parse(pt.available_schedule);
      return sched[dayOfWeek] || [];
    } catch {
      return [];
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950">
      {ptDetails.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🗓️</div>
          <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">Không có PT làm việc hôm nay</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Thử chọn ngày khác để xem danh sách PT có lịch</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ptDetails.map((pt, index) => {
          const status = getPTStatus(pt.employee_id);
          const isPending = status === 'Pending';
          const slotsToday = getPTSlotsToday(pt);

          return (
            <motion.div
              key={pt.employee_id}
              variants={cardVariants}
              custom={index}
              whileHover={{ scale: 1.02, y: -3 }}
              className="group bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-shadow duration-300 relative overflow-hidden"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden border border-blue-50 dark:border-blue-800">
                    {pt.avatar ? (
                      <img src={pt.avatar} alt={pt.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </div>
                  {isPending && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug mb-2">
                    {pt.full_name}
                  </h3>

                  {/* Meta badges — inline, compact */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      {pt.experience_years || 0} năm KN
                    </span>
                    {slotsToday.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                        <Calendar className="h-3 w-3" />
                        {slotsToday.length} slot hôm nay
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-[11px] font-semibold text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800/50">
                        Đã đặt
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTrainer(pt.full_name)}
                      className="flex-1 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      {t('schedule.pt_card.view_detail')}
                    </button>

                    {isLimitReached ? (
                      <div className="flex-1 py-1.5 text-center bg-gray-100 dark:bg-gray-800 text-gray-400 text-[11px] font-bold rounded-lg cursor-not-allowed" title="Đã đạt giới hạn 5 lượt đặt">
                        Giới hạn
                      </div>
                    ) : isPending ? (
                      <div className="flex-1 py-1.5 text-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[11px] font-bold rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                        {t('schedule.pt_card.pending', { defaultValue: 'Đã đặt' })}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTrainer(pt.full_name)}
                        className="flex-1 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        {t('schedule.pt_card.book_btn')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default PTCardList;
