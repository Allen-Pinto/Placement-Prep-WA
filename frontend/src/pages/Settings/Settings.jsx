import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  Trash2,
  Save,
  LogOut,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    interviews: true,
    quizzes: true,
    achievements: false,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProfile(profileData);

    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }

    setIsLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    if (result.success) {
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      toast.error(result.error || 'Failed to change password');
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // In real app, would call API to delete account
    toast.success('Account deletion requested');
    setIsDeleteModalOpen(false);
    setTimeout(() => {
      handleLogout();
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-text-muted">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-card text-dark-text hover:bg-dark-card-hover'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">
                Profile Information
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  leftIcon={<User className="w-5 h-5" />}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  leftIcon={<Globe className="w-5 h-5" />}
                  required
                />

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    leftIcon={<Save className="w-5 h-5" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    helperText="Minimum 6 characters"
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    leftIcon={<Lock className="w-5 h-5" />}
                    required
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      leftIcon={<Save className="w-5 h-5" />}
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              </Card>

              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-dark-text-muted text-sm mb-4">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Active Sessions
                    </h3>
                    <p className="text-dark-text-muted text-sm mb-4">
                      Manage your active login sessions
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    View All
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">Email Notifications</h3>
                    <p className="text-sm text-dark-text-muted">
                      Receive updates via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          email: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-card-hover rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between pt-6 border-t border-dark-border">
                  <div>
                    <h3 className="font-medium text-white">Push Notifications</h3>
                    <p className="text-sm text-dark-text-muted">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          push: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-card-hover rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {/* Interview Reminders */}
                <div className="flex items-center justify-between pt-6 border-t border-dark-border">
                  <div>
                    <h3 className="font-medium text-white">Interview Reminders</h3>
                    <p className="text-sm text-dark-text-muted">
                      Get notified about upcoming interviews
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.interviews}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          interviews: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-card-hover rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                {/* Quiz Results */}
                <div className="flex items-center justify-between pt-6 border-t border-dark-border">
                  <div>
                    <h3 className="font-medium text-white">Quiz Results</h3>
                    <p className="text-sm text-dark-text-muted">
                      Get notified when quiz results are available
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.quizzes}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          quizzes: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-card-hover rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  variant="primary"
                  leftIcon={<Save className="w-5 h-5" />}
                  onClick={() => toast.success('Notification settings saved!')}
                >
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Appearance
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Theme
                    </label>
                    <select className="input">
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Language
                    </label>
                    <select className="input">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Privacy
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Profile Visibility</h3>
                      <p className="text-sm text-dark-text-muted">
                        Control who can see your profile
                      </p>
                    </div>
                    <select className="input w-32">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                    <div>
                      <h3 className="font-medium text-white">Show Statistics</h3>
                      <p className="text-sm text-dark-text-muted">
                        Display your practice statistics
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark-card-hover rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Danger Zone
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-error">Log Out</h3>
                      <p className="text-sm text-dark-text-muted">
                        Log out from your account
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<LogOut className="w-4 h-4" />}
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </div>

                  <div className="flex items-start justify-between pt-4 border-t border-dark-border">
                    <div>
                      <h3 className="font-medium text-error">Delete Account</h3>
                      <p className="text-sm text-dark-text-muted">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="!text-error hover:!bg-error/20"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <Modal.Confirm
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="primary"
      />
    </div>
  );
};

export default Settings;