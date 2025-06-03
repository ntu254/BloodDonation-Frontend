// src/components/common/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footerContent, size = 'md' }) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-600 bg-opacity-50 transition-opacity duration-300 ease-in-out" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay, show/hide based on modal state. */}
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* Modal panel, show/hide based on modal state. */}
                <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${sizes[size]} duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear`}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        {title}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="mt-2">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                    {footerContent && (
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            {footerContent}
                        </div>
                    )}
                </div>
            </div>
            {/* Tailwind animation (cần thêm vào tailwind.config.js)
        @keyframes modal-appear {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-appear {
            animation: modal-appear 0.3s ease-out forwards;
        }
      */}
        </div>
    );
};

export default Modal;