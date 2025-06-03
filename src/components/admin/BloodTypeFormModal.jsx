// src/components/admin/BloodTypeFormModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import InputField from '../common/InputField';
import bloodTypeService from '../../services/bloodTypeService'; //
import toast from 'react-hot-toast';

const BloodTypeFormModal = ({ isOpen, onClose, onSaveSuccess, bloodType }) => {
    const [formData, setFormData] = useState({
        bloodGroup: '',
        rhFactor: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (bloodType) {
            setFormData({
                bloodGroup: bloodType.bloodGroup || '',
                rhFactor: bloodType.rhFactor || '',
                description: bloodType.description || '',
            });
        } else {
            setFormData({ bloodGroup: '', rhFactor: '', description: '' });
        }
        setErrors({}); // Reset errors khi modal mở hoặc bloodType thay đổi
    }, [bloodType, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.bloodGroup.trim()) newErrors.bloodGroup = "Nhóm máu không được để trống.";
        if (!formData.rhFactor.trim()) newErrors.rhFactor = "Yếu tố Rh không được để trống.";
        if (!formData.description.trim()) newErrors.description = "Mô tả không được để trống.";
        // Thêm validation khác nếu cần (ví dụ: bloodGroup phải là A, B, AB, O; rhFactor phải là +, -)
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
        const action = bloodType ? bloodTypeService.update : bloodTypeService.create;
        const toastId = toast.loading(bloodType ? 'Đang cập nhật...' : 'Đang tạo...');

        try {
            if (bloodType?.id) {
                // API update cho BloodType chỉ nhận { description } theo service hiện tại
                await action(bloodType.id, { description: formData.description });
            } else {
                // API create nhận { bloodGroup, rhFactor, description }
                await action(formData);
            }
            toast.success(bloodType ? 'Cập nhật thành công!' : 'Tạo thành công!', { id: toastId });
            onSaveSuccess(); // Gọi callback để refresh list và đóng modal
        } catch (error) {
            toast.error(`Lỗi: ${error.message}`, { id: toastId });
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
            <Button variant="primary" type="submit" form="bloodTypeForm" disabled={isLoading} isLoading={isLoading}>
                {bloodType ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={bloodType ? "Chỉnh sửa loại máu" : "Thêm loại máu mới"} footerContent={modalFooter}>
            <form id="bloodTypeForm" onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Nhóm máu (A, B, AB, O)"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    disabled={isLoading || !!bloodType} // Không cho sửa bloodGroup và rhFactor khi edit
                    error={errors.bloodGroup}
                />
                <InputField
                    label="Yếu tố Rh (+ hoặc -)"
                    name="rhFactor"
                    value={formData.rhFactor}
                    onChange={handleChange}
                    required
                    disabled={isLoading || !!bloodType} // Không cho sửa bloodGroup và rhFactor khi edit
                    error={errors.rhFactor}
                />
                <InputField
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    error={errors.description}
                    type="textarea"
                    rows={3}
                />
            </form>
        </Modal>
    );
};

export default BloodTypeFormModal;