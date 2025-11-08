import Quiz from '../models/Quiz.js';
import Attempt from '../models/Attempt.js';
import Question from '../models/Question.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

/**
 * @desc    Get all quizzes with filters
 * @route   GET /api/quizzes
 * @access  Private
 */
export const getAllQuizzes = asyncHandler(async (req, res, next) => {
  const { type, difficulty, category } = req.query;

  // Build query
  const query = { isPublished: true, isActive: true };

  if (type) query.type = type;
  if (difficulty) query.difficulty = difficulty;
  if (category) query.category = { $in: [category] };

  const quizzes = await Quiz.find(query)
    .select('-questions') // Don't send questions in list
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: quizzes.length,
    quizzes,
  });
});

/**
 * @desc    Get quiz by ID
 * @route   GET /api/quizzes/:id
 * @access  Private
 */
export const getQuizById = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate(
    'questions',
    '-solution -testCases' // Hide solutions and test cases
  );

  if (!quiz) {
    return next(new ErrorResponse('Quiz not found', 404));
  }

  res.status(200).json({
    success: true,
    quiz,
  });
});

/**
 * @desc    Start a new quiz attempt
 * @route   POST /api/quizzes/:id/start
 * @access  Private
 */
export const startQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');

  if (!quiz) {
    return next(new ErrorResponse('Quiz not found', 404));
  }

  // Create new attempt
  const attempt = await Attempt.create({
    user: req.user.id,
    quiz: quiz._id,
    totalQuestions: quiz.questions.length,
    status: 'in_progress',
    startTime: Date.now(),
  });

  // Increment quiz attempts
  quiz.totalAttempts += 1;
  await quiz.save();

  // Prepare quiz data (without solutions)
  const quizData = {
    ...quiz.toObject(),
    questions: quiz.questions.map((q) => ({
      _id: q._id,
      title: q.title,
      description: q.description,
      type: q.type,
      difficulty: q.difficulty,
      options: q.options,
      constraints: q.constraints,
      examples: q.examples,
      starterCode: q.starterCode,
      hints: q.hints,
      // Exclude solution and test cases
    })),
  };

  res.status(200).json({
    success: true,
    attempt: {
      _id: attempt._id,
      startTime: attempt.startTime,
    },
    quiz: quizData,
  });
});

/**
 * @desc    Submit answer for a question
 * @route   POST /api/attempts/:attemptId/answer
 * @access  Private
 */
