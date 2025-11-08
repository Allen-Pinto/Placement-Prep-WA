import { create } from 'zustand';
import { quizApi } from '../api/quizApi';
import toast from 'react-hot-toast';

/**
 * Quiz Store using Zustand
 * Manages quiz state, attempts, and results
 */
export const useQuizStore = create((set, get) => ({
  // State
  quizzes: [],
  currentQuiz: null,
  currentAttempt: null,
  currentQuestion: null,
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: new Set(),
  timeRemaining: null,
  isLoading: false,
  error: null,
  results: null,

  /**
   * Fetch all available quizzes
   * @param {Object} filters - Optional filters
   */
  fetchQuizzes: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    const { data, error } = await quizApi.getAllQuizzes(filters);
    
    if (data) {
      set({ quizzes: data.quizzes, isLoading: false });
    } else {
      set({ error: error.message, isLoading: false });
    }
  },

  /**
   * Start a new quiz
   * @param {string} quizId - Quiz ID
   */
  startQuiz: async (quizId) => {
    set({ isLoading: true, error: null });
    
    const { data, error } = await quizApi.startQuiz(quizId);
    
    if (data) {
      set({
        currentQuiz: data.quiz,
        currentAttempt: data.attempt,
        currentQuestion: data.quiz.questions[0],
        currentQuestionIndex: 0,
        answers: {},
        flaggedQuestions: new Set(),
        timeRemaining: data.quiz.timeLimit,
        isLoading: false,
        results: null,
      });
      
      // Start timer
      get().startTimer();
      
      return { success: true };
    } else {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  /**
   * Save answer for current question
   * @param {string} questionId - Question ID
   * @param {any} answer - User's answer
   */
  saveAnswer: (questionId, answer) => {
    const { answers } = get();
    set({
      answers: {
        ...answers,
        [questionId]: {
          answer,
          timeSpent: Date.now(),
          timestamp: new Date().toISOString(),
        },
      },
    });
  },

  /**
   * Navigate to specific question
   * @param {number} index - Question index
   */
    goToQuestion: (index) => {
      const { currentQuiz } = get();
      if (currentQuiz && index >= 0 && index < currentQuiz.questions.length) {
        set({
          currentQuestion: currentQuiz.questions[index],
          currentQuestionIndex: index,
        });
      }
    },

  /**
   * Navigate to next question
   */
  nextQuestion: () => {
    const { currentQuestionIndex, currentQuiz } = get();
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      get().goToQuestion(currentQuestionIndex + 1);
    }
  },

  /**
   * Navigate to previous question
   */
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      get().goToQuestion(currentQuestionIndex - 1);
    }
  },

  /**
   * Toggle flag on question
   * @param {string} questionId - Question ID
   */
  toggleFlag: (questionId) => {
    const { flaggedQuestions } = get();
    const newFlagged = new Set(flaggedQuestions);
    
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    
    set({ flaggedQuestions: newFlagged });
  },

  /**
   * Start quiz timer
   */
  startTimer: () => {
    const timerId = setInterval(() => {
      const { timeRemaining } = get();
      
      if (timeRemaining <= 0) {
        clearInterval(timerId);
        get().submitQuiz(); // Auto-submit when time runs out
      } else {
        set({ timeRemaining: timeRemaining - 1 });
      }
    }, 1000);
    
    // Store timer ID for cleanup
    set({ timerId });
  },

  /**
   * Stop quiz timer
   */
  stopTimer: () => {
    const { timerId } = get();
    if (timerId) {
      clearInterval(timerId);
      set({ timerId: null });
    }
  },

  /**
   * Submit quiz answers
   */
// In your quizStore, update the submitQuiz method:
submitQuiz: async () => {
  const { currentAttempt, answers, currentQuiz } = get();
  
  if (!currentAttempt) return { success: false, error: 'No active attempt' };
  
  set({ isLoading: true });
  get().stopTimer();
  
  // Format answers for submission
  const formattedAnswers = Object.entries(answers).map(([questionId, data]) => ({
    questionId,
    answer: data.answer,
    timeSpent: Math.floor((Date.now() - data.timeSpent) / 1000), // Convert to seconds
  }));
  
  console.log('Submitting quiz:', {
    attemptId: currentAttempt._id,
    answers: formattedAnswers
  });
  
  const { data, error } = await quizApi.submitQuiz(
    currentAttempt._id,
    formattedAnswers
  );
  
  if (data) {
    set({
      results: data.results,
      isLoading: false,
    });
    
    toast.success('Quiz submitted successfully!');
    return { success: true, results: data.results };
  } else {
    set({ error: error?.message || 'Failed to submit quiz', isLoading: false });
    toast.error(error?.message || 'Failed to submit quiz');
    return { success: false, error: error?.message };
  }
},

  /**
   * Reset quiz state
   */
  resetQuiz: () => {
    get().stopTimer();
    set({
      currentQuiz: null,
      currentAttempt: null,
      currentQuestion: null,
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestions: new Set(),
      timeRemaining: null,
      results: null,
      error: null,
    });
  },

  /**
   * Get quiz progress
   */
  getProgress: () => {
    const { currentQuiz, answers } = get();
    if (!currentQuiz) return 0;
    
    const totalQuestions = currentQuiz.questions.length;
    const answeredCount = Object.keys(answers).length;
    
    return {
      answered: answeredCount,
      total: totalQuestions,
      percentage: Math.round((answeredCount / totalQuestions) * 100),
    };
  },

  /**
   * Check if current question is answered
   */
  isCurrentQuestionAnswered: () => {
    const { currentQuestion, answers } = get();
    return currentQuestion ? !!answers[currentQuestion._id] : false;
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),
}));

export default useQuizStore;