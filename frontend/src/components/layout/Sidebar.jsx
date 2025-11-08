import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { ROUTES } from '../../utils/constants';

const navItems = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: 'Practice',
    path: ROUTES.PRACTICE,
    icon: Code,
  },
  {
    name: 'Interviews',
    path: ROUTES.INTERVIEWS,
    icon: Briefcase,
  },
  {
    name: 'Resume',
    path: ROUTES.RESUME,
    icon: FileText,
  },
  {
    name: 'Settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];

/**
 * Sidebar Navigation Component
 */
const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-full bg-dark-card border-r border-dark-border z-50 transition-transform duration-300',
          'w-64 lg:translate-x-0',
          isMobile && (isOpen ? 'translate-x-0' : '-translate-x-full')
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <span className="text-xl font-bold gradient-text">
              PrepSaaS
            </span>
          </div>

          {/* Close button (mobile only) */}
          {isMobile && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-dark-card-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'gradient-bg text-white shadow-glow-primary'
                    : 'text-dark-text hover:bg-dark-card-hover hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={clsx(
                      'w-5 h-5 transition-transform',
                      isActive && 'scale-110'
                    )}
                  />
                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
          <div className="card noPadding p-4 gradient-bg">
            <h4 className="font-semibold text-white mb-2">
              🚀 Upgrade to Pro
            </h4>
            <p className="text-sm text-white/80 mb-3">
              Unlock unlimited mock interviews and AI features
            </p>
            <button className="w-full px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;