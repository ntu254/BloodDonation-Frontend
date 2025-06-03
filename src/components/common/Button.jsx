// src/components/common/Button.jsx
import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary', // 'primary', 'secondary', 'danger', 'outline', 'icon', 'link'
    size = 'md', // 'sm', 'md', 'lg'
    className = '',
    disabled = false,
    isLoading = false, // Thêm prop isLoading
    iconLeft,
    iconRight,
    ...props
}) => {
    const baseStyle =
        'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const variantStyles = {
        primary: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
        secondary:
            'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300 border border-gray-300 disabled:bg-gray-50 disabled:text-gray-400',
        danger: 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300',
        outline:
            'text-red-600 bg-white border border-red-600 hover:bg-red-50 focus:ring-red-500 disabled:text-red-300 disabled:border-red-300 disabled:hover:bg-white',
        icon: 'p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 focus:ring-red-500 disabled:text-gray-300 disabled:hover:bg-transparent',
        link: 'text-red-600 hover:text-red-800 focus:ring-red-500 underline disabled:text-gray-400 disabled:no-underline',
    };

    const disabledStyle = 'opacity-60 cursor-not-allowed';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading} // Vô hiệu hóa nút khi đang tải
            className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled || isLoading ? disabledStyle : ''
                } ${className}`}
            {...props}
        >
            {isLoading && ( // Hiển thị spinner khi đang tải
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" // Điều chỉnh màu nếu cần
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {iconLeft && !isLoading && <span className="mr-2">{iconLeft}</span>}
            {children}
            {iconRight && !isLoading && <span className="ml-2">{iconRight}</span>}
        </button>
    );
};

export default Button;