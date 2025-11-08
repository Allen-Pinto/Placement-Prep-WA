import Interview from '../models/Interview.js';
import { asyncHandler } from '../Middleware/errorHandler.js';

/**
 * @desc    Get all interviews for authenticated user
 * @route   GET /api/interviews
 * @access  Private
 */
export const getInterviews = asyncHandler(async (req, res) => {
  const { status, company, role, page = 1, limit = 10 } = req.query;
  
  // Build filter object
  const filter = { user: req.user._id };
  
  if (status && status !== 'all') {
    filter.status = status;
  }
  
  if (company) {
    filter.company = { $regex: company, $options: 'i' };
  }
  
  if (role) {
    filter.role = { $regex: role, $options: 'i' };
  }

  // Execute query with pagination
  const interviews = await Interview.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('mockAttempts', 'score createdAt duration')
    .lean();

  const total = await Interview.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: interviews.length,
    total,
    pagination: {
      page: Number(page),
      pages: Math.ceil(total / limit),
      limit: Number(limit)
    },
    interviews,
  });
});

/**
 * @desc    Get single interview by ID
 * @route   GET /api/interviews/:id
 * @access  Private
 */
export const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  })
  .populate('mockAttempts', 'score createdAt duration questions')
  .populate('user', 'name email');

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  res.status(200).json({
    success: true,
    interview,
  });
});

/**
 * @desc    Create new interview
 * @route   POST /api/interviews
 * @access  Private
 */
export const createInterview = asyncHandler(async (req, res) => {
  const {
    company,
    role,
    date,
    packageAmount,
    location,
    type,
    status,
    topicsRequired,
    notes,
    jobDescription,
    rounds,
    tags
  } = req.body;

  // Validation
  if (!company || !role || !date) {
    return res.status(400).json({
      success: false,
      message: 'Company, role, and date are required fields',
    });
  }

  const interview = await Interview.create({
    user: req.user._id,
    company,
    role,
    date,
    package: {
      amount: packageAmount || 0,
      currency: 'USD',
    },
    location,
    type: type || 'off-campus',
    status: status || 'scheduled',
    topicsRequired: Array.isArray(topicsRequired) 
      ? topicsRequired 
      : (topicsRequired || '').split(',').map(topic => topic.trim()).filter(Boolean),
    notes,
    jobDescription,
    rounds: rounds || [],
    tags: tags || [],
    isPAQAvailable: false // Will be set based on question availability
  });

  // Populate the created interview
  const populatedInterview = await Interview.findById(interview._id)
    .populate('user', 'name email');

  res.status(201).json({
    success: true,
    message: 'Interview created successfully',
    interview: populatedInterview,
  });
});

/**
 * @desc    Update interview
 * @route   PUT /api/interviews/:id
 * @access  Private
 */
export const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  // Update fields
  const updatableFields = [
    'company', 'role', 'date', 'location', 'type', 'status', 
    'notes', 'jobDescription', 'rounds', 'tags'
  ];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      interview[field] = req.body[field];
    }
  });

  // Handle package amount separately
  if (req.body.packageAmount !== undefined) {
    interview.package.amount = req.body.packageAmount;
  }

  // Handle topicsRequired array
  if (req.body.topicsRequired !== undefined) {
    interview.topicsRequired = Array.isArray(req.body.topicsRequired) 
      ? req.body.topicsRequired 
      : req.body.topicsRequired.split(',').map(topic => topic.trim()).filter(Boolean);
  }

  await interview.save();

  const updatedInterview = await Interview.findById(interview._id)
    .populate('mockAttempts', 'score createdAt duration')
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    message: 'Interview updated successfully',
    interview: updatedInterview,
  });
});

/**
 * @desc    Delete interview
 * @route   DELETE /api/interviews/:id
 * @access  Private
 */
export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  await Interview.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Interview deleted successfully',
  });
});

/**
 * @desc    Start mock interview session
 * @route   POST /api/interviews/:id/start-mock
 * @access  Private
 */
