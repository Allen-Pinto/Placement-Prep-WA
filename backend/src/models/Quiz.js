import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide quiz title'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['aptitude', 'coding', 'hr_behavioral'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    category: [String], // e.g., ['quantitative', 'logical_reasoning']
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    timeLimit: {
      type: Number,
      required: true, // in seconds
    },
    passingScore: {
      type: Number,
      default: 60, // percentage
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    instructions: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Statistics
    totalAttempts: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    lowestScore: {
      type: Number,
      default: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
quizSchema.index({ type: 1, difficulty: 1 });
quizSchema.index({ isPublished: 1, isActive: 1 });

// Virtual for question count
quizSchema.virtual('questionCount').get(function () {
  return this.questions.length;
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;