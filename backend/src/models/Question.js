import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide question title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide question description'],
    },
    type: {
      type: String,
      enum: ['mcq', 'coding', 'subjective'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'aptitude',
        'coding',
        'hr_behavioral',
        'system_design',
        'data_structures',
        'algorithms',
      ],
      required: true,
    },
    topic: {
      type: String,
      enum: [
        'arrays_hashing',
        'two_pointers',
        'sliding_window',
        'stack',
        'queue',
        'binary_search',
        'linked_list',
        'trees',
        'graphs',
        'dynamic_programming',
        'greedy',
        'backtracking',
        'system_design',
        'quantitative',
        'logical_reasoning',
        'verbal_ability',
        'behavioral',
      ],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    // For MCQ questions
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    // For Coding questions
    constraints: [String],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    starterCode: {
      python: String,
      javascript: String,
      java: String,
      cpp: String,
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false },
      },
    ],
    solution: {
      approach: String,
      code: {
        python: String,
        javascript: String,
        java: String,
        cpp: String,
      },
      timeComplexity: String,
      spaceComplexity: String,
    },
    hints: [String],
    tags: [String],
    companies: [String], // Companies that asked this question
    frequency: {
      type: Number,
      default: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    averageTime: {
      type: Number,
      default: 0, // in seconds
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ type: 1 });
questionSchema.index({ companies: 1 });
questionSchema.index({ tags: 1 });

// Update acceptance rate
questionSchema.methods.updateAcceptanceRate = function () {
  if (this.totalAttempts > 0) {
    this.acceptanceRate = (this.totalSolved / this.totalAttempts) * 100;
  }
};

const Question = mongoose.model('Question', questionSchema);

export default Question;