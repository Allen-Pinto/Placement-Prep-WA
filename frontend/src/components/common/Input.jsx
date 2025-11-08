import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

/**
 * Reusable Input Component
 * Supports text, email, password, number types with validation
 */
const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={clsx('w-full', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-dark-text mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-muted">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'input',
            leftIcon && 'pl-12',
            (rightIcon || type === 'password') && 'pr-12',
            error && 'border-error focus:border-error focus:ring-error/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          {...props}
        />

        {/* Right Icon / Password Toggle */}
        {type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-text-muted hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        ) : rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-text-muted">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error/Helper Text */}
      {(error || helperText) && (
        <p className={clsx(
          'mt-2 text-sm',
          error ? 'text-error' : 'text-dark-text-muted'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;