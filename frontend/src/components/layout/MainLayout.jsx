// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; //
import Footer from './Footer'; //

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* Thêm pt-16 (chiều cao của Navbar) để nội dung không bị Navbar che */}
            <main className="flex-1 pt-16 bg-gray-50">
                <Outlet /> {/* Nội dung của các trang con sẽ được render ở đây */}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;