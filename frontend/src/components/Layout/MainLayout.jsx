import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import useUIStore from '@/store/useUIStore';
import { pageVariants, sidebarOverlayVariants } from '@/lib/animations';

const MainLayout = () => {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const { pathname } = useLocation();

  // Tự động xử lý ẩn / hiện Sidebar phản ứng theo thiết bị Mobile (Responsive UX)
  useEffect(() => {
    const handleResize = () => {
      // 1024px là chuẩn Breakpoint LG của Tailwind
      window.innerWidth < 1024 ? setSidebarOpen(false) : setSidebarOpen(true);
    };
    
    // Validate lúc khởi chạy
    handleResize();

    // Bắt sự kiện người dùng kéo nhỏ to web trình duyệt
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Tự động đóng Sidebar trên Điện thoại nếu bị bấm qua trang khác (Path thay đổi)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* 1. Thanh Panel trái (Sidebar) */}
      <Sidebar />
      
      {/* Nền đen trong mờ mờ mờ chắn phía sau khi bật Sidebar ở trên Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            variants={sidebarOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 2. Khay hiển thị Main Body (Chiếm hết diện tích còn lại) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* 2.1 Thanh điều khiển trên cùng */}
        <Header />
        
        {/* 2.2 Khu vực Bơm Component (Outlet) của React Router (Quan Trọng Nhất) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full pb-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* 2.3 Phân đoạn Copyright cuối cùng */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
