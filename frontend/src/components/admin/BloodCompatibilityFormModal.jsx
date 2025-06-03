// src/components/admin/BloodCompatibilityFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import bloodCompatibilityService from '../../services/bloodCompatibilityService';
import bloodTypeService from '../../services/bloodTypeService';
import bloodComponentService from '../../services/bloodComponentService';
import toast from 'react-hot-toast';

const BloodCompatibilityFormModal = ({ isOpen, onClose, onSaveSuccess, rule }) => {
    const [formData, setFormData] = useState({
        donorBloodTypeId: '',
        recipientBloodTypeId: '',
        bloodComponentId: '', // Can be null for "Whole Blood" or general rule
        isCompatible: true,
        isEmergencyCompatible: false,
        compatibilityScore: '',
        notes: ''
    });
    const [bloodTypes, setBloodTypes] = useState([]);
    const [bloodComponents, setBloodComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchDropdownData = useCallback(async () => {
        setIsDataLoading(true);
        try {
            const [typesData, componentsData] = await Promise.all([
                bloodTypeService.getAll(),
                bloodComponentService.getAll()
            ]);
            setBloodTypes(typesData || []);
            setBloodComponents(componentsData || []);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu cho form: " + error.message);
        } finally {
            setIsDataLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
        }
    }, [isOpen, fetchDropdownData]);

    useEffect(() => {
        if (rule) {
            setFormData({
                donorBloodTypeId: rule.donorBloodType?.id || '',
                recipientBloodTypeId: rule.recipientBloodType?.id || '',
                bloodComponentId: rule.bloodComponent?.id || '',
                isCompatible: rule.isCompatible !== null ? rule.isCompatible : true,
                isEmergencyCompatible: rule.isEmergencyCompatible !== null ? rule.isEmergencyCompatible : false,
                compatibilityScore: rule.compatibilityScore !== null ? rule.compatibilityScore : '',
                notes: rule.notes || ''
            });
        } else {
            setFormData({
                donorBloodTypeId: '',
                recipientBloodTypeId: '',
                bloodComponentId: '',
                isCompatible: true,
                isEmergencyCompatible: false,
                compatibilityScore: '',
                notes: ''
            });
        }
        setErrors({});
    }, [rule, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.donorBloodTypeId) newErrors.donorBloodTypeId = "Nhóm máu người cho không được để trống.";
        if (!formData.recipientBloodTypeId) newErrors.recipientBloodTypeId = "Nhóm máu người nhận không được để trống.";
        if (formData.compatibilityScore === '' || isNaN(formData.compatibilityScore)) {
            newErrors.compatibilityScore = "Điểm tương thích phải là một số.";
        } else {
            const score = parseFloat(formData.compatibilityScore);
            if (score < -1 || score > 1) {
                newErrors.compatibilityScore = "Điểm tương thích phải từ -1 đến 1.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại các trường thông tin.");
            return;
        }
        setIsLoading(true);
        const action = rule ? bloodCompatibilityService.update : bloodCompatibilityService.create;
        const toastId = toast.loading(rule ? 'Đang cập nhật...' : 'Đang tạo...');

        const dataToSend = {
            donorBloodTypeId: parseInt(formData.donorBloodTypeId),
            recipientBloodTypeId: parseInt(formData.recipientBloodTypeId),
            bloodComponentId: formData.bloodComponentId ? parseInt(formData.bloodComponentId) : null,
            isCompatible: formData.isCompatible,
            isEmergencyCompatible: formData.isEmergencyCompatible,
            compatibilityScore: parseFloat(formData.compatibilityScore),
            notes: formData.notes.trim() || null
        };

        try {
            if (rule?.id) {
                await action(rule.id, dataToSend);
            } else {
                await action(dataToSend);
            }
            toast.success(rule ? 'Cập nhật thành công!' : 'Tạo thành công!', { id: toastId });
            onSaveSuccess();
        } catch (error) {
            toast.error(`Lỗi: ${error.message || 'Đã có lỗi xảy ra'}`, { id: toastId });
            if (error.response?.data && typeof error.response.data === 'object') {
                setErrors(prev => ({ ...prev, ...error.response.data }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const modalFooter = (
        <>
            <Button variant="secondary" onClick={onClose} disabled={isLoading || isDataLoading}>Hủy</Button>
            <Button variant="primary" type="submit" form="bloodCompatibilityForm" disabled={isLoading || isDataLoading} isLoading={isLoading}>
                {rule ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={rule ? "Chỉnh sửa quy tắc tương thích" : "Thêm quy tắc tương thích máu"} footerContent={modalFooter} size="lg">
            {isDataLoading ? <div className="flex justify-center items-center p-8"><p>Đang tải dữ liệu loại máu và thành phần...</p></div> : (
                <form id="bloodCompatibilityForm" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="donorBloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu người cho {<span className="text-red-500">*</span>}</label>
                            <select name="donorBloodTypeId" id="donorBloodTypeId" value={formData.donorBloodTypeId} onChange={handleChange} disabled={isLoading} required
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.donorBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">-- Chọn nhóm máu --</option>
                                {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.description}</option>)}
                            </select>
                            {errors.donorBloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.donorBloodTypeId}</p>}
                        </div>
                        <div>
                            <label htmlFor="recipientBloodTypeId" className="block text-sm font-medium text-gray-700 mb-1">Nhóm máu người nhận {<span className="text-red-500">*</span>}</label>
                            <select name="recipientBloodTypeId" id="recipientBloodTypeId" value={formData.recipientBloodTypeId} onChange={handleChange} disabled={isLoading} required
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.recipientBloodTypeId ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">-- Chọn nhóm máu --</option>
                                {bloodTypes.map(bt => <option key={bt.id} value={bt.id}>{bt.description}</option>)}
                            </select>
                            {errors.recipientBloodTypeId && <p className="mt-1 text-xs text-red-600">{errors.recipientBloodTypeId}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="bloodComponentId" className="block text-sm font-medium text-gray-700 mb-1">Thành phần máu (Tùy chọn)</label>
                        <select name="bloodComponentId" id="bloodComponentId" value={formData.bloodComponentId} onChange={handleChange} disabled={isLoading}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${errors.bloodComponentId ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">-- Áp dụng cho tất cả/Máu toàn phần --</option>
                            {bloodComponents.map(bc => <option key={bc.id} value={bc.id}>{bc.name}</option>)}
                        </select>
                        {errors.bloodComponentId && <p className="mt-1 text-xs text-red-600">{errors.bloodComponentId}</p>}
                    </div>

                    <InputField label="Điểm tương thích (-1 đến 1)" name="compatibilityScore" type="number" step="0.1" value={formData.compatibilityScore} onChange={handleChange} required disabled={isLoading} error={errors.compatibilityScore} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center mt-2">
                            <input id="isCompatible" name="isCompatible" type="checkbox" checked={formData.isCompatible} onChange={handleChange} disabled={isLoading} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                            <label htmlFor="isCompatible" className="ml-2 block text-sm text-gray-900">Tương thích</label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input id="isEmergencyCompatible" name="isEmergencyCompatible" type="checkbox" checked={formData.isEmergencyCompatible} onChange={handleChange} disabled={isLoading} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                            <label htmlFor="isEmergencyCompatible" className="ml-2 block text-sm text-gray-900">Tương thích khẩn cấp</label>
                        </div>
                    </div>
                    <InputField label="Ghi chú (Tùy chọn)" name="notes" type="textarea" rows={2} value={formData.notes} onChange={handleChange} disabled={isLoading} error={errors.notes} />
                </form>
            )}
        </Modal>
    );
};

export default BloodCompatibilityFormModal;