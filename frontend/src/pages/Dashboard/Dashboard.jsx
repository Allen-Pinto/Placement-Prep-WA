import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  Target,
  Plus,
  ChevronRight,
  Clock,
  Award,
  BarChart3,
  Users,
  FileText,
  PlayCircle,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ProgressCircle, Loader } from '../../components/common/Progress';
import { Badge } from '../../components/common/Badge';
import { useAuthStore } from '../../store/authStore';
import { interviewApi } from '../../api/interviewApi';
import { quizApi } from '../../api/quizApi';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    interviews: [],
    recentAttempts: [],
    stats: {
      totalInterviews: 0,
      upcomingInterviews: 0,
      averageScore: 0,
      progress: 0,
      totalQuizzes: 0,
    },
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch interviews
        const { data: interviewData, error: interviewError } = await interviewApi.getAllInterviews({});
        
        if (interviewError) {
          console.error('Error fetching interviews:', interviewError);
        }

        // Fetch recent quiz attempts
        let attemptsData = { attempts: [] };
        let quizzesData = { quizzes: [] };
        try {
          const [attemptsResult, quizzesResult] = await Promise.all([
            quizApi.getUserAttempts({ limit: 3 }),
            quizApi.getQuizzes({ limit: 5 })
          ]);
          
          if (attemptsResult && !attemptsResult.error) {
            attemptsData = attemptsResult;
          }
          if (quizzesResult && !quizzesResult.error) {
            quizzesData = quizzesResult;
          }
        } catch (quizError) {
          console.log('Quiz data not available yet:', quizError);
        }

        // Calculate stats from real data
        const interviews = interviewData?.interviews || [];
        const attempts = attemptsData?.attempts || [];
        const quizzes = quizzesData?.quizzes || [];
        
        // Find upcoming interviews (scheduled and in future)
        const upcomingInterviews = interviews.filter(i => 
          i.status === 'scheduled' && new Date(i.date) > new Date()
        );

        // Calculate average score from attempts
        const averageScore = attempts.length > 0 
          ? attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / attempts.length
          : 0;

        // Calculate progress based on multiple factors
        const completedInterviews = interviews.filter(i => 
          ['completed', 'passed', 'failed'].includes(i.status)
        ).length;

        const interviewCompletion = interviews.length > 0 ? (completedInterviews / interviews.length) * 40 : 0;
        const quizPerformance = attempts.length > 0 ? (averageScore / 100) * 40 : 0;
        const activityBonus = (attempts.length > 0 ? 10 : 0) + (interviews.length > 0 ? 10 : 0);
        
        const progress = Math.min(interviewCompletion + quizPerformance + activityBonus, 100);

        const stats = {
          totalInterviews: interviews.length,
          upcomingInterviews: upcomingInterviews.length,
          averageScore: Math.round(averageScore),
          progress: Math.round(progress),
          totalQuizzes: quizzes.length,
        };

        setDashboardData({
          interviews: interviews.slice(0, 3), // Latest 3
          recentAttempts: attempts.slice(0, 3), // Latest 3 attempts
          stats,
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (!error.message?.includes('quiz') && !error.message?.includes('attempt')) {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'pending':
        return 'warning';
      case 'completed':
      case 'passed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getScoreVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  // Navigation handlers with CORRECT routes from your router
  const handleStartPractice = () => {
    navigate('/practice'); // Use existing practice route
  };

  const handleViewResults = (attemptId) => {
    navigate(`/results/${attemptId}`); // Use existing results route
  };

  const handleContinuePractice = () => {
    navigate('/practice');
  };

  const handleViewAnalytics = () => {
    // Since we don't have analytics page, show interviews which has stats
    navigate('/interviews');
  };

  if (isLoading) {
    return <Loader fullScreen text="Loading dashboard..." />;
  }

  const { interviews, recentAttempts, stats } = dashboardData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-dark-text-muted">
          Track your interview preparation journey
        </p>
      </div>

      {/* Stats Cards - Updated with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card.Stats
          title="Total Interviews"
          value={stats.totalInterviews}
          icon={<Users className="w-6 h-6 text-primary-500" />}
          trend={stats.totalInterviews > 0 ? 20 : 0}
          trendLabel="this month"
          description="Interviews tracked"
        />

        <Card.Stats
          title="Upcoming"
          value={stats.upcomingInterviews}
          icon={<Calendar className="w-6 h-6 text-info" />}
          description="Interviews scheduled"
        />

        <Card.Stats
          title="Quiz Score"
          value={`${stats.averageScore}%`}
          icon={<Award className="w-6 h-6 text-success" />}
          trend={stats.averageScore > 70 ? 12 : 0}
          trendLabel="average"
          description="Performance"
        />

        <Card.Stats
          title="Progress"
          value={`${stats.progress}%`}
          icon={<Target className="w-6 h-6 text-warning" />}
          description="Overall completion"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Interviews & Quiz Attempts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Interviews Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Recent Interviews</h2>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => navigate('/interviews')}
              >
                Add Interview
              </Button>
            </div>

            {interviews.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-dark-text-muted mx-auto mb-4" />
                  <p className="text-dark-text-muted mb-4">
                    No interviews yet. Track your first interview!
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/interviews')}
                  >
                    Add Interview
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <Card
                    key={interview._id}
                    hover
                    onClick={() => navigate(`/interviews/${interview._id}`)}
                    className="cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {interview.role}
                          </h3>
                          <Badge variant={getStatusVariant(interview.status)}>
                            {interview.status}
                          </Badge>
                        </div>

                        <p className="text-dark-text-muted mb-3">
                          {interview.company} • {interview.location || 'Remote'}
                        </p>

                        {interview.topicsRequired && interview.topicsRequired.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {interview.topicsRequired.slice(0, 3).map((topic) => (
                              <Badge key={topic} variant="default" size="sm">
                                {topic}
                              </Badge>
                            ))}
                            {interview.topicsRequired.length > 3 && (
                              <Badge variant="default" size="sm">
                                +{interview.topicsRequired.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-dark-text-muted">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(interview.date)}
                          </span>
                          {interview.package?.amount > 0 && (
                            <span>
                              💰 ${interview.package.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-dark-text-muted shrink-0 mt-2" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {interviews.length > 0 && (
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate('/interviews')}
              >
                View All Interviews ({interviews.length})
              </Button>
            )}
          </div>

          {/* Recent Quiz Attempts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Recent Quiz Attempts</h2>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlayCircle className="w-4 h-4" />}
                onClick={handleStartPractice}
              >
                Take Quiz
              </Button>
            </div>

            {recentAttempts.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-dark-text-muted mx-auto mb-4" />
                  <p className="text-dark-text-muted mb-4">
                    No quiz attempts yet. Start practicing!
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleStartPractice}
                  >
                    Take First Quiz
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <Card 
                    key={attempt._id} 
                    hover
                    onClick={() => handleViewResults(attempt._id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">
                            {attempt.quiz?.title || 'Quiz Attempt'}
                          </h4>
                          {attempt.quiz?.difficulty && (
                            <Badge variant={getDifficultyVariant(attempt.quiz.difficulty)} size="sm">
                              {attempt.quiz.difficulty}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-dark-text-muted">
                          <span>{getRelativeTime(attempt.createdAt)}</span>
                          {attempt.totalTimeSpent && (
                            <span>⏱️ {Math.round(attempt.totalTimeSpent / 60)}m</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getScoreVariant(attempt.percentage)}>
                          {attempt.percentage}%
                        </Badge>
                        <p className="text-xs text-dark-text-muted mt-1">
                          Score
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {recentAttempts.length > 0 && (
              <Button
                variant="ghost"
                fullWidth
                onClick={handleStartPractice}
              >
                View All Attempts
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Progress & Actions */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Progress
              </h3>
              <ProgressCircle
                value={stats.progress}
                max={100}
                size={150}
                label="Complete"
                className="mb-4 mx-auto"
              />
              <p className="text-dark-text-muted text-sm mb-4">
                {stats.progress >= 80 
                  ? "Excellent progress! Keep it up! 🎉" 
                  : stats.progress >= 60 
                  ? "Good progress! You're getting there! 💪"
                  : "Getting started! Every step counts! 🌟"
                }
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={handleContinuePractice}
              >
                {recentAttempts.length > 0 ? "Continue Practice" : "Start Practicing"}
              </Button>
            </div>
          </Card>

          {/* Quick Actions - Fixed with CORRECT routes */}
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<PlayCircle className="w-5 h-5" />}
                onClick={() => navigate('/practice')}
              >
                Practice Quizzes
              </Button>
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<Calendar className="w-5 h-5" />}
                onClick={() => navigate('/interviews')}
              >
                Manage Interviews
              </Button>
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<FileText className="w-5 h-5" />}
                onClick={() => navigate('/resume')}
              >
                Resume Builder
              </Button>
              <Button
                variant="secondary"
                fullWidth
                leftIcon={<BarChart3 className="w-5 h-5" />}
                onClick={() => navigate('/profile')}
              >
                My Profile
              </Button>
            </div>
          </Card>

          {/* Daily Tip Card - Dynamic tips */}
          <Card gradient>
            <h3 className="text-lg font-semibold text-white mb-2">
              💡 Preparation Tip
            </h3>
            <p className="text-white/90 text-sm">
              {stats.totalInterviews === 0 && recentAttempts.length === 0
                ? "Start by taking a practice quiz to assess your current level and identify areas for improvement!"
                : stats.totalInterviews === 0
                ? "Track your interviews to monitor your application progress and prepare systematically!"
                : recentAttempts.length === 0
                ? "Combine interview tracking with regular practice quizzes for comprehensive preparation!"
                : stats.averageScore < 70
                ? "Focus on your weaker topics identified in recent quiz attempts to improve your scores!"
                : "Great job! Consider scheduling mock interviews to practice your communication skills!"
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;