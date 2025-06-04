// src/components/layout/Footer.jsx
import React from 'react';
import { Heart, Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-pink-50 pt-16 p-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div>
                        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
                        <span class="text-xl font-medium text-gray-900">BloodConnect</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Kết nối yêu thương, chia sẻ sự sống. Chúng tôi kết nối người hiến máu với những người cần máu, mang lại hy vọng và sự sống.
                        </p>
                        <div className="flex space-x-3">
                            {/* Consider adding links to your actual social media pages */}
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <Facebook className="w-5 h-5 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" /> {/* Original: hover:text-blood-600 */}
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram className="w-5 h-5 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" /> {/* Original: hover:text-blood-600 */}
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">LIÊN KẾT</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-600 hover:text-red-600 transition-colors">Trang chủ</a></li> {/* Original: hover:text-blood-600 */}
                            <li><a href="/blood-information" className="text-gray-600 hover:text-red-600 transition-colors">Loại máu</a></li> {/* Example link */}
                            <li><a href="/donate-info" className="text-gray-600 hover:text-red-600 transition-colors">Đăng ký hiến máu</a></li> {/* Example link */}
                            <li><a href="/emergency-request" className="text-gray-600 hover:text-red-600 transition-colors">Đăng ký khẩn cấp</a></li> {/* Example link */}
                            <li><a href="/blog" className="text-gray-600 hover:text-red-600 transition-colors">Blog</a></li> {/* Example link */}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">HỖ TRỢ</h3>
                        <ul className="space-y-2">
                            <li><a href="/contact" className="text-gray-600 hover:text-red-600 transition-colors">Liên hệ</a></li> {/* Example link */}
                            <li><a href="/privacy-policy" className="text-gray-600 hover:text-red-600 transition-colors">Chính sách bảo mật</a></li> {/* Example link */}
                            <li><a href="/terms-of-service" className="text-gray-600 hover:text-red-600 transition-colors">Điều khoản sử dụng</a></li> {/* Example link */}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">LIÊN HỆ VỚI CHÚNG TÔI</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" /> {/* Original: text-blood-600 */}
                                <span className="text-gray-600 text-sm">TP. Hồ Chí Minh, Việt Nam</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-red-600" /> {/* Original: text-blood-600 */}
                                <a href="tel:+84912345678" className="text-gray-600 text-sm hover:text-red-600">+84 912345678</a>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-red-600" /> {/* Original: text-blood-600 */}
                                <a href="mailto:contact@fpt.edu.vn" className="text-gray-600 text-sm hover:text-red-600">contact@fpt.edu.vn</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} BloodConnect. Tất cả quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;