import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

/**
 * Progress Bar Component
 */
export const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  gradient = true,
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      <div className={clsx('progress-bar', sizes[size])}>
        <div
          className={clsx(
            'progress-fill',
            !gradient && 'bg-primary-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-dark-text-muted mt-2 text-center">
          {value} / {max} ({Math.round(percentage)}%)
        </p>
      )}
    </div>
  );
};

/**
 * Progress Circle Component
 */
export const ProgressCircle = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  gradient = true,
  showLabel = true,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-dark-card"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={gradient ? "url(#gradient)" : "currentColor"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={!gradient && "text-primary-500"}
          style={{
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />

        {/* Gradient Definition */}
        {gradient && (
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f83f87" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        )}
      </svg>

      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-sm text-dark-text-muted mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Loader Component
 */
export const Loader = ({
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const loaderContent = (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-4',
      fullScreen && 'fixed inset-0 bg-dark-bg z-50',
      className
    )}>
      <Loader2 className={clsx(sizes[size], 'animate-spin text-primary-500')} />
      {text && (
        <p className="text-dark-text-muted text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  return loaderContent;
};

/**
 * Skeleton Loader
 */
export const Skeleton = ({
  width = '100%',
  height = '1rem',
  circle = false,
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'skeleton',
        circle ? 'rounded-full' : 'rounded-lg',
        className
      )}
      style={{ width, height }}
    />
  );
};

/**
 * Skeleton Text Lines
 */
export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

export default {
  ProgressBar,
  ProgressCircle,
  Loader,
  Skeleton,
  SkeletonText,
};