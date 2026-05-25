import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import useThemeStore from '@/store/useThemeStore';

const defaultData = [
  { name: 'Gói Cơ Bản', value: 400 },
  { name: 'Gói VIP (Kèm PT)', value: 300 },
  { name: 'Lớp Nhóm (Yoga/Zumba)', value: 300 },
  { name: 'Khách vãng lai', value: 200 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];
const DARK_COLORS = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#22d3ee'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <p className="font-medium text-gray-900 dark:text-gray-100">{payload[0].name}</p>
        <p className="mt-1 font-bold" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} Hội viên
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ data: propData, className }) => {
  const isDark = useThemeStore((state) => state.theme === 'dark');
  const colors = isDark ? DARK_COLORS : COLORS;
  const data = (propData && propData.length > 0) ? propData : defaultData;

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Phân phối Dịch vụ</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tỷ lệ đăng ký dịch vụ của hội viên</p>
      </div>

      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
