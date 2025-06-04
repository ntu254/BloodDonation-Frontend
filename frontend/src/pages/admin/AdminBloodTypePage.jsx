// src/pages/admin/AdminBloodTypePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodTypeService from '../../services/bloodTypeService'; //
import Button from '../../components/common/Button'; //
import LoadingSpinner from '../../components/common/LoadingSpinner'; //
import BloodTypeFormModal from '../../components/admin/BloodTypeFormModal'; // Import the modal

const AdminBloodTypePage = () => {
    const [bloodTypes, setBloodTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [editingBloodType, setEditingBloodType] = useState(null); // State for blood type being edited

    const fetchBloodTypes = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await bloodTypeService.getAll(); //
            setBloodTypes(data);
        } catch (error) {
            toast.error(`Lỗi khi tải danh sách loại máu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBloodTypes();
    }, [fetchBloodTypes]);

    const handleOpenModal = (bloodType = null) => {
        setEditingBloodType(bloodType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBloodType(null);
    };

    const handleSaveSuccess = () => {
        fetchBloodTypes();
        handleCloseModal();
    };

    const handleDelete = async (id, description) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa loại máu "${description}" (ID: ${id}) không?`)) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodTypeService.delete(id); // Gọi service
                toast.success('Xóa thành công (MSW)!', { id: toastId });
                fetchBloodTypes(); 
            } catch (error) {
                // MSW handler có thể trả về lỗi 404 nếu không tìm thấy
                if (error.response && error.response.status === 404) {
                    toast.error(`Lỗi khi xóa: Không tìm thấy loại máu (MSW).`, { id: toastId });
                } else {
                    toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
                }
            }
        }
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Loại máu</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={fetchBloodTypes} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading}>
                        <PlusCircle size={20} className="mr-2" /> Thêm loại máu
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <LoadingSpinner size="12" />
                </div>
            ) : bloodTypes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có loại máu nào được định nghĩa.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['ID', 'Nhóm', 'Rh', 'Mô tả', 'Ngày tạo', 'Hành động'].map(header => (
                                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bloodTypes.map((bt) => ( //
                                <tr key={bt.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bt.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bt.bloodGroup}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bt.rhFactor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bt.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(bt.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Button onClick={() => handleOpenModal(bt)} variant="icon" className="text-indigo-600 hover:text-indigo-800" title="Chỉnh sửa">
                                            <Edit3 size={18} />
                                        </Button>
                                        <Button onClick={() => handleDelete(bt.id, bt.description)} variant="icon" className="text-red-600 hover:text-red-800" title="Xóa">
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && (
                <BloodTypeFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess} // Use the new handler
                    bloodType={editingBloodType}
                />
            )}
        </div>
    );
};

export default AdminBloodTypePage;