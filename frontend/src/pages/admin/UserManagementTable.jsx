// src/components/admin/UserManagementTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../../services/userService'; //

const UserManagementTable = ({ users, onEdit, onDelete, onRefresh }) => {

    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa người dùng "${userName}" (ID: ${userId}) không? Hành động này sẽ chuyển trạng thái của họ thành "Suspended".`)) {
            const toastId = toast.loading(`Đang vô hiệu hóa người dùng ${userName}...`);
            try {
                await userService.softDeleteUserByAdmin(userId); //
                toast.success(`Người dùng ${userName} đã được vô hiệu hóa.`, { id: toastId });
                if (onRefresh) onRefresh(); // Gọi hàm callback để làm mới danh sách
            } catch (error) {
                toast.error(`Lỗi khi vô hiệu hóa người dùng: ${error.message}`, { id: toastId });
            }
        }
    };


    if (!users || users.length === 0) {
        return <p className="text-center text-gray-500 py-8">Không có dữ liệu người dùng.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {['ID', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Hành động'].map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                                        user.role === 'Staff' ? 'bg-yellow-100 text-yellow-800' :
                                            user.role === 'Member' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Link to={`/admin/users/view/${user.id}`} className="text-blue-600 hover:text-blue-800" title="Xem chi tiết">
                                    <Eye size={18} />
                                </Link>
                                <Link to={`/admin/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-800" title="Chỉnh sửa">
                                    <Edit3 size={18} />
                                </Link>
                                {/* Chỉ cho phép xóa nếu người dùng không phải là Admin và status là Active */}
                                {user.role !== 'Admin' && user.status === 'Active' && (
                                    <button
                                        onClick={() => handleDelete(user.id, user.fullName)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Vô hiệu hóa"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagementTable;