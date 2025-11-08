import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut, User, Menu } from 'lucide-react';
import { Dropdown } from '../common/Badge';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../utils/helpers';

/**
 * Main Navigation Bar Component
 */
const Navbar = ({ onMenuClick, showMenuButton = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-dark-card transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">
                PrepSaaS
              </span>
            </Link>
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
              <input
                type="text"
                placeholder="Search companies, roles..."
                className="w-full pl-12 pr-4 py-2 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-dark-text-muted focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search Icon (Mobile) */}
            <button className="md:hidden p-2 rounded-lg hover:bg-dark-card transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <Dropdown
              align="right"
              trigger={
                <button className="relative p-2 rounded-lg hover:bg-dark-card transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
                </button>
              }
            >
              <div className="px-4 py-3 border-b border-dark-border">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <Dropdown.Item >
                  No notification available
                </Dropdown.Item>
              </div>
              <div className="px-4 py-2 border-t border-dark-border">
                <button className="text-sm text-primary-500 hover:underline">
                  View all notifications
                </button>
              </div>
            </Dropdown>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-dark-card transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Profile Dropdown */}
            <Dropdown
              align="right"
              trigger={
                <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-dark-card transition-colors">
                  <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-sm font-semibold">
                    {getInitials(user?.name || 'User')}
                  </div>
                  <span className="hidden sm:block font-medium">
                    {user?.name || 'User'}
                  </span>
                </button>
              }
            >
              <div className="px-4 py-3 border-b border-dark-border">
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-dark-text-muted">{user?.email}</p>
              </div>

              <Dropdown.Item
                icon={<User className="w-4 h-4" />}
                onClick={() => navigate('/profile')}
              >
                Profile
              </Dropdown.Item>

              <Dropdown.Item
                icon={<Settings className="w-4 h-4" />}
                onClick={() => navigate('/settings')}
              >
                Settings
              </Dropdown.Item>

              <Dropdown.Divider />

              <Dropdown.Item
                icon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
                variant="danger"
              >
                Logout
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;