export const startMockInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  // Generate mock session (in real app, this would create an Attempt record)
  const sessionId = `mock_session_${Date.now()}_${interview._id}`;
  
  // Update interview status if needed
  if (interview.status === 'scheduled') {
    interview.status = 'pending';
    await interview.save();
  }

  res.status(200).json({
    success: true,
    message: 'Mock interview session started',
    sessionId,
    interview: {
      _id: interview._id,
      company: interview.company,
      role: interview.role,
      topicsRequired: interview.topicsRequired,
      duration: 45, // Default duration in minutes
    },
  });
});

/**
 * @desc    Add note to interview
 * @route   POST /api/interviews/:id/notes
 * @access  Private
 */
export const addInterviewNote = asyncHandler(async (req, res) => {
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({
      success: false,
      message: 'Note content is required',
    });
  }

  const interview = await Interview.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { 
      $set: { notes: note },
      $push: { 
        candidateTips: {
          $each: [`Note added: ${new Date().toLocaleDateString()}`],
          $slice: -10 // Keep only last 10 tips
        }
      }
    },
    { new: true, runValidators: true }
  );

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Note added successfully',
    interview,
  });
});

/**
 * @desc    Get interview analytics and statistics
 * @route   GET /api/interviews/analytics/overview
 * @access  Private
 */
export const getInterviewAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get basic counts
  const totalInterviews = await Interview.countDocuments({ user: userId });
  const scheduledInterviews = await Interview.countDocuments({ 
    user: userId, 
    status: 'scheduled' 
  });
  const completedInterviews = await Interview.countDocuments({ 
    user: userId, 
    status: { $in: ['completed', 'passed', 'failed'] } 
  });
  const passedInterviews = await Interview.countDocuments({ 
    user: userId, 
    status: 'passed' 
  });

  // Get company distribution
  const companyStats = await Interview.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$company',
        count: { $sum: 1 },
        passed: {
          $sum: { $cond: [{ $eq: ['$status', 'passed'] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Get status distribution
  const statusStats = await Interview.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get monthly trend
  const monthlyTrend = await Interview.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  // Calculate success rate
  const successRate = completedInterviews > 0 
    ? Math.round((passedInterviews / completedInterviews) * 100) 
    : 0;

  res.status(200).json({
    success: true,
    analytics: {
      overview: {
        total: totalInterviews,
        scheduled: scheduledInterviews,
        completed: completedInterviews,
        passed: passedInterviews,
        successRate
      },
      companyStats,
      statusStats,
      monthlyTrend
    },
  });
});

/**
 * @desc    Get upcoming interviews
 * @route   GET /api/interviews/upcoming
 * @access  Private
 */
export const getUpcomingInterviews = asyncHandler(async (req, res) => {
  const upcomingInterviews = await Interview.find({
    user: req.user._id,
    date: { $gte: new Date() },
    status: { $in: ['scheduled', 'pending'] }
  })
  .sort({ date: 1 })
  .limit(5)
  .select('company role date status location type')
  .lean();

  res.status(200).json({
    success: true,
    count: upcomingInterviews.length,
    interviews: upcomingInterviews,
  });
});

/**
 * @desc    Update interview round status
 * @route   PUT /api/interviews/:id/rounds/:roundId
 * @access  Private
 */
export const updateInterviewRound = asyncHandler(async (req, res) => {
  const { id, roundId } = req.params;
  const { status, feedback, date } = req.body;

  const interview = await Interview.findOne({
    _id: id,
    user: req.user._id
  });

  if (!interview) {
    return res.status(404).json({
      success: false,
      message: 'Interview not found',
    });
  }

  const round = interview.rounds.id(roundId);
  if (!round) {
    return res.status(404).json({
      success: false,
      message: 'Round not found',
    });
  }

  // Update round fields
  if (status) round.status = status;
  if (feedback) round.feedback = feedback;
  if (date) round.date = date;

  await interview.save();

  res.status(200).json({
    success: true,
    message: 'Round updated successfully',
    round,
  });
});