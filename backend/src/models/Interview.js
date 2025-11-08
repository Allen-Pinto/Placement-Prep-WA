import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    time: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid'],
      default: 'remote',
    },
    type: {
      type: String,
      enum: ['technical', 'hr', 'managerial', 'behavioral', 'case-study', 'other'],
      default: 'technical',
    },
    round: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'passed', 'failed', 'pending'],
      default: 'scheduled',
    },
    interviewers: [
      {
        name: String,
        designation: String,
        email: String,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    preparation: {
      topics: [String],
      resources: [
        {
          title: String,
          url: String,
          type: {
            type: String,
            enum: ['article', 'video', 'practice', 'other'],
          },
        },
      ],
      checklist: [
        {
          item: String,
          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: String,
      strengths: [String],
      improvements: [String],
      technicalScore: Number,
      communicationScore: Number,
      problemSolvingScore: Number,
    },
    result: {
      status: {
        type: String,
        enum: ['selected', 'rejected', 'on-hold', 'awaiting'],
      },
      nextRound: {
        type: Date,
      },
      offer: {
        received: Boolean,
        amount: Number,
        currency: String,
        benefits: [String],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
interviewSchema.index({ user: 1, date: -1 });
interviewSchema.index({ user: 1, status: 1 });
interviewSchema.index({ company: 'text', role: 'text' });

// Virtual for days until interview
interviewSchema.virtual('daysUntil').get(function () {
  const today = new Date();
  const interviewDate = new Date(this.date);
  const diffTime = interviewDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is upcoming
interviewSchema.virtual('isUpcoming').get(function () {
  return this.status === 'scheduled' && new Date(this.date) > new Date();
});

// Pre-save middleware
interviewSchema.pre('save', function (next) {
  // Auto-update status based on date
  if (this.status === 'scheduled' && new Date(this.date) < new Date()) {
    this.status = 'pending';
  }
  next();
});

const Interview = mongoose.model('Interview', interviewSchema);

// IMPORTANT: Use default export, not named export
export default Interview;