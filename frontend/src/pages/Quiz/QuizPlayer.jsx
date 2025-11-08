import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  XCircle,
  Send,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Progress';
import { useQuizStore } from '../../store/quizStore';
import { quizApi } from '../../api/quizApi';
import { formatTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const QuizPlayer = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  
  const {
    currentQuiz,
    currentAttempt,
    currentQuestion,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    isLoading,
    startQuiz,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    toggleFlag,
    submitQuiz,
    resetQuiz
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initializeQuiz = async () => {
      if (quizId) {
        await startQuiz(quizId);
      }
    };

    initializeQuiz();

    return () => {
      resetQuiz();
    };
  }, [quizId, startQuiz, resetQuiz]);

  useEffect(() => {
    if (currentQuestion) {
      // Load saved answer
      const savedAnswer = answers[currentQuestion._id];
      if (savedAnswer) {
        setSelectedAnswer(savedAnswer.answer);
      } else {
        setSelectedAnswer('');
      }
      
      // Load starter code for coding questions
      if (currentQuestion.type === 'coding' && currentQuestion.starterCode) {
        setCode(currentQuestion.starterCode.javascript || currentQuestion.starterCode.python || '');
      } else {
        setCode('');
      }
    }
  }, [currentQuestion, answers]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (currentQuestion) {
      saveAnswer(currentQuestion._id, answer);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (currentQuestion) {
      saveAnswer(currentQuestion._id, newCode);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitQuiz();
      if (result.success) {
        navigate(`/results/${currentAttempt._id}`);
      }
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
    }
  };

  if (isLoading || !currentQuiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader size="lg" text="Loading quiz..." />
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  const isAnswered = !!answers[currentQuestion._id];

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{currentQuiz.title}</h1>
            <p className="text-dark-text-muted">{currentQuiz.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-dark-card px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 text-warning" />
              <span className="text-white font-mono">
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            {/* Progress */}
            <div className="text-right">
              <div className="text-white font-semibold">
                {currentQuestionIndex + 1} / {currentQuiz.questions.length}
              </div>
              <div className="text-sm text-dark-text-muted">
                {Math.round(progress)}% Complete
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Questions Navigation */}
          <div className="lg:col-span-1">
            <Card title="Questions" className="sticky top-6">
              <div className="grid grid-cols-5 gap-2">
                {currentQuiz.questions.map((question, index) => {
                  const isCurrent = index === currentQuestionIndex;
                  const isAnswered = !!answers[question._id];
                  const isFlagged = flaggedQuestions.has(question._id);

                  return (
                    <button
                      key={question._id}
                      onClick={() => useQuizStore.getState().goToQuestion(index)}
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all
                        ${isCurrent 
                          ? 'bg-primary-500 text-white' 
                          : isAnswered 
                            ? 'bg-success/20 text-success border border-success/30'
                            : 'bg-dark-card-hover text-dark-text hover:bg-dark-border'
                        }
                        ${isFlagged ? 'ring-2 ring-warning' : ''}
                      `}
                    >
                      {index + 1}
                      {isFlagged && <Flag className="w-3 h-3 absolute -top-1 -right-1" />}
                    </button>
                  );
                })}
              </div>

              {/* Quiz Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-text-muted">Difficulty:</span>
                  <Badge 
                    variant={
                      currentQuiz.difficulty === 'easy' ? 'success' :
                      currentQuiz.difficulty === 'medium' ? 'warning' : 'error'
                    }
                    size="sm"
                  >
                    {currentQuiz.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-text-muted">Type:</span>
                  <span className="text-white capitalize">{currentQuiz.type}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-text-muted">Answered:</span>
                  <span className="text-white">
                    {Object.keys(answers).length} / {currentQuiz.questions.length}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                fullWidth
                className="mt-6"
                onClick={handleSubmitQuiz}
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit Quiz
              </Button>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={
                      currentQuestion.difficulty === 'easy' ? 'success' :
                      currentQuestion.difficulty === 'medium' ? 'warning' : 'error'
                    }
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                  <span className="text-dark-text-muted text-sm">
                    Question {currentQuestionIndex + 1}
                  </span>
                </div>

                <button
                  onClick={() => toggleFlag(currentQuestion._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion._id)
                      ? 'bg-warning/20 text-warning'
                      : 'bg-dark-card-hover text-dark-text-muted hover:text-white'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Question Title & Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {currentQuestion.title}
                </h2>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-dark-text leading-relaxed">
                    {currentQuestion.description}
                  </p>
                </div>
              </div>

              {/* Constraints */}
              {currentQuestion.constraints && currentQuestion.constraints.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Constraints</h3>
                  <ul className="space-y-2">
                    {currentQuestion.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-start gap-2 text-dark-text-muted">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {currentQuestion.examples && currentQuestion.examples.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Examples</h3>
                  <div className="space-y-4">
                    {currentQuestion.examples.map((example, index) => (
                      <div key={index} className="bg-dark-card-hover rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <strong className="text-white">Input:</strong>
                            <pre className="mt-1 text-sm bg-dark-bg p-2 rounded">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <strong className="text-white">Output:</strong>
                            <pre className="mt-1 text-sm bg-dark-bg p-2 rounded">
                              {example.output}
                            </pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-3">
                            <strong className="text-white">Explanation:</strong>
                            <p className="mt-1 text-dark-text-muted text-sm">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Section */}
              <div className="mt-8">
                {currentQuestion.type === 'mcq' ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-white mb-4">Select your answer:</h3>
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option.text)}
                        className={`
                          w-full text-left p-4 rounded-xl border-2 transition-all
                          ${selectedAnswer === option.text
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-dark-border bg-dark-card-hover hover:border-dark-text-muted'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${selectedAnswer === option.text
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-dark-text-muted'
                            }
                          `}>
                            {selectedAnswer === option.text && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-white">{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : currentQuestion.type === 'coding' ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Write your solution:</h3>
                    
                    {/* Language Selector */}
                    <div className="flex gap-2">
                      {['javascript', 'python', 'java', 'cpp'].map((lang) => (
                        <button
                          key={lang}
                          className="px-3 py-1 rounded-lg bg-dark-card-hover text-dark-text-muted hover:text-white capitalize"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    {/* Code Editor */}
                    <div className="border border-dark-border rounded-lg overflow-hidden">
                      <textarea
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        className="w-full h-64 bg-dark-bg text-white font-mono p-4 resize-none focus:outline-none"
                        placeholder="Write your code here..."
                        spellCheck="false"
                      />
                    </div>

                    {/* Run & Test Buttons */}
                    <div className="flex gap-3">
                      <Button variant="secondary" size="sm">
                        Run Code
                      </Button>
                      <Button variant="secondary" size="sm">
                        Test Cases
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Your answer:</h3>
                    <textarea
                      value={selectedAnswer}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      className="w-full h-32 bg-dark-card-hover border border-dark-border rounded-lg p-4 text-white resize-none focus:outline-none focus:border-primary-500"
                      placeholder="Type your answer here..."
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                leftIcon={<ChevronLeft className="w-5 h-5" />}
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  variant="primary"
                  onClick={handleSubmitQuiz}
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-5 h-5" />}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="primary"
                  rightIcon={<ChevronRight className="w-5 h-5" />}
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;