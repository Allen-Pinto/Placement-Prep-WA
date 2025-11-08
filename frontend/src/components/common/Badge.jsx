import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

/**
 * Badge Component
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-dark-card-hover text-dark-text',
    primary: 'bg-primary-500/20 text-primary-500',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={clsx('badge', variants[variant], sizes[size], className)}>
      {dot && (
        <span className="w-2 h-2 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
};

/**
 * Dropdown Component
 */
export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={clsx(
            'absolute top-full mt-2 min-w-[200px] bg-dark-card border border-dark-border rounded-xl shadow-lg py-2 z-50 animate-slide-up',
            alignments[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Dropdown Item
 */
Dropdown.Item = ({
  children,
  icon,
  onClick,
  variant = 'default',
  disabled = false,
}) => {
  const variants = {
    default: 'hover:bg-dark-card-hover text-white',
    danger: 'hover:bg-error/10 text-error',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
        variants[variant],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

/**
 * Dropdown Divider
 */
Dropdown.Divider = () => (
  <div className="my-2 border-t border-dark-border" />
);

export default { Badge, Dropdown };