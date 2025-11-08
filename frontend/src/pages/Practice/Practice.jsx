import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Brain, 
  Users, 
  Search, 
  Filter,
  CheckCircle,
  Circle,
  Clock,
  TrendingUp,
  Award,
  Play,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Progress';
import { quizApi } from '../../api/quizApi';
import toast from 'react-hot-toast';

const Practice = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
  });

  // Fetch quizzes on mount
  useEffect(() => {
    fetchQuizzes();
    fetchStats();
  }, [activeTab, selectedDifficulty]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const filters = {};
      if (activeTab !== 'all') filters.type = activeTab;
      if (selectedDifficulty !== 'all') filters.difficulty = selectedDifficulty;

      const { data, error } = await quizApi.getQuizzes(filters); 
      
      if (data) {
        setQuizzes(data.quizzes || []);
      } else {
        console.error('Error fetching quizzes:', error);
        setQuizzes([]);
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      setQuizzes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Use quiz attempts to calculate stats
      const { data } = await quizApi.getUserAttempts({ limit: 50 });
      if (data && data.attempts) {
        const attempts = data.attempts;
        
        // Calculate stats from attempts
        const stats = {
          easy: { solved: 0, total: 0 },
          medium: { solved: 0, total: 0 },
          hard: { solved: 0, total: 0 },
        };

        // Count attempts by difficulty
        attempts.forEach(attempt => {
          const difficulty = attempt.quiz?.difficulty || 'easy';
          if (stats[difficulty]) {
            stats[difficulty].total++;
            if (attempt.percentage >= 70) {
              stats[difficulty].solved++;
            }
          }
        });

        setStats(stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use default stats
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const { data, error } = await quizApi.startQuiz(quizId);
      
      if (data) {
        toast.success('Quiz started!');
        navigate(`/quiz/${quizId}`, { state: { attempt: data.attempt } });
      } else {
        toast.error(error?.message || 'Failed to start quiz');
      }
    } catch (error) {
      toast.error('Failed to start quiz');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Topics', icon: Code },
    { id: 'coding', label: 'Coding', icon: Code },
    { id: 'aptitude', label: 'Aptitude', icon: Brain },
    { id: 'hr_behavioral', label: 'HR & Behavioral', icon: Users },
  ];

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Practice</h1>
        <p className="text-dark-text-muted">
          Master your skills with curated challenges
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-muted text-sm">Easy</p>
              <p className="text-2xl font-bold text-success">
                {stats.easy.solved}/{stats.easy.total}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-muted text-sm">Medium</p>
              <p className="text-2xl font-bold text-warning">
                {stats.medium.solved}/{stats.medium.total}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </div>
        </Card>

        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-muted text-sm">Hard</p>
              <p className="text-2xl font-bold text-error">
                {stats.hard.solved}/{stats.hard.total}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center">
              <Award className="w-8 h-8 text-error" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-card text-dark-text hover:bg-dark-card-hover'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 rounded-xl capitalize transition-all ${
                selectedDifficulty === level
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-card text-dark-text hover:bg-dark-card-hover'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading challenges..." />
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-dark-text-muted text-lg mb-4">
              No challenges found
            </p>
            <p className="text-dark-text-muted text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <Card
              key={quiz._id}
              hover
              className="!p-6 cursor-pointer group"
              onClick={() => handleStartQuiz(quiz._id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title & Status */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-500 transition-colors">
                      {quiz.title}
                    </h3>
                    <Badge
                      variant={
                        quiz.difficulty === 'easy'
                          ? 'success'
                          : quiz.difficulty === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-dark-text-muted text-sm mb-3 line-clamp-2">
                    {quiz.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-dark-text-muted">
                    <span className="flex items-center gap-1">
                      <Code className="w-4 h-4" />
                      {quiz.questionCount || quiz.questions?.length || 0} Questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor((quiz.timeLimit || 0) / 60)} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {quiz.totalAttempts || 0} attempted
                    </span>
                  </div>

                  {/* Tags */}
                  {quiz.category && quiz.category.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {quiz.category.slice(0, 3).map((cat) => (
                        <Badge key={cat} variant="default" size="sm">
                          {cat.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {quiz.category.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{quiz.category.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Start Button */}
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartQuiz(quiz._id);
                  }}
                  className="shrink-0"
                >
                  Start
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Daily Challenge Banner */}
      <Card gradient className="!p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              🎯 Daily Challenge
            </h3>
            <p className="text-white/90 text-sm mb-4">
              Complete today's challenge and maintain your streak!
            </p>
            <Button variant="secondary" size="sm">
              Start Daily Challenge
            </Button>
          </div>
          <div className="hidden md:block text-6xl">🏆</div>
        </div>
      </Card>
    </div>
  );
};

export default Practice;