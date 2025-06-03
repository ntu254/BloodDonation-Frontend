// src/pages/admin/AdminBloodCompatibilityPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, RefreshCw, Edit3, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import toast from 'react-hot-toast';
import bloodCompatibilityService from '../../services/bloodCompatibilityService'; //
import Button from '../../components/common/Button'; //
import LoadingSpinner from '../../components/common/LoadingSpinner'; //
import BloodCompatibilityFormModal from '../../components/admin/BloodCompatibilityFormModal'; // Import the modal

const AdminBloodCompatibilityPage = () => {
    const [rulesPage, setRulesPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [editingRule, setEditingRule] = useState(null); // State for rule being edited

    const fetchRules = useCallback(async (page = currentPage, size = pageSize) => {
        setIsLoading(true);
        try {
            const data = await bloodCompatibilityService.getAll(page, size); //
            setRulesPage(data);
        } catch (error) {
            toast.error(`Lỗi khi tải quy tắc tương thích: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]); // Dependency array includes fetchRules which has currentPage and pageSize

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // fetchRules will be called by useEffect due to currentPage change
    };
    const handleRefresh = () => {
        // If already on page 0, fetchRules might not re-trigger if currentPage doesn't change.
        // So, explicitly call fetchRules or ensure currentPage change logic handles this.
        if (currentPage === 0) {
            fetchRules(0, pageSize);
        } else {
            setCurrentPage(0); // This will trigger useEffect
        }
    };


    const handleOpenModal = (rule = null) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRule(null);
    };

    const handleSaveSuccess = () => {
        fetchRules(currentPage, pageSize); // Refresh current page
        handleCloseModal();
    };


    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa quy tắc tương thích (ID: ${id}) không?`)) {
            const toastId = toast.loading('Đang xóa...');
            try {
                await bloodCompatibilityService.delete(id); //
                toast.success('Xóa thành công!', { id: toastId });
                // If the deleted item was the last one on a page, and it's not the first page, go to previous page
                if (rulesPage && rulesPage.content.length === 1 && currentPage > 0) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchRules(currentPage, pageSize);
                }
            } catch (error) {
                toast.error(`Lỗi khi xóa: ${error.message}`, { id: toastId });
            }
        }
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Tương thích máu</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Button onClick={() => handleOpenModal()} variant="primary" disabled={isLoading}>
                        <PlusCircle size={20} className="mr-2" /> Thêm quy tắc
                    </Button>
                </div>
            </div>
            {isLoading && !rulesPage ? (
                <div className="flex justify-center items-center py-10">
                    <LoadingSpinner size="12" />
                </div>
            ) : rulesPage && rulesPage.content && rulesPage.content.length > 0 ? (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['ID', 'Người cho', 'Người nhận', 'Thành phần', 'Tương thích', 'Khẩn cấp', 'Điểm', 'Ghi chú', 'Hành động'].map(header => (
                                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rulesPage.content.map((rule) => ( //
                                    <tr key={rule.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{rule.id}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{rule.donorBloodType?.description || 'N/A'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{rule.recipientBloodType?.description || 'N/A'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{rule.bloodComponent?.name || 'Tất cả'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                            {rule.isCompatible ? <CheckCircle className="text-green-500 mx-auto" size={20} /> : <XCircle className="text-red-500 mx-auto" size={20} />}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                            {rule.isEmergencyCompatible ? <CheckCircle className="text-orange-500 mx-auto" size={20} /> : <XCircle className="text-gray-400 mx-auto" size={20} />}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{rule.compatibilityScore}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={rule.notes}>{rule.notes || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Button onClick={() => handleOpenModal(rule)} variant="icon" className="text-indigo-600 hover:text-indigo-800" title="Chỉnh sửa">
                                                <Edit3 size={18} />
                                            </Button>
                                            <Button onClick={() => handleDelete(rule.id)} variant="icon" className="text-red-600 hover:text-red-800" title="Xóa">
                                                <Trash2 size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {rulesPage.totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                            <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                                Trang <span className="font-medium">{rulesPage.number + 1}</span> / <span className="font-medium">{rulesPage.totalPages}</span> ({rulesPage.totalElements} quy tắc)
                            </div>
                            <div className="flex items-center space-x-1">
                                <Button onClick={() => handlePageChange(0)} disabled={rulesPage.first || isLoading} variant="outline" className="p-2">
                                    <ChevronsLeft size={18} />
                                </Button>
                                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={rulesPage.first || isLoading} variant="outline" className="p-2">
                                    <ChevronLeft size={18} />
                                </Button>
                                {[...Array(rulesPage.totalPages).keys()].map(pageNumber => {
                                    if (rulesPage.totalPages > 5 && (pageNumber < currentPage - 1 || pageNumber > currentPage + 1) && pageNumber !== 0 && pageNumber !== rulesPage.totalPages - 1) {
                                        if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) return <span key={pageNumber} className="px-3 py-2">...</span>;
                                        return null;
                                    }
                                    return (
                                        <Button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            disabled={isLoading}
                                            variant={currentPage === pageNumber ? 'primary' : 'outline'}
                                            className="p-2 min-w-[36px]"
                                        >
                                            {pageNumber + 1}
                                        </Button>
                                    );
                                })}
                                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={rulesPage.last || isLoading} variant="outline" className="p-2">
                                    <ChevronRight size={18} />
                                </Button>
                                <Button onClick={() => handlePageChange(rulesPage.totalPages - 1)} disabled={rulesPage.last || isLoading} variant="outline" className="p-2">
                                    <ChevronsRight size={18} />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 py-8">Chưa có quy tắc tương thích nào được định nghĩa.</p>
            )}
            {isModalOpen && (
                <BloodCompatibilityFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                    rule={editingRule}
                />
            )}
        </div>
    );
};

export default AdminBloodCompatibilityPage;