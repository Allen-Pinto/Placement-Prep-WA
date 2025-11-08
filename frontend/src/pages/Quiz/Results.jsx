import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  BarChart3,
  Download,
  Share2,
  Home,
  RotateCcw
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressCircle, ProgressBar } from '../../components/common/Progress';
import { Loader } from '../../components/common/Progress';
import { useQuizStore } from '../../store/quizStore';
import { quizApi } from '../../api/quizApi';
import { formatTime, getScoreCategory } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Results = () => {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await quizApi.getQuizResults(attemptId);
        
        if (data) {
          setResults(data.results);
        } else {
          toast.error(error?.message || 'Failed to load results');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load results');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [attemptId, navigate]);

  const handleRetakeQuiz = () => {
    if (results?.quiz?._id) {
      navigate(`/quiz/${results.quiz._id}`);
    }
  };

  const handleShareResults = async () => {
    // In a real app, this would share the results
    toast.success('Results copied to clipboard!');
  };

  const handleDownloadCertificate = () => {
    toast.success('Certificate download started!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader size="lg" text="Loading results..." />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Results not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const scoreCategory = getScoreCategory(results.percentage);
  const isPassed = results.isPassed;

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Results</h1>
            <p className="text-dark-text-muted">
              {results.quiz?.title || 'Quiz Completed'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              leftIcon={<Share2 className="w-4 h-4" />}
              onClick={handleShareResults}
            >
              Share
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownloadCertificate}
            >
              Certificate
            </Button>
            <Button
              variant="primary"
              onClick={handleRetakeQuiz}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retake Quiz
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Score Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Score Card */}
            <Card className="text-center">
              <ProgressCircle
                value={results.percentage}
                max={100}
                size={180}
                label="Score"
                className="mx-auto mb-4"
              />
              
              <div className="space-y-3">
                <Badge 
                  variant={isPassed ? 'success' : 'error'}
                  size="lg"
                >
                  {isPassed ? 'PASSED' : 'FAILED'}
                </Badge>
                
                <div className="text-center">
                  <p className="text-dark-text-muted">Performance</p>
                  <p className={`text-2xl font-bold ${scoreCategory.color === 'success' ? 'text-success' : scoreCategory.color === 'warning' ? 'text-warning' : 'text-error'}`}>
                    {scoreCategory.label}
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card title="Quick Stats">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-dark-text-muted">Correct Answers</span>
                  <span className="text-success font-semibold">
                    {results.correctAnswers}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-dark-text-muted">Incorrect Answers</span>
                  <span className="text-error font-semibold">
                    {results.incorrectAnswers}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-dark-text-muted">Skipped</span>
                  <span className="text-warning font-semibold">
                    {results.skippedQuestions || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-dark-text-muted">Time Spent</span>
                  <span className="text-white font-semibold">
                    {formatTime(results.totalTimeSpent)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card title="Next Steps">
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/practice')}
                  leftIcon={<TrendingUp className="w-4 h-4" />}
                >
                  Continue Practice
                </Button>
                
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/dashboard')}
                  leftIcon={<Home className="w-4 h-4" />}
                >
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-dark-border pb-2">
              {['overview', 'breakdown', 'answers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-2 rounded-t-lg font-medium transition-colors capitalize
                    ${activeTab === tab
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : 'text-dark-text-muted hover:text-white'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="text-center">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {results.correctAnswers}
                    </h3>
                    <p className="text-dark-text-muted">Correct</p>
                  </Card>

                  <Card className="text-center">
                    <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <XCircle className="w-8 h-8 text-error" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {results.incorrectAnswers}
                    </h3>
                    <p className="text-dark-text-muted">Incorrect</p>
                  </Card>

                  <Card className="text-center">
                    <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {formatTime(results.totalTimeSpent)}
                    </h3>
                    <p className="text-dark-text-muted">Time</p>
                  </Card>
                </div>

                {/* Score Distribution */}
                <Card title="Score Distribution">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-text-muted">Your Score</span>
                      <span className="text-white font-semibold">
                        {results.percentage}%
                      </span>
                    </div>
                    
                    <ProgressBar
                      value={results.percentage}
                      max={100}
                      size="lg"
                      showLabel={false}
                    />
                    
                    <div className="flex items-center justify-between text-sm text-dark-text-muted">
                      <span>0%</span>
                      <span>Passing: {results.quiz?.passingScore || 60}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </Card>

                {/* Difficulty Performance */}
                {results.difficultyWiseScore && (
                  <Card title="Performance by Difficulty">
                    <div className="space-y-4">
                      {Object.entries(results.difficultyWiseScore).map(([difficulty, stats]) => (
                        <div key={difficulty} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                difficulty === 'easy' ? 'success' :
                                difficulty === 'medium' ? 'warning' : 'error'
                              }
                              size="sm"
                            >
                              {difficulty}
                            </Badge>
                            <span className="text-white">
                              {stats.correct}/{stats.total}
                            </span>
                          </div>
                          <span className="text-dark-text-muted">
                            {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Breakdown Tab */}
            {activeTab === 'breakdown' && results.topicWiseScore && (
              <Card title="Topic-wise Performance">
                <div className="space-y-4">
                  {results.topicWiseScore.map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white capitalize">
                          {topic.topic.replace(/_/g, ' ')}
                        </span>
                        <span className="text-dark-text-muted">
                          {topic.correct}/{topic.total} ({Math.round(topic.percentage)}%)
                        </span>
                      </div>
                      <ProgressBar
                        value={topic.percentage}
                        max={100}
                        size="md"
                        showLabel={false}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Answers Tab */}
            {activeTab === 'answers' && results.answers && (
              <div className="space-y-6">
                <Card title="Question Review">
                  <div className="space-y-6">
                    {results.answers.map((answer, index) => (
                      <div key={index} className="border-b border-dark-border pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              Question {index + 1}
                            </h4>
                            <p className="text-dark-text-muted">
                              {answer.question?.title || `Question ${index + 1}`}
                            </p>
                          </div>
                          
                          <Badge
                            variant={answer.isCorrect ? 'success' : 'error'}
                            size="sm"
                          >
                            {answer.isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-white mb-2">Your Answer</h5>
                            <div className="bg-dark-card-hover rounded-lg p-3">
                              <pre className="text-white text-sm whitespace-pre-wrap">
                                {typeof answer.answer === 'string' 
                                  ? answer.answer 
                                  : JSON.stringify(answer.answer, null, 2)
                                }
                              </pre>
                            </div>
                          </div>

                          {!answer.isCorrect && answer.question?.solution && (
                            <div>
                              <h5 className="text-sm font-medium text-white mb-2">Correct Answer</h5>
                              <div className="bg-success/10 rounded-lg p-3">
                                <pre className="text-success text-sm whitespace-pre-wrap">
                                  {answer.question.solution.approach}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>

                        {answer.timeSpent && (
                          <div className="mt-3 text-sm text-dark-text-muted">
                            Time spent: {formatTime(answer.timeSpent)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Improvement Suggestions */}
        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                🚀 Ready to Improve?
              </h3>
              <p className="text-white/90">
                Based on your performance, we recommend practicing these topics:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {results.topicWiseScore
                  ?.filter(topic => topic.percentage < 70)
                  .slice(0, 3)
                  .map((topic, index) => (
                    <Badge key={index} variant="default">
                      {topic.topic.replace(/_/g, ' ')}
                    </Badge>
                  ))}
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/practice')}
              leftIcon={<TrendingUp className="w-4 h-4" />}
            >
              Practice Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Results;