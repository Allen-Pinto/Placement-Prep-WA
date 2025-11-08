import React from 'react';
import clsx from 'clsx';

/**
 * Base container for content with various styles
 */
const Card = ({
  children,
  title,
  subtitle,
  icon,
  headerAction,
  hover = false,
  noPadding = false,
  gradient = false,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-2xl border border-dark-border transition-all duration-200',
        hover ? 'card-hover' : 'bg-dark-card',
        !noPadding && 'p-6',
        gradient && 'gradient-bg',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Card Header */}
      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-12 h-12 rounded-xl bg-dark-card-hover flex items-center justify-center text-2xl">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-dark-text-muted mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      )}

      {/* Card Content */}
      {children}
    </div>
  );
};

/**
 * Card.Grid - Grid layout for cards
 */
Card.Grid = ({ children, cols = 3, gap = 6, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={clsx('grid', gridCols[cols], `gap-${gap}`, className)}>
      {children}
    </div>
  );
};

/**
 * Card.Stats - Stats card variant
 */
Card.Stats = ({ title, value, icon, trend, trendLabel, gradient = false }) => {
  return (
    <Card gradient={gradient}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-text-muted text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span className={clsx(
                'text-sm font-medium',
                trend > 0 ? 'text-success' : 'text-error'
              )}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-sm text-dark-text-muted">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-dark-card-hover flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;