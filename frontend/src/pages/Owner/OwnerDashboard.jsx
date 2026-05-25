import React, { useMemo } from 'react';
import { ArrowUpRight, Users, ShieldCheck, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import RevenueChart from '@/components/Charts/RevenueChart';
import MemberStatsChart from '@/components/Charts/MemberStatsChart';
import PerformanceChart from '@/components/Charts/PerformanceChart';
import RetentionChart from '@/components/Charts/RetentionChart';
import PackagePerformanceChart from '@/components/Charts/PackagePerformanceChart';
import EquipmentStatusChart from '@/components/Charts/EquipmentStatusChart';
import { useMembers } from '@/hooks/queries/useMembers';
import { useTransactions } from '@/hooks/queries/useTransactions';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useTrainingBookings } from '@/hooks/queries/useTraining';

const parseArr = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);

const monthLabel = (d) => `T${d.getMonth() + 1}`;

const OwnerDashboard = () => {
  const { data: membersRaw } = useMembers(1, 1000);
  const { data: txRaw } = useTransactions();
  const { data: employeesRaw } = useEmployees(1, 200);
  const { data: bookingsRaw } = useTrainingBookings();

  const members = useMemo(() => parseArr(membersRaw), [membersRaw]);
  const transactions = useMemo(() => parseArr(txRaw), [txRaw]);
  const employees = useMemo(() => parseArr(employeesRaw), [employeesRaw]);
  const bookings = useMemo(() => Array.isArray(bookingsRaw) ? bookingsRaw : [], [bookingsRaw]);

  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  // ── Stats cards ────────────────────────────────────────────
  const monthRevenue = useMemo(() =>
    transactions
      .filter(t => { const d = new Date(t.date); return d.getMonth() === curMonth && d.getFullYear() === curYear; })
      .reduce((s, t) => s + (t.amount || 0), 0),
  [transactions, curMonth, curYear]);

  const newMembersCount = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'registration' && d.getMonth() === curMonth && d.getFullYear() === curYear;
    }).length,
  [transactions, curMonth, curYear]);

  const activeCount = useMemo(() =>
    members.filter(m => (m.status || '').toLowerCase() === 'active').length,
  [members]);

  const retentionRate = members.length > 0 ? Math.round(activeCount / members.length * 100) : 0;

  const statsCards = [
    { title: 'Doanh thu tháng này', value: fmt(monthRevenue), icon: ArrowUpRight, trend: 'up', trendValue: 'Tháng hiện tại' },
    { title: 'Hội viên mới', value: String(newMembersCount), icon: Users, trend: 'up', trendValue: 'Tháng này' },
    { title: 'Tỷ lệ giữ chân', value: `${retentionRate}%`, icon: ShieldCheck, trend: retentionRate >= 70 ? 'up' : 'down', trendValue: `${activeCount}/${members.length}` },
    { title: 'Nhân sự', value: String(employees.length), icon: Briefcase, trend: 'neutral', trendValue: 'Tổng cộng' },
  ];

  // ── Revenue chart (last 7 months) ─────────────────────────
  const revenueChartData = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(curYear, curMonth - i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const total = transactions
        .filter(t => { const td = new Date(t.date); return td.getMonth() === m && td.getFullYear() === y; })
        .reduce((s, t) => s + (t.amount || 0), 0);
      result.push({ name: monthLabel(d), total });
    }
    return result;
  }, [transactions, curMonth, curYear]);

  // ── Member stats chart (last 7 months) ────────────────────
  const memberChartData = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(curYear, curMonth - i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const newCount = transactions.filter(t => {
        const td = new Date(t.date);
        return t.type === 'registration' && td.getMonth() === m && td.getFullYear() === y;
      }).length;
      const endOfMonth = new Date(y, m + 1, 0);
      const active = members.filter(mb => {
        const reg = new Date(mb.registration_date || mb.created_at || 0);
        const exp = mb.end_date || mb.expiryDate;
        return reg <= endOfMonth && (!exp || new Date(exp) >= endOfMonth);
      }).length;
      const dropped = members.filter(mb => {
        const exp = mb.end_date || mb.expiryDate;
        if (!exp) return false;
        const expDate = new Date(exp);
        return expDate.getMonth() === m && expDate.getFullYear() === y;
      }).length;
      result.push({ name: monthLabel(d), new: newCount, active, dropped });
    }
    return result;
  }, [transactions, members, curMonth, curYear]);

  // ── Package distribution ───────────────────────────────────
  const packageData = useMemo(() => {
    const counts = {};
    transactions.forEach(t => {
      const pkg = t.package || 'Khác';
      counts[pkg] = (counts[pkg] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  // ── Package sold chart ─────────────────────────────────────
  const packageSoldData = useMemo(() => {
    const counts = {};
    transactions.forEach(t => {
      const pkg = t.package || 'Khác';
      counts[pkg] = (counts[pkg] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 6);
  }, [transactions]);

  // ── Staff performance chart ────────────────────────────────
  const staffChartData = useMemo(() => {
    const trainerSessionMap = {};
    bookings.filter(b => b.status === 'Accepted').forEach(b => {
      trainerSessionMap[b.pt_id] = (trainerSessionMap[b.pt_id] || 0) + 1;
    });
    return employees
      .filter(e => trainerSessionMap[e.id])
      .map(e => ({ name: (e.full_name || e.name || `NV#${e.id}`).split(' ').slice(-2).join(' '), sessions: trainerSessionMap[e.id] || 0 }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 6);
  }, [employees, bookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Tổng quan Chủ phòng tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem nhanh doanh thu, hội viên, thiết bị và nhân sự để ra quyết định chiến lược.
          </p>
        </div>
        <Link to="/owner/reports" className="flex items-center justify-center">
          <Button variant="outline" size="lg">Xem báo cáo tổng hợp</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <StatsCard key={card.title} title={card.title} value={card.value} icon={card.icon} trend={card.trend} trendValue={card.trendValue} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenueChart data={revenueChartData} title="Doanh thu 7 tháng gần nhất" description="Tổng doanh thu theo tháng từ giao dịch thực tế" />
        <RetentionChart />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MemberStatsChart data={memberChartData} />
        <PackagePerformanceChart data={packageSoldData} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <EquipmentStatusChart />
        <PerformanceChart data={packageData} />
      </div>
    </div>
  );
};

export default OwnerDashboard;
