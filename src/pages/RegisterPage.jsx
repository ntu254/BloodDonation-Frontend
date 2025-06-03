// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus as UserPlusIcon } from 'lucide-react'; 
import toast from 'react-hot-toast';

import Navbar from '../components/layout/Navbar'; // Đã refactor
import Footer from '../components/layout/Footer'; // Đã refactor
import { useAuth } from '../hooks/useAuth'; // Hook xác thực
import Button from '../components/common/Button'; // Component Button chung
import InputField from '../components/common/InputField'; // Component InputField chung

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        bloodTypeId: '', 
        agreeTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, isAuthenticated, loading: authLoading } = useAuth(); // Sử dụng hook useAuth
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true }); // Chuyển hướng nếu đã đăng nhập
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (!formData.agreeTerms) {
            toast.error('Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
            return;
        }
        if (formData.password.length < 6) { //
            toast.error('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }


        const toastId = toast.loading("Đang đăng ký...");
        try {        
            await register(
                formData.fullName,
                formData.email,
                formData.password,
                formData.bloodTypeId 
            ); //
            toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.", { id: toastId });
            navigate('/login');
        } catch (err) {
            toast.error(err.message || "Đăng ký thất bại. Vui lòng thử lại.", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24"> {/* Thêm padding top */}
                <div className="max-w-lg w-full space-y-8"> {/* Tăng max-w cho form rộng hơn chút */}
                    <div className="text-center">
                        <UserPlusIcon className="mx-auto h-12 w-auto text-red-600" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Tạo tài khoản mới
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Hoặc{' '}
                            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                                đăng nhập nếu đã có tài khoản
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10">
                        <form onSubmit={handleSubmit} className="space-y-5"> {/* Tăng space-y */}
                            <InputField
                                label="Họ và tên đầy đủ"
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Nguyễn Văn An"
                                required
                                disabled={authLoading}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5"> {/* Thêm gap-y */}
                                <InputField
                                    label="Địa chỉ Email"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="you@example.com"
                                    required
                                    disabled={authLoading}
                                />
                                <InputField
                                    label="Số điện thoại (Tùy chọn)"
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="09xxxxxxxx"
                                    disabled={authLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                <InputField
                                    label="Mật khẩu"
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Ít nhất 6 ký tự"
                                    required
                                    disabled={authLoading}
                                    hasIcon={true}
                                    icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    onIconClick={() => setShowPassword(!showPassword)}
                                />
                                <InputField
                                    label="Xác nhận mật khẩu"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                    disabled={authLoading}
                                    hasIcon={true}
                                    icon={showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>

                            {/* Nhóm máu */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu (ID - Tùy chọn)</label>
                                <select 
                                    id="bloodTypeId" 
                                    name="bloodTypeId" 
                                    value={formData.bloodTypeId} 
                                    onChange={handleInputChange} 
                                    disabled={authLoading}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                >
                                 <option value="">-- Chọn nhóm máu --</option>
                                 {bloodTypesFromApi.map(bt => <option key={bt.id} value={bt.id}>{bt.description}</option>)}
                                </select>
                            </div>

                            <div className="flex items-start pt-2"> {/* Thêm pt-2 */}
                                <input
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                                    disabled={authLoading}
                                    required
                                />
                                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                                    Tôi đã đọc và đồng ý với{' '}
                                    <Link to="/terms" className="font-medium text-red-600 hover:text-red-500">Điều khoản sử dụng</Link> và{' '}
                                    <Link to="/privacy" className="font-medium text-red-600 hover:text-red-500">Chính sách bảo mật</Link> của BloodConnect.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={authLoading}
                                isLoading={authLoading} // Truyền prop isLoading
                                variant="primary"
                                size="lg" // Làm nút to hơn một chút
                            >
                                Đăng ký tài khoản
                            </Button>
                        </form>
                    </div>
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Việc đăng ký là hoàn toàn miễn phí và tự nguyện.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;