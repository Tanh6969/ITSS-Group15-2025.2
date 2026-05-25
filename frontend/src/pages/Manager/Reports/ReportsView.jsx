import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';
import Button from '@/components/Common/Button';
import Badge from '@/components/Common/Badge';
import { useMembers } from '@/hooks/queries/useMembers';
import { useInvoices } from '@/hooks/queries/useInvoices';

// Màu sắc cho các gói tập
const PACKAGE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

const ptPerformanceData = [
    { name: 'Hùng Gym', sessions: 28, rating: 4.8 },
    { name: 'Tùng PT', sessions: 24, rating: 4.7 },
    { name: 'Lan Coach', sessions: 31, rating: 4.9 },
    { name: 'Minh Trainer', sessions: 19, rating: 4.6 }
];

const ReportsView = () => {
    const [timeframe, setTimeframe] = useState('6months');
    const { data: membersResponse } = useMembers(1, 1000);
    const { data: invoicesResponse } = useInvoices(1, 10000);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Format tiền sang triệu đồng
    const formatRevenueToMillion = (value) => {
        if (value === 0) return '0';
        return (value / 1000000).toFixed(0);
    };

    // Helper function to get month name in Vietnamese
    const getMonthNameVi = (date) => {
        const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        return months[date.getMonth()];
    };

    // Helper function to get number of months for timeframe
    const getMonthsForTimeframe = (timeframe) => {
        switch (timeframe) {
            case '1month': return 1;
            case '3months': return 3;
            case '6months': return 6;
            case '1year': return 12;
            default: return 6;
        }
    };

    // Calculate revenue and member data from invoices
    const chartData = useMemo(() => {
        const invoices = Array.isArray(invoicesResponse?.data)
            ? invoicesResponse.data
            : Array.isArray(invoicesResponse)
                ? invoicesResponse
                : [];

        const months = getMonthsForTimeframe(timeframe);
        const now = new Date();
        const monthsData = {};

        // Initialize months
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthsData[monthKey] = {
                month: getMonthNameVi(date),
                revenue: 0,
                members: 0,
                count: 0
            };
        }

        // Process invoices
        invoices.forEach(invoice => {
            const invoiceDate = new Date(invoice.date);
            const monthKey = `${invoiceDate.getFullYear()}-${String(invoiceDate.getMonth() + 1).padStart(2, '0')}`;

            if (monthsData[monthKey]) {
                monthsData[monthKey].revenue += parseFloat(invoice.amount || 0);
                monthsData[monthKey].count += 1;
            }
        });

        return Object.values(monthsData);
    }, [invoicesResponse, timeframe]);

    // Get filtered data
    const filteredInvoices = useMemo(() => {
        const invoices = Array.isArray(invoicesResponse?.data)
            ? invoicesResponse.data
            : Array.isArray(invoicesResponse)
                ? invoicesResponse
                : [];

        const months = getMonthsForTimeframe(timeframe);
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months + 1);
        startDate.setDate(1);
        const startDateNormalized = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        return invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.date);
            return invoiceDate >= startDateNormalized;
        });
    }, [invoicesResponse, timeframe]);

    // Calculate real package distribution from invoices
    const packageDistribution = useMemo(() => {
        const packageMap = {};

        // Group invoices by package name and count them
        filteredInvoices.forEach(invoice => {
            const packageName = invoice.package || 'Khác';
            if (!packageMap[packageName]) {
                packageMap[packageName] = 0;
            }
            packageMap[packageName] += 1;
        });

        // Convert to array and add colors
        return Object.entries(packageMap)
            .map(([name, count], index) => ({
                name,
                value: count,
                fill: PACKAGE_COLORS[index % PACKAGE_COLORS.length]
            }))
            .sort((a, b) => b.value - a.value); // Sort by count descending
    }, [filteredInvoices]);

    const totalRevenue = filteredInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount || 0), 0);
    const avgRevenue = filteredInvoices.length > 0 ? totalRevenue / getMonthsForTimeframe(timeframe) : 0;
    const invoiceCount = filteredInvoices.length;

    const members = Array.isArray(membersResponse?.data)
        ? membersResponse.data
        : Array.isArray(membersResponse)
            ? membersResponse
            : [];
    const totalMembers = typeof membersResponse?.total === 'number' ? membersResponse.total : members.length;
    const activeMembers = members.filter((member) =>
        member?.is_active === true || String(member?.status || '').toLowerCase() === 'active'
    ).length;
    const activeMemberPercent = totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : '0.0';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo Cáo</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Phân tích doanh thu, hội viên, và hiệu suất
                    </p>
                </div>
                <Button onClick={() => window.print()}>
                    <Download size={16} /> Xuất báo cáo
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
                <Filter size={18} className="text-gray-500" />
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                    <option value="1month">Tháng này</option>
                    <option value="3months">3 tháng</option>
                    <option value="6months">6 tháng</option>
                    <option value="1year">1 năm</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalRevenue)}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Trung bình {formatCurrency(avgRevenue)}/tháng</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Số lượng hoá đơn</p>
                    <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{invoiceCount}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Trung bình {(invoiceCount / getMonthsForTimeframe(timeframe)).toFixed(1)}/tháng</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng hội viên</p>
                    <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">{totalMembers}</p>
                    <div className="mt-1 flex gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">{activeMemberPercent}%</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">đang hoạt động</span>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Trung bình hoá đơn</p>
                    <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {invoiceCount > 0 ? formatCurrency(totalRevenue / invoiceCount) : formatCurrency(0)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">mỗi giao dịch</p>
                </div>

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Invoice Count Chart */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Số lượng hoá đơn theo tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Doanh thu theo tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `${formatRevenueToMillion(value)}M`} />
                            <Tooltip
                                formatter={(value) => `${formatRevenueToMillion(value)} triệu đ`}
                                labelFormatter={(label) => `${label}`}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Package Distribution */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Phân bổ gói tập</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={packageDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {packageDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Member Status */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Trạng thái hội viên</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Đang hoạt động</p>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{activeMembers} ({activeMemberPercent}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-green-500 transition-all"
                                    style={{ width: `${activeMemberPercent}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tạm dừng</p>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{totalMembers - activeMembers} ({((totalMembers - activeMembers) / totalMembers * 100).toFixed(1)}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-yellow-500 transition-all"
                                    style={{ width: `${100 - parseFloat(activeMemberPercent)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default ReportsView;
