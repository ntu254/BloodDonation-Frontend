// src/components/layout/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, ShieldAlert, Home as HomeIcon, Droplets, GitCompareArrows } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth'; // Sử dụng useAuth hook

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth(); // Lấy user và hàm logout từ context

    const handleLogout = () => {
        logout(); //
        navigate('/login');
    };

    // ProtectedRoute sẽ xử lý việc chưa đăng nhập hoặc sai role
    // Tuy nhiên, kiểm tra ở đây vẫn tốt để phòng trường hợp truy cập trực tiếp
    if (user?.role !== 'Admin') { //
        // navigate('/forbidden'); // Hoặc trang chủ nếu không có trang forbidden
        // return null; 
        // Note: Navigate trong render phase không được khuyến khích, ProtectedRoute đã làm việc này.
        // Nếu component này render, nghĩa là ProtectedRoute đã cho phép.
    }

    const isActive = (path) => location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path));


    const menuItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/users", icon: Users, label: "Quản lí người dùng" },
        { path: "/admin/blood-types", icon: Droplets, label: "Loại máu" },
        { path: "/admin/blood-components", icon: ShieldAlert, label: "Thành phần máu" },
        { path: "/admin/blood-compatibility", icon: GitCompareArrows, label: "Tương thích máu" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 pt-16"> {/* pt-16 cho navbar cố định chiều cao h-16 */}
                <aside className="w-64 bg-gray-800 text-white p-4 space-y-2 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4 px-2">Admin Panel</h2>
                    <nav>
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center p-2 rounded transition-colors ${isActive(item.path) ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={20} className="mr-3" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <hr className="my-2 border-gray-700" />
                            <li>
                                <Link to="/" className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
                                    <HomeIcon size={20} className="mr-3" />
                                    Về trang chủ
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded text-left"
                                >
                                    <LogOut size={20} className="mr-3" />
                                    Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 p-6 bg-gray-100 ml-64"> {/* ml-64 cho sidebar cố định */}
                    <Outlet />
                </main>
            </div>
            {/* Footer không cần thiết trong admin layout nếu không muốn */}
            <Footer />
        </div>
    );
};

export default AdminLayout;