import React from 'react';

const intensityMap = { Low: 'Nhẹ', Medium: 'Trung bình', High: 'Cao' };

const EvaluationView = ({ selectedDate, selectedDateObject, dayNames, sessions }) => {
  const dateDisplay = selectedDateObject
    ? `${dayNames[selectedDateObject.getDay()]}, ${String(selectedDateObject.getDate()).padStart(2, '0')}/${String(selectedDateObject.getMonth() + 1).padStart(2, '0')}/${selectedDateObject.getFullYear()}`
    : selectedDate;

  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-2xl">
          📋
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-semibold">Không có đánh giá</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          {selectedDate
            ? 'Ngày này chưa có buổi tập nào được đánh giá'
            : 'Chọn ngày có chấm màu để xem đánh giá của PT'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="w-1.5 h-5 bg-blue-600 rounded-full shrink-0" />
        <h2 className="text-sm font-bold text-gray-800 dark:text-white">{dateDisplay}</h2>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          {sessions.length} buổi tập
        </span>
      </div>

      {sessions.map((session, idx) => (
        <SessionCard key={idx} session={session} />
      ))}
    </div>
  );
};

const SessionCard = ({ session }) => {
  const isPresent = session.attendanceStatus === 'Present';
  const hasDetail =
    session.ptFeedback || session.physicalCondition || session.sessionResult || session.nutritionAdvice;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Card header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-800 dark:text-white text-sm">{session.ptName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {session.startTime} – {session.endTime}
          </p>
          {session.trainingPlanNote && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
              {session.trainingPlanNote}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isPresent
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}
          >
            {isPresent ? 'Có mặt' : 'Vắng mặt'}
          </span>
          {session.intensity && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ⚡ {intensityMap[session.intensity] ?? session.intensity}
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 space-y-3">
        {session.ptFeedback && (
          <InfoRow label="Nhận xét của PT" value={session.ptFeedback} highlight />
        )}
        {session.physicalCondition && (
          <InfoRow label="Tình trạng thể chất" value={session.physicalCondition} />
        )}
        {session.sessionResult && (
          <InfoRow label="Kết quả buổi tập" value={session.sessionResult} />
        )}
        {session.nutritionAdvice && (
          <InfoRow label="Lời khuyên dinh dưỡng" value={session.nutritionAdvice} />
        )}
        {!hasDetail && (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            PT chưa nhập đánh giá chi tiết cho buổi này.
          </p>
        )}
      </div>
    </div>
  );
};

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

export default EvaluationView;
