// src/pages/admin/AdminUserListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowDownUp } from 'lucide-react';
import toast from 'react-hot-toast';

import userService from '../../services/userService'; //
import UserManagementTable from '../../components/admin/UserManagementTable'; //
import LoadingSpinner from '../../components/common/LoadingSpinner'; //
import Button from '../../components/common/Button'; //

const AdminUserListPage = () => {
    const [usersPage, setUsersPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState(['id', 'asc']); // [field, direction]

    const fetchUsers = useCallback(async (page = currentPage, size = pageSize, currentSort = sort) => {
        setIsLoading(true);
        try {
            const data = await userService.getAllUsers(page, size, currentSort); //
            setUsersPage(data);
        } catch (error) {
            toast.error(`Lỗi khi tải danh sách người dùng: ${error.message}`);
            setUsersPage(null); // Hoặc giữ lại dữ liệu cũ tùy theo UX mong muốn
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, sort]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRefresh = () => {
        setCurrentPage(0); // Reset về trang đầu khi refresh
        fetchUsers(0, pageSize, sort);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchUsers(newPage, pageSize, sort);
    };

    const handleSort = (field) => {
        const direction = (sort[0] === field && sort[1] === 'asc') ? 'desc' : 'asc';
        setSort([field, direction]);
        setCurrentPage(0); // Reset về trang đầu khi sort
        fetchUsers(0, pageSize, [field, direction]);
    };

    const renderSortIcon = (field) => {
        if (sort[0] === field) {
            return sort[1] === 'asc' ? '▲' : '▼';
        }
        return <ArrowDownUp size={14} className="inline ml-1 opacity-40 group-hover:opacity-100" />;
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleRefresh} variant="secondary" className="p-2" title="Làm mới danh sách" disabled={isLoading}>
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </Button>
                    <Link to="/admin/users/new">
                        <Button variant="primary" disabled={isLoading}>
                            <PlusCircle size={20} className="mr-2" /> Thêm người dùng
                        </Button>
                    </Link>
                </div>
            </div>

            {isLoading && !usersPage ? (
                <div className="flex justify-center items-center py-10">
                    <LoadingSpinner size="12" />
                </div>
            ) : usersPage && usersPage.content ? (
                <>
                        <UserManagementTable 
                            users={usersPage.content}
                            onRefresh={handleRefresh} 
                            onSort={handleSort} 
                            currentSortField={sort[0]}
                            currentSortDirection={sort[1]} 
                            renderSortIcon={renderSortIcon} />
                    {/* Pagination Controls */}
                    {usersPage.totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                            <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                                Trang <span className="font-medium">{usersPage.number + 1}</span> / <span className="font-medium">{usersPage.totalPages}</span> ({usersPage.totalElements} người dùng)
                            </div>
                            <div className="flex items-center space-x-1">
                                <Button onClick={() => handlePageChange(0)} disabled={usersPage.first || isLoading} variant="outline" className="p-2">
                                    <ChevronsLeft size={18} />
                                </Button>
                                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={usersPage.first || isLoading} variant="outline" className="p-2">
                                    <ChevronLeft size={18} />
                                </Button>
                                {/* Hiển thị một vài trang */}
                                {[...Array(usersPage.totalPages).keys()].map(pageNumber => {
                                    // Logic để chỉ hiển thị một vài trang gần trang hiện tại nếu có nhiều trang
                                    if (usersPage.totalPages > 5 && (pageNumber < currentPage - 1 || pageNumber > currentPage + 1) && pageNumber !== 0 && pageNumber !== usersPage.totalPages - 1) {
                                        if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) return <span key={pageNumber} className="px-3 py-2">...</span>
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
                                    )
                                })}
                                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={usersPage.last || isLoading} variant="outline" className="p-2">
                                    <ChevronRight size={18} />
                                </Button>
                                <Button onClick={() => handlePageChange(usersPage.totalPages - 1)} disabled={usersPage.last || isLoading} variant="outline" className="p-2">
                                    <ChevronsRight size={18} />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500 py-8">Không thể tải dữ liệu người dùng hoặc không có người dùng nào.</p>
            )}
        </div>
    );
};

export default AdminUserListPage;