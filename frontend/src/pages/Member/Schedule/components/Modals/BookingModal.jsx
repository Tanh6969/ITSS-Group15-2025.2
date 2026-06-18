import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { X, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const INTENSITY_KEYS = ['Low', 'Medium', 'High'];

const BookingModal = ({
  bookingForm,
  closeBookingForm,
  handleBookingSubmit,
  formData,
  setFormData,
  isPending,
  bookings = [],
}) => {
  const { t } = useTranslation('member');
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Parse PT's full weekly schedule
  const ptSchedule = useMemo(() => {
    if (!bookingForm?.ptSchedule) return {};
    try { return JSON.parse(bookingForm.ptSchedule); } catch { return {}; }
  }, [bookingForm?.ptSchedule]);

  // Which day-of-week key for the chosen date
  const dayOfWeek = useMemo(() => {
    if (!formData.bookingDate) return null;
    return DAY_MAP[new Date(`${formData.bookingDate}T00:00:00`).getDay()];
  }, [formData.bookingDate]);

  // Sorted list of slots PT works that day
  const slotsForDay = useMemo(() => {
    if (!dayOfWeek) return [];
    return [...(ptSchedule[dayOfWeek] || [])].sort();
  }, [ptSchedule, dayOfWeek]);

  // Check whether a 1-hour slot overlaps an existing confirmed booking.
  // Backend stores times as UTC strings (e.g. "2026-06-24T17:00:00Z"),
  // so we parse slotStart as UTC too (append Z) to avoid local-offset mismatch.
  const isSlotBooked = useCallback((slot) => {
    if (!bookingForm?.ptId || !formData.bookingDate) return false;
    const slotStart = new Date(`${formData.bookingDate}T${slot}:00Z`);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
    return bookings.some((b) => {
      if (b.pt_id !== bookingForm.ptId) return false;
      if (!['Pending', 'Accepted'].includes(b.status)) return false;
      const bStart = new Date(b.requested_start);
      const bEnd = new Date(b.requested_end);
      return bStart < slotEnd && bEnd > slotStart;
    });
  }, [bookings, bookingForm?.ptId, formData.bookingDate]);

  // Clear selection when date changes
  useEffect(() => {
    setSelectedSlot(null);
    setFormData((prev) => ({ ...prev, startTime: '', endTime: '' }));
  }, [formData.bookingDate]);

  // Also clear when modal reopens for a different PT
  useEffect(() => {
    if (bookingForm) {
      setSelectedSlot(null);
      setFormData((prev) => ({ ...prev, startTime: '', endTime: '' }));
    }
  }, [bookingForm?.ptId]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    const [h, m] = slot.split(':').map(Number);
    const endTime = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setFormData((prev) => ({ ...prev, startTime: slot, endTime }));
  };

  if (!bookingForm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-950 rounded-xl max-w-md w-full my-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('schedule.booking_modal.title')}
          </h2>
          <button
            onClick={closeBookingForm}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleBookingSubmit} className="p-6 space-y-5">
          {/* PT Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-sm font-bold text-blue-900 dark:text-blue-300">
              PT: {bookingForm.trainer}
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              {t('schedule.booking_modal.date_label')} *
            </label>
            <input
              type="date"
              value={formData.bookingDate}
              onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
              min={new Date().toISOString().slice(0, 10)}
              required
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white w-full"
            />
          </div>

          {/* Slot Picker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gray-400" />
                Khung giờ tập *
              </label>
              {selectedSlot && (
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                  {selectedSlot} – {formData.endTime}
                </span>
              )}
            </div>

            {!formData.bookingDate ? (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-400 text-center">
                Chọn ngày để xem khung giờ
              </div>
            ) : slotsForDay.length === 0 ? (
              <div className="flex items-start gap-2.5 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-lg text-sm text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>PT <strong>{bookingForm.trainer}</strong> không có lịch làm việc vào ngày này. Vui lòng chọn ngày khác.</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {slotsForDay.map((slot) => {
                    const booked = isSlotBooked(slot);
                    const selected = selectedSlot === slot;
                    const [h, m] = slot.split(':').map(Number);
                    const endLabel = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked}
                        onClick={() => handleSlotSelect(slot)}
                        className={[
                          'relative py-3 px-2 rounded-xl text-[11px] font-semibold border transition-all text-center leading-tight',
                          booked
                            ? 'bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                            : selected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 dark:shadow-none scale-[1.04]'
                              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer',
                        ].join(' ')}
                      >
                        <div className="font-bold">{slot}</div>
                        <div className={`mt-0.5 ${selected ? 'opacity-80' : 'text-gray-400 dark:text-gray-500'}`}>
                          {endLabel}
                        </div>
                        {booked && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                            Bận
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <div className="w-3 h-3 rounded bg-white border border-gray-300 dark:border-gray-600" />
                    Còn trống
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <div className="w-3 h-3 rounded bg-blue-600" />
                    Đã chọn
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                    Đã có người đặt
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Intensity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('schedule.booking_modal.intensity_label')}
            </label>
            <div className="flex gap-2">
              {INTENSITY_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, intensity: key })}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    formData.intensity === key
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                  }`}
                >
                  {t(`schedule.booking_modal.intensity.${key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('schedule.booking_modal.curriculum_label')}
            </label>
            <textarea
              placeholder={t('schedule.booking_modal.curriculum_placeholder')}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-1 flex gap-3">
            <button
              type="button"
              onClick={closeBookingForm}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {t('schedule.booking_modal.cancel_btn')}
            </button>
            <button
              type="submit"
              disabled={isPending || !selectedSlot || slotsForDay.length === 0}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isPending ? t('schedule.booking_modal.submitting') : t('schedule.booking_modal.submit_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
