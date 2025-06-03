// src/pages/admin/AdminBloodComponentPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodComponentService from '../../services/bloodComponentService'; //
import Button from '../../components/common/Button'; //
import LoadingSpinner from '../../components/common/LoadingSpinner'; //
import BloodComponentFormModal from '../../components/admin/BloodComponentFormModal'; // Import the modal

const AdminBloodComponentPage = () => {
    const [components, setComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [editingComponent, setEditingComponent] = useState(null); // State for component being edited

    const fetchComponents = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await bloodComponentService.getAll(); //
            setComponents(data);
        } catch (error) {
            toast.error(`Lỗi khi tải các thành phần máu: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchComponents();
    }, [fetchComponents]);

    const handleOpenModal = (component = null) => {
        setEditingComponent(component);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingComponent(null);
    };

    const handleSaveSuccess = () => {
        fetchComponents();
        handleCloseModal();
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa thành phần máu "${name}" (ID: ${id}) không?`)) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodComponentService.delete(id); //
                toast.success('Xóa thành công!', { id: toastId });
                fetchComponents();
            } catch (error) {
                toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Thành phần máu</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={fetchComponents} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading}>
                        <PlusCircle size={20} className="mr-2" /> Thêm thành phần
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <LoadingSpinner size="12" />
                </div>
            ) : components.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có thành phần máu nào được định nghĩa.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['ID', 'Tên', 'Mô tả', 'Hạn dùng (ngày)', 'Lưu trữ (°C)', 'Thể tích (ml)', 'Hành động'].map(header => (
                                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {components.map((comp) => ( //
                                <tr key={comp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comp.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{comp.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={comp.description}>{comp.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{comp.shelfLifeDays}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                        {comp.storageTempMin !== null && comp.storageTempMax !== null ? `${comp.storageTempMin} - ${comp.storageTempMax}` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{comp.volumeMl || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Button onClick={() => handleOpenModal(comp)} variant="icon" className="text-indigo-600 hover:text-indigo-800" title="Chỉnh sửa">
                                            <Edit3 size={18} />
                                        </Button>
                                        <Button onClick={() => handleDelete(comp.id, comp.name)} variant="icon" className="text-red-600 hover:text-red-800" title="Xóa">
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
                <BloodComponentFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                    component={editingComponent}
                />
            )}
        </div>
    );
};

export default AdminBloodComponentPage;