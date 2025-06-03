// src/components/layout/Navbar.jsx
import React from 'react';
import { Heart, Home, Search, BookOpen, User, LogOut, UserCircle, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; //
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, isAuthenticated, logout, loading } = useAuth(); //
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); //
        toast.success('Đã đăng xuất!');
        navigate('/');
    };

    const navLinks = [
        { to: "/", label: "Trang chủ", icon: Home },
        { to: "/donate", label: "Hiến máu", icon: Heart }, // Cần tạo trang /donate
        { to: "/search", label: "Tìm kiếm", icon: Search }, // Cần tạo trang /search
        { to: "/blog", label: "Blog", icon: BookOpen },     // Cần tạo trang /blog
        { to: "/contact", label: "Liên hệ", icon: User },   // Cần tạo trang /contact
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <span className="text-xl font-bold text-gray-900">BloodConnect</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <link.icon className="w-4 h-4" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        {loading ? (
                            <span className="text-sm text-gray-500">Đang tải...</span>
                        ) : isAuthenticated && user ? (
                            <>
                                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-red-600">
                                    <UserCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium hidden sm:block">{user.fullName || user.email}</span>
                                </Link>
                                {user.role === 'Admin' && ( //
                                    <Link
                                        to="/admin"
                                        className="text-sm font-medium text-purple-600 hover:text-purple-800 px-3 py-1.5 rounded-md bg-purple-100 hover:bg-purple-200 transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium hidden sm:block">Đăng xuất</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition-colors text-sm"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Đăng nhập</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm px-3 py-1.5 rounded-md"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Đăng ký</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;