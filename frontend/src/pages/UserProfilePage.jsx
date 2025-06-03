// src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth'; //
import userService from '../services/userService'; //
import toast from 'react-hot-toast';
import { UserCircle, Edit3, Save, CalendarDays, Droplet, Mail, Phone, MapPin, ShieldCheck, AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar'; //
import Footer from '../components/layout/Footer'; //
import InputField from '../components/common/InputField'; //
import Button from '../components/common/Button'; //
import LoadingSpinner from '../components/common/LoadingSpinner'; //

const UserProfilePage = () => {
    const { user: authUser, updateUserContext, loading: authLoading } = useAuth(); //
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        latitude: '',
        longitude: '',
        emergencyContact: '',
        bloodTypeId: '',
        medicalConditions: '',
        lastDonationDate: '',
        isReadyToDonate: true,
    });
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchProfile = useCallback(async () => {
        if (!authUser) return;
        setIsLoading(true);
        try {
            const data = await userService.getCurrentUserProfile(); //
            setProfileData(data);
            // Backend UserResponse có bloodTypeDescription, cần ID để edit
            // Ta sẽ lấy bloodTypeId từ danh sách bloodTypes sau khi nó được fetch
            setFormData({
                fullName: data.fullName || '',
                phone: data.phone || '',
                dateOfBirth: data.dateOfBirth || '',
                gender: data.gender || '',
                address: data.address || '',
                latitude: data.latitude || '',
                longitude: data.longitude || '',
                emergencyContact: data.emergencyContact || '',
                bloodTypeId: '', // Sẽ được set sau khi bloodTypes được fetch
                medicalConditions: data.medicalConditions || '',
                lastDonationDate: data.lastDonationDate || '',
                isReadyToDonate: data.isReadyToDonate !== null ? data.isReadyToDonate : true,
            });
            const bloodTypesData = await userService.getBloodTypes(); //
            setBloodTypes(bloodTypesData || []); //

            // Tìm bloodTypeId tương ứng với bloodTypeDescription
            if (data.bloodTypeDescription && bloodTypesData) {
                const matchedBloodType = bloodTypesData.find(bt => `${bt.bloodGroup}${bt.rhFactor} (${bt.description})` === data.bloodTypeDescription || bt.description === data.bloodTypeDescription);
                if (matchedBloodType) {
                    setFormData(prev => ({ ...prev, bloodTypeId: matchedBloodType.id.toString() }));
                }
            }

        } catch (error) {
            toast.error("Lỗi khi tải thông tin cá nhân: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add validation if needed
        setIsSubmitting(true);
        const toastId = toast.loading("Đang cập nhật thông tin...");
        const updateData = {
            ...formData,
            bloodTypeId: formData.bloodTypeId ? parseInt(formData.bloodTypeId) : null,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        };
        if (!updateData.dateOfBirth) updateData.dateOfBirth = null;
        if (!updateData.lastDonationDate) updateData.lastDonationDate = null;

        try {
            const updatedUser = await userService.updateUserProfile(updateData); //
            setProfileData(updatedUser); // Cập nhật profileData hiển thị
            updateUserContext(updatedUser); // Cập nhật AuthContext
            toast.success("Cập nhật thông tin thành công!", { id: toastId });
            setIsEditing(false);
        } catch (error) {
            toast.error("Lỗi khi cập nhật: " + (error.message || "Vui lòng thử lại."), { id: toastId });
            if (error.response && error.response.data && typeof error.response.data === 'object') {
                setErrors(error.response.data);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || authLoading) {
        return (
            <>
                <Navbar />
                <div className="pt-16 flex justify-center items-center min-h-[calc(100vh-4rem)]"><LoadingSpinner size="12" /></div>
                <Footer />
            </>
        );
    }

    if (!authUser || !profileData) {
        return (
            <>
                <Navbar />
                <div className="pt-16 text-center py-20">
                    <p className="text-xl">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
                    <Link to="/login"><Button variant="primary" className="mt-4">Đăng nhập</Button></Link>
                </div>
                <Footer />
            </>
        );
    }

    const displayBloodType = profileData.bloodTypeDescription || "Chưa cập nhật";

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="pt-20 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <UserCircle size={48} className="text-red-600 mr-4" />
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{profileData.fullName}</h1>
                                <p className="text-gray-600">{profileData.email}</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} variant="outline">
                                <Edit3 size={16} className="mr-2" /> Chỉnh sửa hồ sơ
                            </Button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Form fields similar to AdminUserEditPage, but for user's own profile */}
                            <InputField label="Họ và tên đầy đủ" name="fullName" value={formData.fullName} onChange={handleInputChange} required disabled={isSubmitting} error={errors.fullName} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Số điện thoại" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} error={errors.phone} />
                                <InputField label="Ngày sinh" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} disabled={isSubmitting} error={errors.dateOfBirth} />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={isSubmitting} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </select>
                                {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                            </div>
                            <InputField label="Địa chỉ" name="address" type="textarea" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} error={errors.address} rows={2} />
                            {/* Latitude, Longitude có thể ẩn hoặc cho người dùng nâng cao */}
                            <InputField label="Liên hệ khẩn cấp" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} disabled={isSubmitting} error={errors.emergencyContact} />

                            <div>
                                <label htmlFor="bloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu</label>
                                <select name="bloodTypeId" value={formData.bloodTypeId} onChange={handleInputChange} disabled={isSubmitting || bloodTypes.length === 0} className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.bloodTypeId ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="">-- Chọn nhóm máu --</option>
                                    {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.bloodGroup}{bt.rhFactor} ({bt.description})</option>)}
                                </select>
                                {errors.bloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.bloodTypeId}</p>}
                            </div>
                            <InputField label="Tình trạng bệnh lý (nếu có)" name="medicalConditions" type="textarea" value={formData.medicalConditions} onChange={handleInputChange} disabled={isSubmitting} error={errors.medicalConditions} rows={2} />
                            <InputField label="Ngày hiến máu gần nhất" name="lastDonationDate" type="date" value={formData.lastDonationDate} onChange={handleInputChange} disabled={isSubmitting} error={errors.lastDonationDate} />
                            <div className="flex items-center">
                                <input name="isReadyToDonate" type="checkbox" checked={formData.isReadyToDonate} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                                <label htmlFor="isReadyToDonate" className="ml-2 block text-sm text-gray-900">Tôi sẵn sàng hiến máu</label>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); fetchProfile(); /* Reset form */ }} disabled={isSubmitting}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary" disabled={isSubmitting}>
                                    {isSubmitting ? <LoadingSpinner size="5" color="white" className="mr-2" /> : <Save size={18} className="mr-2" />}
                                    Lưu thay đổi
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <dl className="divide-y divide-gray-200">
                            <ProfileDetailItem icon={Mail} label="Email" value={profileData.email} />
                            <ProfileDetailItem icon={Phone} label="Điện thoại" value={profileData.phone} />
                            <ProfileDetailItem icon={CalendarDays} label="Ngày sinh" value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : null} />
                            <ProfileDetailItem icon={UserCircle} label="Giới tính" value={profileData.gender} />
                            <ProfileDetailItem icon={MapPin} label="Địa chỉ" value={profileData.address} />
                            <ProfileDetailItem icon={AlertTriangle} label="Liên hệ khẩn cấp" value={profileData.emergencyContact} />
                            <ProfileDetailItem icon={Droplet} label="Nhóm máu" value={displayBloodType} highlight={displayBloodType !== "Chưa cập nhật"} />
                            <ProfileDetailItem icon={ShieldCheck} label="Bệnh lý" value={profileData.medicalConditions} />
                            <ProfileDetailItem icon={CalendarDays} label="Hiến máu lần cuối" value={profileData.lastDonationDate ? new Date(profileData.lastDonationDate).toLocaleDateString() : null} />
                            <ProfileDetailItem
                                icon={profileData.isReadyToDonate ? CheckCircle : XCircle}
                                label="Sẵn sàng hiến máu"
                                value={profileData.isReadyToDonate ? "Có" : "Không"}
                                highlight={profileData.isReadyToDonate === true}
                            />
                        </dl>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

const ProfileDetailItem = ({ icon: Icon, label, value, highlight }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500 flex items-center">
            <Icon size={18} className="mr-2 text-red-500 flex-shrink-0" />
            {label}
        </dt>
        <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${highlight ? 'font-semibold text-red-600' : 'text-gray-800'}`}>
            {value || <span className="italic text-gray-400">Chưa cập nhật</span>}
        </dd>
    </div>
);


export default UserProfilePage;