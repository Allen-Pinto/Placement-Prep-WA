import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        answer: mongoose.Schema.Types.Mixed, // Can be string, array, or object
        isCorrect: Boolean,
        marksAwarded: Number,
        timeSpent: Number, // in seconds
        isFlagged: {
          type: Boolean,
          default: false,
        },
      },
    ],
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    totalTimeSpent: Number, // in seconds
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    totalQuestions: Number,
    correctAnswers: Number,
    incorrectAnswers: Number,
    skippedQuestions: Number,
    // Detailed breakdown
    topicWiseScore: [
      {
        topic: String,
        correct: Number,
        total: Number,
        percentage: Number,
      },
    ],
    difficultyWiseScore: {
      easy: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      medium: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      hard: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
    rank: Number, // User's rank in this quiz
    percentile: Number,
    isPassed: Boolean,
  },
  {
    timestamps: true,
  }
);

// Indexes
attemptSchema.index({ user: 1, quiz: 1 });
attemptSchema.index({ status: 1 });
attemptSchema.index({ createdAt: -1 });

// Calculate score and statistics
attemptSchema.methods.calculateResults = async function () {
  const quiz = await mongoose.model('Quiz').findById(this.quiz).populate('questions');
  
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;
  let totalMarks = 0;
  let earnedMarks = 0;

  // Calculate per-topic and per-difficulty breakdown
  const topicStats = {};
  const difficultyStats = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  };

  this.answers.forEach((ans, index) => {
    const question = quiz.questions[index];
    
    if (!ans.answer) {
      skippedCount++;
    } else if (ans.isCorrect) {
      correctCount++;
      earnedMarks += ans.marksAwarded;
    } else {
      incorrectCount++;
    }

    totalMarks += ans.marksAwarded || 1;

    // Topic-wise stats
    const topic = question.topic || 'general';
    if (!topicStats[topic]) {
      topicStats[topic] = { correct: 0, total: 0 };
    }
    topicStats[topic].total++;
    if (ans.isCorrect) topicStats[topic].correct++;

    // Difficulty-wise stats
    if (difficultyStats[question.difficulty]) {
      difficultyStats[question.difficulty].total++;
      if (ans.isCorrect) difficultyStats[question.difficulty].correct++;
    }
  });

  // Update attempt
  this.correctAnswers = correctCount;
  this.incorrectAnswers = incorrectCount;
  this.skippedQuestions = skippedCount;
  this.totalQuestions = this.answers.length;
  this.score = earnedMarks;
  this.percentage = (earnedMarks / totalMarks) * 100;
  this.isPassed = this.percentage >= quiz.passingScore;
  this.difficultyWiseScore = difficultyStats;

  // Format topic-wise score
  this.topicWiseScore = Object.entries(topicStats).map(([topic, stats]) => ({
    topic,
    correct: stats.correct,
    total: stats.total,
    percentage: (stats.correct / stats.total) * 100,
  }));

  return this;
};

const Attempt = mongoose.model('Attempt', attemptSchema);

export default Attempt;