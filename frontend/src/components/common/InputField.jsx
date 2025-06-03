// src/components/common/InputField.jsx
import React from 'react';

const InputField = ({
    id,
    name,
    type = 'text',
    label,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    className = '',
    labelClassName = '',
    inputClassName = '',
    errorClassName = '',
    hasIcon = false,
    icon,
    onIconClick,
    ...props
}) => {
    const baseInputStyle =
        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm';
    const errorInputStyle = 'border-red-500 focus:ring-red-500 focus:border-red-500';

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id || name} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    id={id || name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${baseInputStyle} ${error ? errorInputStyle : 'border-gray-300'} ${hasIcon ? 'pr-10' : ''} ${inputClassName}`}
                    {...props}
                />
                {hasIcon && icon && (
                    <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={onIconClick}
                    >
                        {icon}
                    </div>
                )}
            </div>
            {error && <p className={`mt-1 text-xs text-red-600 ${errorClassName}`}>{error}</p>}
        </div>
    );
};

export default InputField;