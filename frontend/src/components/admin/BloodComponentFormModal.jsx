// src/components/admin/BloodComponentFormModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import bloodComponentService from '../../services/bloodComponentService';
import toast from 'react-hot-toast';

const BloodComponentFormModal = ({ isOpen, onClose, onSaveSuccess, component }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shelfLifeDays: '',
        storageTempMin: '',
        storageTempMax: '',
        volumeMl: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (component) {
            setFormData({
                name: component.name || '',
                description: component.description || '',
                shelfLifeDays: component.shelfLifeDays || '',
                storageTempMin: component.storageTempMin !== null ? component.storageTempMin : '',
                storageTempMax: component.storageTempMax !== null ? component.storageTempMax : '',
                volumeMl: component.volumeMl !== null ? component.volumeMl : '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                shelfLifeDays: '',
                storageTempMin: '',
                storageTempMax: '',
                volumeMl: '',
            });
        }
        setErrors({});
    }, [component, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Tên thành phần không được để trống.";
        if (!formData.description.trim()) newErrors.description = "Mô tả không được để trống.";
        if (formData.shelfLifeDays && (isNaN(formData.shelfLifeDays) || formData.shelfLifeDays <= 0)) newErrors.shelfLifeDays = "Hạn sử dụng phải là số dương.";
        // Add more specific validations as needed
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
        const action = component ? bloodComponentService.update : bloodComponentService.create;
        const toastId = toast.loading(component ? 'Đang cập nhật...' : 'Đang tạo...');

        const dataToSend = {
            ...formData,
            shelfLifeDays: formData.shelfLifeDays ? parseInt(formData.shelfLifeDays) : null,
            storageTempMin: formData.storageTempMin !== '' ? parseFloat(formData.storageTempMin) : null,
            storageTempMax: formData.storageTempMax !== '' ? parseFloat(formData.storageTempMax) : null,
            volumeMl: formData.volumeMl !== '' ? parseFloat(formData.volumeMl) : null,
        };

        try {
            if (component?.id) {
                await action(component.id, dataToSend);
            } else {
                await action(dataToSend);
            }
            toast.success(component ? 'Cập nhật thành công!' : 'Tạo thành công!', { id: toastId });
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
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>Hủy</Button>
            <Button variant="primary" type="submit" form="bloodComponentForm" disabled={isLoading} isLoading={isLoading}>
                {component ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={component ? "Chỉnh sửa thành phần máu" : "Thêm thành phần máu mới"} footerContent={modalFooter} size="lg">
            <form id="bloodComponentForm" onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Tên thành phần" name="name" value={formData.name} onChange={handleChange} required disabled={isLoading} error={errors.name} />
                <InputField label="Mô tả" name="description" type="textarea" rows={3} value={formData.description} onChange={handleChange} required disabled={isLoading} error={errors.description} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Hạn sử dụng (ngày)" name="shelfLifeDays" type="number" value={formData.shelfLifeDays} onChange={handleChange} disabled={isLoading} error={errors.shelfLifeDays} />
                    <InputField label="Thể tích (ml)" name="volumeMl" type="number" step="0.1" value={formData.volumeMl} onChange={handleChange} disabled={isLoading} error={errors.volumeMl} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Nhiệt độ bảo quản Min (°C)" name="storageTempMin" type="number" step="0.1" value={formData.storageTempMin} onChange={handleChange} disabled={isLoading} error={errors.storageTempMin} />
                    <InputField label="Nhiệt độ bảo quản Max (°C)" name="storageTempMax" type="number" step="0.1" value={formData.storageTempMax} onChange={handleChange} disabled={isLoading} error={errors.storageTempMax} />
                </div>
            </form>
        </Modal>
    );
};

export default BloodComponentFormModal;