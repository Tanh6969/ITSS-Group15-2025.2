import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';

/* ─── Constants ─── */
const STATUS_ORDER = ['Pending', 'Accepted', 'Rejected', 'Expired'];

const STATUS_CONFIG = {
  Pending: {
    labelKey: 'schedule.status.Pending',
    icon: Clock,
    pill: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700',
    dot: 'bg-amber-400',
    accent: '#F59E0B',
    sectionBg: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/40',
    sectionTitle: 'text-amber-700 dark:text-amber-400',
  },
  Accepted: {
    labelKey: 'schedule.status.Accepted',
    icon: CheckCircle2,
    pill: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700',
    dot: 'bg-green-500',
    accent: '#16A34A',
    sectionBg: 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800/40',
    sectionTitle: 'text-green-700 dark:text-green-400',
  },
  Rejected: {
    labelKey: 'schedule.status.Rejected',
    icon: XCircle,
    pill: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700',
    dot: 'bg-red-400',
    accent: '#EF4444',
    sectionBg: 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-800/40',
    sectionTitle: 'text-red-700 dark:text-red-400',
  },
  Expired: {
    labelKey: 'schedule.status.Expired',
    icon: AlertCircle,
    pill: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-400',
    accent: '#9CA3AF',
    sectionBg: 'bg-gray-50/80 dark:bg-gray-900/20 border-gray-100 dark:border-gray-800',
    sectionTitle: 'text-gray-500 dark:text-gray-400',
  },
};

/* ─── helpers ─── */
const formatDateTime = (dateStr, timeStr, locale) => {
  const d = new Date(`${dateStr}T${timeStr}:00`);
  return d.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/* ─── Single request card ─── */
const RequestCard = ({ dateStr, workout, locale, setSelectedDeniedRequest, setSelectedWorkout }) => {
  const { t } = useTranslation('member');
  const cfg = STATUS_CONFIG[workout.status] || STATUS_CONFIG.Expired;
  const Icon = cfg.icon;

  return (
    <div className="flex gap-3 group">
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-1 shrink-0">
        <div className={`w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-950 ${cfg.dot}`} />
        <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />
      </div>

      {/* Card body */}
      <div
        className={`flex-1 mb-3 rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${cfg.sectionBg}`}
      >
        {/* Accent top bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: cfg.accent }} />

        <div className="px-4 py-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                {workout.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {formatDateTime(dateStr, workout.startTime, locale)}
                  &nbsp;·&nbsp;
                  {workout.startTime}–{workout.endTime}
                </span>
              </div>
            </div>

            {/* Status pill */}
            <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${cfg.pill}`}>
              <Icon className="w-3 h-3" />
              {t(cfg.labelKey, { defaultValue: workout.status })}
            </span>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {workout.type && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                {workout.type}
              </span>
            )}

            {/* Action button for Rejected */}
            {workout.status === 'Rejected' && (
              <button
                onClick={() => setSelectedDeniedRequest(workout)}
                className="ml-auto flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {t('schedule.workout_list.detail_btn')}
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Status section ─── */
const StatusSection = ({ status, items, locale, setSelectedDeniedRequest, setSelectedWorkout }) => {
  const { t } = useTranslation('member');
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Section heading */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon className={`w-4 h-4 ${cfg.sectionTitle}`} />
        <span className={`text-xs font-bold uppercase tracking-wide ${cfg.sectionTitle}`}>
          {t(cfg.labelKey, { defaultValue: status })}
        </span>
        <span className="text-xs font-bold text-white bg-gray-400 dark:bg-gray-600 rounded-full px-1.5 py-0.5 leading-none ml-0.5">
          {items.length}
        </span>
      </div>

      {/* Timeline cards */}
      <div>
        {items.map(({ dateStr, workout }, idx) => (
          <RequestCard
            key={`${dateStr}-${workout.bookingId}-${idx}`}
            dateStr={dateStr}
            workout={workout}
            locale={locale}
            setSelectedDeniedRequest={setSelectedDeniedRequest}
            setSelectedWorkout={setSelectedWorkout}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── Main component ─── */
const RequestsTimeline = ({ requestsWorkouts, locale, setSelectedDeniedRequest, setSelectedWorkout }) => {
  const { t } = useTranslation('member');

  // Flatten map → list, then group by status
  const { grouped, totalCount } = useMemo(() => {
    const grouped = { Pending: [], Accepted: [], Rejected: [], Expired: [] };
    let totalCount = 0;

    // Sort dates newest first
    const sortedDates = Object.keys(requestsWorkouts).sort().reverse();

    sortedDates.forEach((dateStr) => {
      const workouts = requestsWorkouts[dateStr] || [];
      workouts.forEach((workout) => {
        const s = workout.status;
        if (grouped[s]) {
          grouped[s].push({ dateStr, workout });
        } else {
          // Unknown status → Expired bucket
          grouped.Expired.push({ dateStr, workout });
        }
        totalCount++;
      });
    });

    return { grouped, totalCount };
  }, [requestsWorkouts]);

  /* Empty state */
  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-3xl">
          📋
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-semibold">
          {t('schedule.requests_timeline.empty_title')}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          {t('schedule.requests_timeline.empty_hint')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 dark:text-white">
            {t('schedule.requests_timeline.title')}
          </h2>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {t('schedule.requests_timeline.total', { count: totalCount })}
          </span>
        </div>

        {/* Quick status summary chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {STATUS_ORDER.map((status) => {
            const count = grouped[status]?.length ?? 0;
            if (count === 0) return null;
            const cfg = STATUS_CONFIG[status];
            const Icon = cfg.icon;
            return (
              <span key={status} className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.pill}`}>
                <Icon className="w-3 h-3" />
                {t(cfg.labelKey, { defaultValue: status })} · {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Grouped list */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {STATUS_ORDER.map((status) => (
          <StatusSection
            key={status}
            status={status}
            items={grouped[status] || []}
            locale={locale}
            setSelectedDeniedRequest={setSelectedDeniedRequest}
            setSelectedWorkout={setSelectedWorkout}
          />
        ))}
      </div>
    </div>
  );
};

export default RequestsTimeline;
