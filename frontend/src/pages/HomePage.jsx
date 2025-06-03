// src/pages/HomePage.jsx
import React from 'react';
import { Heart, Users, MapPin, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar'; //
import Footer from '../components/layout/Footer'; //

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Thêm pt-16 cho main content để không bị Navbar che */}
            <main className="pt-16">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                                Kết nối yêu thương, <br />
                                <span className="text-red-600">Chia sẻ sự sống</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                BloodConnect là nền tảng kết nối người hiến máu tình nguyện với những người đang cần máu,
                                góp phần lan tỏa giá trị nhân ái và mang lại hy vọng cho cộng đồng.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/register"
                                    className="bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    Tham gia ngay
                                </Link>
                                <Link
                                    to="/about-donation" // Hoặc một trang thông tin về hiến máu
                                    className="bg-white text-red-600 px-8 py-3.5 rounded-lg hover:bg-red-50 transition-colors font-semibold text-lg border border-red-600 shadow-md hover:shadow-lg"
                                >
                                    Tìm hiểu thêm
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 lg:py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Tại sao chọn BloodConnect?
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Chúng tôi cung cấp một nền tảng an toàn, minh bạch và tiện lợi để kết nối cộng đồng hiến máu.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Heart, title: "Hiến máu dễ dàng", desc: "Đăng ký và đặt lịch hiến máu chỉ với vài thao tác đơn giản." },
                                { icon: Users, title: "Cộng đồng lớn mạnh", desc: "Kết nối với hàng ngàn người hiến máu tình nguyện trên cả nước." },
                                { icon: MapPin, title: "Tìm kiếm nhanh chóng", desc: "Dễ dàng tìm kiếm các địa điểm hiến máu hoặc người cần máu gần bạn." },
                                { icon: Shield, title: "An toàn & Bảo mật", desc: "Thông tin cá nhân của bạn được bảo vệ và bảo mật tuyệt đối." }
                            ].map(feature => (
                                <div key={feature.title} className="bg-white p-6 rounded-lg shadow-lg text-center group hover:shadow-xl transition-shadow">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-red-200 transition-colors">
                                        <feature.icon className="w-8 h-8 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-red-600 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                                { stat: "10,000+", label: "Người hiến máu" },
                                { stat: "5,000+", label: "Lượt hiến máu thành công" },
                                { stat: "50+", label: "Bệnh viện & Đối tác" }
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{item.stat}</div>
                                    <div className="text-red-100 text-lg">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 lg:py-24">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
                            Sẵn sàng sẻ chia giọt máu, cứu sống một cuộc đời?
                        </h2>
                        <p className="text-gray-600 mb-10 text-lg">
                            Tham gia cộng đồng BloodConnect ngay hôm nay và trở thành một phần của những điều kỳ diệu,
                            mang lại hy vọng và sự sống cho những người cần giúp đỡ.
                        </p>
                        <Link
                            to="/register"
                            className="bg-red-600 text-white px-10 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg inline-flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            Đăng ký hiến máu
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;