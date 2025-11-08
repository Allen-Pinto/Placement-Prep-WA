import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { ProgressCircle } from '../../components/common/Progress';
import { useAuthStore } from '../../store/authStore';
import { interviewApi } from '../../api/interviewApi';
import { quizApi } from '../../api/quizApi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    linkedin: '',
  });
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    totalQuizzes: 0,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        linkedin: user.linkedin || '',
      });
    }
    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch interviews
      const { data: interviewData } = await interviewApi.getAllInterviews();
      const interviews = interviewData?.interviews || [];
      
      // Fetch quiz attempts
      const { data: attemptsData } = await quizApi.getUserAttempts({ limit: 50 });
      const attempts = attemptsData?.attempts || [];

      const completedInterviews = interviews.filter(i => 
        ['completed', 'passed', 'failed'].includes(i.status)
      ).length;

      const averageScore = attempts.length > 0 
        ? attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / attempts.length
        : 0;

      setStats({
        totalInterviews: interviews.length,
        completedInterviews,
        averageScore: Math.round(averageScore),
        totalQuizzes: attempts.length,
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateProfile(profileData);

    if (result.success) {
      setIsEditing(false);
    } else {
      toast.error(result.error || 'Failed to update profile');
    }

    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      phone: user.phone || '',
      linkedin: user.linkedin || '',
    });
    setIsEditing(false);
  };

  const getExperienceLevel = () => {
    if (stats.totalInterviews >= 10) return 'Expert';
    if (stats.totalInterviews >= 5) return 'Intermediate';
    return 'Beginner';
  };

  const getLevelColor = () => {
    const level = getExperienceLevel();
    switch (level) {
      case 'Expert': return 'success';
      case 'Intermediate': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-dark-text-muted">
            Manage your personal information and track your progress
          </p>
        </div>
        {!isEditing ? (
          <Button
            variant="primary"
            leftIcon={<Edit3 className="w-5 h-5" />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<X className="w-5 h-5" />}
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<Save className="w-5 h-5" />}
              onClick={handleSaveProfile}
              isLoading={isLoading}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              
              {/* Name & Level */}
              <h2 className="text-xl font-bold text-white mb-2">
                {user?.name || 'User'}
              </h2>
              <Badge variant={getLevelColor()} className="mb-4">
                {getExperienceLevel()} Level
              </Badge>

              {/* Member Since */}
              <div className="flex items-center justify-center gap-2 text-dark-text-muted text-sm">
                <Calendar className="w-4 h-4" />
                Member since {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-dark-text-muted">Interviews</span>
                <span className="font-semibold text-white">{stats.totalInterviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-text-muted">Completed</span>
                <span className="font-semibold text-white">{stats.completedInterviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-text-muted">Quiz Attempts</span>
                <span className="font-semibold text-white">{stats.totalQuizzes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-text-muted">Avg Score</span>
                <span className="font-semibold text-white">{stats.averageScore}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Profile Form & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">
              Profile Information
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="John Doe"
                  leftIcon={<User className="w-5 h-5" />}
                  disabled={!isEditing}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="john@example.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  disabled={!isEditing}
                  required
                />
              </div>

              <Input
                label="Bio"
                type="textarea"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                disabled={!isEditing}
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="City, Country"
                  disabled={!isEditing}
                />

                <Input
                  label="Phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  disabled={!isEditing}
                />
              </div>

              <Input
                label="LinkedIn"
                type="url"
                value={profileData.linkedin}
                onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                disabled={!isEditing}
              />
            </form>
          </Card>

          {/* Progress Overview */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-6">
              Progress Overview
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interview Progress */}
              <div className="text-center">
                <ProgressCircle
                  value={stats.totalInterviews > 0 ? (stats.completedInterviews / stats.totalInterviews) * 100 : 0}
                  max={100}
                  size={120}
                  label="Completion"
                  className="mb-4 mx-auto"
                />
                <h4 className="font-semibold text-white mb-2">Interviews</h4>
                <p className="text-dark-text-muted text-sm">
                  {stats.completedInterviews} of {stats.totalInterviews} completed
                </p>
              </div>

              {/* Quiz Performance */}
              <div className="text-center">
                <ProgressCircle
                  value={stats.averageScore}
                  max={100}
                  size={120}
                  label="Avg Score"
                  className="mb-4 mx-auto"
                />
                <h4 className="font-semibold text-white mb-2">Quizzes</h4>
                <p className="text-dark-text-muted text-sm">
                  {stats.totalQuizzes} attempts • {stats.averageScore}% average
                </p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-dark-card-hover rounded-xl">
                <Award className="w-5 h-5 text-success" />
                <div className="flex-1">
                  <p className="text-white text-sm">Completed JavaScript Fundamentals quiz</p>
                  <p className="text-dark-text-muted text-xs">Score: 85% • 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-dark-card-hover rounded-xl">
                <TrendingUp className="w-5 h-5 text-warning" />
                <div className="flex-1">
                  <p className="text-white text-sm">Scheduled interview with Google</p>
                  <p className="text-dark-text-muted text-xs">Dec 15, 2024 • Software Engineer</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;