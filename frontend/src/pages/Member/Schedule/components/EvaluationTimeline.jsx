import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Dumbbell, Calendar, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';

/* ─── helpers ─── */
const getMonthKey = (dateStr) => dateStr.slice(0, 7); // "yyyy-MM"

const formatDate = (dateStr, locale) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatMonthHeading = (monthKey, locale) => {
  const [year, month] = monthKey.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
};

/* ─── sub-components ─── */

const StatsBadge = ({ icon: Icon, label, value, colorClass }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${colorClass}`}>
    <Icon className="w-4 h-4 shrink-0" />
    <span className="text-xs text-current opacity-70">{label}</span>
    <span>{value}</span>
  </div>
);

const InfoRow = ({ label, value, highlight }) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p
      className={`text-sm leading-relaxed ${
        highlight
          ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2'
          : 'text-gray-700 dark:text-gray-300'
      }`}
    >
      {value}
    </p>
  </div>
);

const SessionRow = ({ session, dateStr, locale }) => {
  const { t } = useTranslation('member');
  const [expanded, setExpanded] = useState(false);
  const isPresent = session.attendanceStatus === 'Present';
  const hasDetail =
    session.ptFeedback ||
    session.physicalCondition ||
    session.sessionResult ||
    session.nutritionAdvice;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all">
      {/* Row header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {/* Attendance icon */}
        <div className="mt-0.5 shrink-0">
          {isPresent ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-gray-800 dark:text-white">{session.ptName}</span>
            {session.intensity && (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                ⚡ {t(`schedule.evaluation.intensity.${session.intensity}`, { defaultValue: session.intensity })}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {formatDate(dateStr, locale)} &nbsp;·&nbsp; {session.startTime}–{session.endTime}
          </p>
          {/* Preview first line of ptFeedback when collapsed */}
          {!expanded && session.ptFeedback && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 truncate italic">
              "{session.ptFeedback}"
            </p>
          )}
        </div>

        {/* Expand toggle */}
        <div className="shrink-0 ml-1 text-gray-400 dark:text-gray-500">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable detail body */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100 dark:border-gray-700/60">
          {session.ptFeedback && (
            <InfoRow label={t('schedule.evaluation.pt_feedback')} value={session.ptFeedback} highlight />
          )}
          {session.physicalCondition && (
            <InfoRow label={t('schedule.evaluation.physical')} value={session.physicalCondition} />
          )}
          {session.sessionResult && (
            <InfoRow label={t('schedule.evaluation.result')} value={session.sessionResult} />
          )}
          {session.nutritionAdvice && (
            <InfoRow label={t('schedule.evaluation.nutrition')} value={session.nutritionAdvice} />
          )}
          {session.trainingPlanNote && (
            <InfoRow label={t('schedule.evaluation.plan_note')} value={session.trainingPlanNote} />
          )}
          {!hasDetail && (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              {t('schedule.evaluation.no_detail')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const MonthGroup = ({ monthKey, entries, locale, defaultOpen }) => {
  const { t } = useTranslation('member');
  const [open, setOpen] = useState(defaultOpen);
  const presentCount = entries.reduce(
    (acc, { sessions }) => acc + sessions.filter((s) => s.attendanceStatus === 'Present').length,
    0,
  );
  const totalCount = entries.reduce((acc, { sessions }) => acc + sessions.length, 0);

  return (
    <div>
      {/* Month header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 py-2 px-1 mb-2 group"
      >
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
            {formatMonthHeading(monthKey, locale)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {t('schedule.evaluation.timeline.sessions', { count: totalCount })}
            &nbsp;·&nbsp;
            {t('schedule.evaluation.timeline.present_count', { count: presentCount })}
          </span>
        </div>
        <div className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Session rows */}
      {open && (
        <div className="space-y-2 pl-0">
          {entries.map(({ dateStr, sessions }) =>
            sessions.map((session, idx) => (
              <SessionRow key={`${dateStr}-${idx}`} session={session} dateStr={dateStr} locale={locale} />
            )),
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Main component ─── */
const EvaluationTimeline = ({ completedSessionsMap, locale }) => {
  const { t } = useTranslation('member');

  // Flatten and sort: newest date first, grouped by month
  const { monthGroups, totalSessions, presentSessions, lastDate } = useMemo(() => {
    const allDates = Object.keys(completedSessionsMap).sort().reverse(); // newest first
    let total = 0;
    let present = 0;
    let last = null;

    const grouped = {}; // { "yyyy-MM": [{ dateStr, sessions }] }

    allDates.forEach((dateStr) => {
      const sessions = completedSessionsMap[dateStr];
      if (!sessions || sessions.length === 0) return;
      const mk = getMonthKey(dateStr);
      if (!grouped[mk]) grouped[mk] = [];
      grouped[mk].push({ dateStr, sessions });
      total += sessions.length;
      present += sessions.filter((s) => s.attendanceStatus === 'Present').length;
      if (!last) last = dateStr;
    });

    // Sort month keys newest first
    const monthGroups = Object.keys(grouped)
      .sort()
      .reverse()
      .map((mk) => ({ monthKey: mk, entries: grouped[mk] }));

    return { monthGroups, totalSessions: total, presentSessions: present, lastDate: last };
  }, [completedSessionsMap]);

  /* Empty state */
  if (totalSessions === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-3xl">
          🏋️
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-semibold">
          {t('schedule.evaluation.timeline.empty_title')}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          {t('schedule.evaluation.timeline.empty_hint')}
        </p>
      </div>
    );
  }

  const attendancePct = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;
  const lastDateDisplay = lastDate ? formatDate(lastDate, locale) : '—';

  return (
    <div className="flex flex-col h-full">
      {/* ── Stats bar ── */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-3">
          {t('schedule.evaluation.timeline.history_title')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <StatsBadge
            icon={Dumbbell}
            label={t('schedule.evaluation.timeline.stat_total')}
            value={totalSessions}
            colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          />
          <StatsBadge
            icon={TrendingUp}
            label={t('schedule.evaluation.timeline.stat_attendance')}
            value={`${attendancePct}%`}
            colorClass={
              attendancePct >= 80
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : attendancePct >= 50
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }
          />
          <StatsBadge
            icon={Calendar}
            label={t('schedule.evaluation.timeline.stat_last')}
            value={lastDateDisplay}
            colorClass="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          />
        </div>
      </div>

      {/* ── Timeline list ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {monthGroups.map(({ monthKey, entries }, idx) => (
          <MonthGroup
            key={monthKey}
            monthKey={monthKey}
            entries={entries}
            locale={locale}
            defaultOpen={idx === 0} // only latest month open by default
          />
        ))}
      </div>
    </div>
  );
};

export default EvaluationTimeline;
