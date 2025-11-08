import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Interview from '../models/Interview.js'; // Changed from { Interview }
import { asyncHandler } from '../middleware/errorHandler.js';
import { interviewValidation, validate } from '../Middleware/validator.js';

const router = express.Router();

router.use(protect);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, company, role } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (company) query.company = new RegExp(company, 'i');
    if (role) query.role = new RegExp(role, 'i');

    const interviews = await Interview.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  })
);

// Get interview by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

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
  })
);

// Create new interview
router.post(
  '/',
  interviewValidation.create,
  validate,
  asyncHandler(async (req, res) => {
    const interviewData = {
      ...req.body,
      user: req.user.id,
    };

    const interview = await Interview.create(interviewData);

    res.status(201).json({
      success: true,
      message: 'Interview created successfully',
      interview,
    });
  })
);

// Update interview
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    let interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      interview,
    });
  })
);

// Delete interview
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    await interview.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
    });
  })
);

// Start mock interview
router.post(
  '/:id/start-mock',
  asyncHandler(async (req, res) => {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Here you can integrate with AI service for mock interview
    // For now, return mock session info

    res.status(200).json({
      success: true,
      message: 'Mock interview started',
      sessionId: `session_${Date.now()}`,
      interview: interview,
    });
  })
);

// Add note to interview
router.post(
  '/:id/notes',
  asyncHandler(async (req, res) => {
    const { note } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    interview.notes = note;
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      interview,
    });
  })
);

// Get interview analytics
router.get(
  '/analytics',
  asyncHandler(async (req, res) => {
    const interviews = await Interview.find({ user: req.user.id });

    const analytics = {
      total: interviews.length,
      scheduled: interviews.filter((i) => i.status === 'scheduled').length,
      completed: interviews.filter((i) => i.status === 'completed').length,
      passed: interviews.filter((i) => i.status === 'passed').length,
      failed: interviews.filter((i) => i.status === 'failed').length,
      upcoming: interviews.filter(
        (i) => i.status === 'scheduled' && new Date(i.date) > new Date()
      ).length,
    };

    res.status(200).json({
      success: true,
      analytics,
    });
  })
);

export default router;