export const submitAnswer = asyncHandler(async (req, res, next) => {
  const { questionId, answer, timeSpent } = req.body;

  const attempt = await Attempt.findById(req.params.attemptId);

  if (!attempt) {
    return next(new ErrorResponse('Attempt not found', 404));
  }

  // Verify ownership
  if (attempt.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Check if attempt is still in progress
  if (attempt.status !== 'in_progress') {
    return next(new ErrorResponse('Attempt already completed', 400));
  }

  // Get question
  const question = await Question.findById(questionId);

  if (!question) {
    return next(new ErrorResponse('Question not found', 404));
  }

  // Check if answer is correct (for MCQ)
  let isCorrect = false;
  let marksAwarded = 0;

  if (question.type === 'mcq') {
    const correctOption = question.options.find((opt) => opt.isCorrect);
    isCorrect = answer === correctOption.text;
    marksAwarded = isCorrect ? 1 : 0;
  }

  // Update or add answer
  const existingAnswerIndex = attempt.answers.findIndex(
    (ans) => ans.question.toString() === questionId
  );

  if (existingAnswerIndex > -1) {
    attempt.answers[existingAnswerIndex] = {
      question: questionId,
      answer,
      isCorrect,
      marksAwarded,
      timeSpent,
    };
  } else {
    attempt.answers.push({
      question: questionId,
      answer,
      isCorrect,
      marksAwarded,
      timeSpent,
    });
  }

  await attempt.save();

  res.status(200).json({
    success: true,
    message: 'Answer saved',
  });
});

/**
 * @desc    Submit entire quiz
 * @route   POST /api/attempts/:attemptId/submit
 * @access  Private
 */
export const submitQuiz = asyncHandler(async (req, res, next) => {
  const { answers } = req.body;

  const attempt = await Attempt.findById(req.params.attemptId).populate({
    path: 'quiz',
    populate: { path: 'questions' },
  });

  if (!attempt) {
    return next(new ErrorResponse('Attempt not found', 404));
  }

  // Verify ownership
  if (attempt.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Process all answers
  for (const ans of answers) {
    const question = await Question.findById(ans.questionId);
    
    if (question) {
      let isCorrect = false;
      let marksAwarded = 0;

      if (question.type === 'mcq') {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        isCorrect = ans.answer === correctOption.text;
        marksAwarded = isCorrect ? 1 : 0;
      }

      const existingAnswerIndex = attempt.answers.findIndex(
        (a) => a.question.toString() === ans.questionId
      );

      if (existingAnswerIndex > -1) {
        attempt.answers[existingAnswerIndex] = {
          question: ans.questionId,
          answer: ans.answer,
          isCorrect,
          marksAwarded,
          timeSpent: ans.timeSpent,
        };
      } else {
        attempt.answers.push({
          question: ans.questionId,
          answer: ans.answer,
          isCorrect,
          marksAwarded,
          timeSpent: ans.timeSpent,
        });
      }
    }
  }

  // Mark as completed
  attempt.status = 'completed';
  attempt.endTime = Date.now();
  attempt.totalTimeSpent = Math.floor((attempt.endTime - attempt.startTime) / 1000);

  // Calculate results
  await attempt.calculateResults();
  await attempt.save();

  // Update quiz statistics
  const quiz = attempt.quiz;
  quiz.averageScore =
    (quiz.averageScore * (quiz.totalAttempts - 1) + attempt.percentage) /
    quiz.totalAttempts;
  quiz.highestScore = Math.max(quiz.highestScore, attempt.percentage);
  quiz.lowestScore = Math.min(quiz.lowestScore, attempt.percentage);
  await quiz.save();

  res.status(200).json({
    success: true,
    message: 'Quiz submitted successfully',
    results: {
      _id: attempt._id,
      score: attempt.score,
      percentage: attempt.percentage,
      correctAnswers: attempt.correctAnswers,
      incorrectAnswers: attempt.incorrectAnswers,
      skippedQuestions: attempt.skippedQuestions,
      totalQuestions: attempt.totalQuestions,
      isPassed: attempt.isPassed,
      timeSpent: attempt.totalTimeSpent,
      topicWiseScore: attempt.topicWiseScore,
      difficultyWiseScore: attempt.difficultyWiseScore,
    },
  });
});

/**
 * @desc    Get quiz results
 * @route   GET /api/attempts/:attemptId/results
 * @access  Private
 */
export const getQuizResults = asyncHandler(async (req, res, next) => {
  const attempt = await Attempt.findById(req.params.attemptId)
    .populate('quiz')
    .populate('answers.question');

  if (!attempt) {
    return next(new ErrorResponse('Results not found', 404));
  }

  // Verify ownership
  if (attempt.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json({
    success: true,
    results: attempt,
  });
});

/**
 * @desc    Get user's quiz attempts
 * @route   GET /api/attempts
 * @access  Private
 */
export const getUserAttempts = asyncHandler(async (req, res, next) => {
  const { type, limit = 10, offset = 0 } = req.query;

  const query = { user: req.user.id, status: 'completed' };

  if (type) {
    const quizzes = await Quiz.find({ type }).select('_id');
    query.quiz = { $in: quizzes.map((q) => q._id) };
  }

  const attempts = await Attempt.find(query)
    .populate('quiz', 'title type difficulty')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));

  const total = await Attempt.countDocuments(query);

  res.status(200).json({
    success: true,
    count: attempts.length,
    total,
    attempts,
  });
});

export default {
  getAllQuizzes,
  getQuizById,
  startQuiz,
  submitAnswer,
  submitQuiz,
  getQuizResults,
  getUserAttempts,
};