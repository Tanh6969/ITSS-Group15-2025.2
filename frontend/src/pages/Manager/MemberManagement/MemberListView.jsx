import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';
import { useMembers } from '@/hooks/queries/useMembers';
import { slideUpVariants, cardVariants, staggerContainerVariants, sectionStaggerVariants } from '@/lib/animations';

import { useTranslation } from 'react-i18next';

const getStatusConfig = (t) => ({
    active: { label: t('members.status_active'), color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    paused: { label: t('members.status_paused'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    expired: { label: t('members.status_expired'), color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    inactive: { label: t('members.status_inactive'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
});

const MemberListView = () => {
    const { t } = useTranslation('manager');
    const statusConfig = getStatusConfig(t);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Fetch all members from API to support search/filter across the full database
    const { data: memberResponse, isLoading, isError } = useMembers(1, 1000);

    // Normalize response to an array of members safely
    const members = Array.isArray(memberResponse)
        ? memberResponse
        : (memberResponse && Array.isArray(memberResponse.data))
            ? memberResponse.data
            : [];

    // Filter members with defensive checks
    const filteredMembers = members.filter((member) => {
        if (!member) return false;

        const name = (member.name || member.full_name || '').toString();
        const phone = (member.phone || '').toString();
        const id = (member.id || member.ID || '').toString();

        const q = searchTerm.toLowerCase();
        const matchSearch =
            name.toLowerCase().includes(q) ||
            phone.includes(searchTerm) ||
            id.includes(searchTerm);

        const matchStatus = statusFilter === 'all' || (member.status || member.Status) === statusFilter;

        return matchSearch && matchStatus;
    });

    const totalMemberItems = filteredMembers.length;
    const totalMemberPages = Math.ceil(totalMemberItems / limit) || 1;

    // Paginate the filtered results on the client side
    const paginatedMembers = filteredMembers.slice((currentPage - 1) * limit, currentPage * limit);

    // Show loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('members.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('members.subtitle')}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-gray-500 dark:text-gray-400">{t('members.loading')}</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('members.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('members.subtitle')}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                    <p className="text-red-600 dark:text-red-400">Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const config = statusConfig[status] || statusConfig.inactive;
        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        );
    };

    // Safe value getters with defaults
    const getMemberName = (member) => member?.name || 'N/A';
    const getMemberPhone = (member) => member?.phone || 'N/A';
    const getMemberPackage = (member) => member?.package || 'Chưa đăng ký';
    const getMemberSessions = (member) => member?.sessionsRemaining ?? 0;
    const getMemberExpiry = (member) => member?.expiryDate || 'N/A';
    const getMemberStatus = (member) => member?.status || 'inactive';

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div variants={slideUpVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('members.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách tất cả hội viên tại phòng gym
                    </p>
                </div>
                <button
                    onClick={() => navigate('/manager/members/create-with-account')}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm"
                >
                    <UserPlus className="h-4 w-4" />
                    Tạo tài khoản hội viên
                </button>
            </motion.div>

            {/* Filters */}
            <motion.div variants={slideUpVariants} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="text"
                                placeholder={t('members.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 items-center">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                            <option value="all">{t('members.filter_all')}</option>
                            <option value="active">{t('members.filter_active')}</option>
                            <option value="paused">{t('members.filter_paused')}</option>
                            <option value="expired">{t('members.filter_expired')}</option>
                            <option value="inactive">{t('members.filter_inactive')}</option>
                        </select>
                    </div>
                </div>

                {/* Result count */}
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{paginatedMembers.length}</span> trong <span className="font-medium">{totalMemberItems}</span> hội viên
                </div>
            </motion.div>

            {/* Members List */}
            <motion.div variants={staggerContainerVariants} className="space-y-3">
                {paginatedMembers.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <p className="text-gray-500 dark:text-gray-400">{t('members.no_member')}</p>
                    </div>
                ) : (
                    paginatedMembers.map((member, i) => (
                        <motion.div key={member.id} variants={cardVariants} custom={i} whileHover={{ scale: 1.01, y: -2 }}>
                        <Link to={`/manager/members/${member.id}`}>
                            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={(member.gender || '').toLowerCase() === 'nữ' ? '/src/assets/nu_ava.jpg' : '/src/assets/nam_ava.jpg'}
                                                alt="avatar"
                                                className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{getMemberName(member)}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{getMemberPhone(member)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex sm:items-center sm:gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberPackage(member)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{getMemberSessions(member)} buổi còn lại</p>
                                        </div>

                                        <div className="text-right">
                                            {getStatusBadge(getMemberStatus(member))}
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('members.filter_expired')}</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberExpiry(member)}</p>
                                        </div>
                                    </div>

                                    <ChevronRight className="ml-2 text-gray-400" size={20} />
                                </div>

                                {/* Mobile view */}
                                <div className="mt-3 flex flex-wrap gap-3 sm:hidden">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('members.package')}</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberPackage(member)}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('members.filter_expired')}</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberExpiry(member)}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {getStatusBadge(getMemberStatus(member))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Pagination */}
            {totalMemberPages > 1 && (
                <div className="mt-4 flex items-center justify-between bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t('members.pagination', { page: currentPage, total: totalMemberPages, count: totalMemberItems })}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalMemberPages, p + 1))}
                            disabled={currentPage === totalMemberPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberListView;
