import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Resume from '../models/Resume.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

// Mock resumes for development
const mockResumes = [
  {
    _id: '1',
    user: 'user123',
    title: 'Software Engineer Resume',
    contactInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-234-567-8900',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
    },
    summary: 'Full-stack developer with 3+ years of experience building scalable web applications.',
    education: [
      {
        institution: 'Stanford University',
        degree: 'B.S. Computer Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-06-01',
        gpa: '3.8',
      }
    ],
    experience: [
      {
        company: 'Tech Corp',
        position: 'Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2020-07-01',
        endDate: null,
        isCurrentRole: true,
        description: [
          'Developed and maintained React/Node.js applications serving 1M+ users',
          'Improved application performance by 40% through code optimization',
          'Led a team of 3 developers on key product features'
        ],
        technologies: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      }
    ],
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
      languages: ['English', 'Spanish'],
      tools: ['Git', 'Docker', 'AWS'],
      soft: ['Leadership', 'Communication', 'Problem Solving'],
    },
    isPrimary: true,
    updatedAt: new Date().toISOString(),
    // ADD THESE FIELDS THAT YOUR FRONTEND EXPECTS:
    atsAnalysis: {
      score: 85,
      passedChecks: [
        'Contact information present',
        'Standard formatting',
        'Keywords detected',
        'Clear section headings',
        'Work experience detailed'
      ],
      failedChecks: [
        'Missing LinkedIn URL', 
        'Skills section could be expanded',
        'No quantifiable achievements in experience',
        'Too many pages (3+)'
      ],
      keywords: {
        found: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        missing: ['TypeScript', 'Docker', 'AWS', 'CI/CD', 'REST API'],
      },
      suggestions: [
        'Add LinkedIn profile URL',
        'Include more technical skills',
        'Quantify achievements with metrics',
      ],
      lastAnalyzedAt: new Date().toISOString(),
    },
    aiSuggestions: [
      {
        _id: 'suggestion_1',
        section: 'experience',
        type: 'improvement',
        original: 'Worked on backend development',
        suggested: 'Developed and maintained RESTful APIs serving 1M+ users, improving response time by 40%',
        reason: 'Add quantifiable metrics and impact',
        priority: 'high',
        isApplied: false,
      },
      {
        _id: 'suggestion_2',
        section: 'skills',
        priority: 'medium',
        current: 'Basic skills listed without proficiency levels',
        suggested: 'Add proficiency levels and categorize skills (Frontend, Backend, Tools)',
        reason: 'Recruiters prefer to see skill proficiency and organization',
        isApplied: false
      },
      {
        _id: 'suggestion_3',
        section: 'contact',
        priority: 'low',
        current: 'Missing LinkedIn URL',
        suggested: 'Add professional LinkedIn profile URL',
        reason: 'LinkedIn is essential for professional networking and credibility',
        isApplied: false
      }
    ]
  }
];

router.use(protect);

// Get all user resumes
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userResumes = mockResumes.filter(r => r.user === 'user123');

    res.status(200).json({
      success: true,
      count: userResumes.length,
      resumes: userResumes,
    });
  })
);

// Get resume by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const resume = mockResumes.find(r => 
      r._id === req.params.id && r.user === 'user123'
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  })
);

// Upload resume - ENHANCED WITH ANALYSIS
router.post(
  '/upload',
  upload.single('resume'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Simulate resume analysis
    const atsAnalysis = {
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      passedChecks: [
        'Proper file format',
        'Contact information present',
        'Work experience detailed',
        'Education section complete'
      ],
      failedChecks: [
        'Missing skills section',
        'No quantifiable achievements',
        'Could use more technical keywords'
      ],
      keywords: {
        found: ['JavaScript', 'React', 'Node.js'],
        missing: ['TypeScript', 'AWS', 'Docker']
      },
      suggestions: [
        'Add quantifiable metrics to experience',
        'Include more technical skills',
        'Add LinkedIn profile if available'
      ],
      lastAnalyzedAt: new Date().toISOString(),
    };

    const aiSuggestions = [
      {
        _id: `suggestion_${Date.now()}_1`,
        section: 'experience',
        priority: 'high',
        current: 'Responsibilities listed without metrics',
        suggested: 'Quantify achievements with numbers and percentages (e.g., "Improved performance by 40%")',
        reason: 'Metrics make your experience more impactful and credible',
        isApplied: false
      },
      {
        _id: `suggestion_${Date.now()}_2`,
        section: 'skills',
        priority: 'medium',
        current: 'Basic skills listed',
        suggested: 'Categorize skills and add proficiency levels',
        reason: 'Organized skills are easier for recruiters to scan',
        isApplied: false
      }
    ];

    const newResume = {
      _id: `resume_${Date.now()}`,
      user: 'user123',
      title: req.file.originalname.replace(/\.[^/.]+$/, ""), // Remove file extension
      originalFile: {
        filename: req.file.originalname,
        uploadDate: new Date().toISOString(),
        size: req.file.size,
      },
      atsAnalysis,
      aiSuggestions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPrimary: mockResumes.length === 0, // First resume is primary
    };

    mockResumes.push(newResume);

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      resume: newResume,
    });
  })
);

// Create resume from scratch
router.post(
  '/create',
  asyncHandler(async (req, res) => {
    const newResume = {
      _id: `resume_${Date.now()}`,
      ...req.body,
      user: 'user123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPrimary: mockResumes.length === 0,
    };

    mockResumes.push(newResume);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      resume: newResume,
    });
  })
);

// Update resume
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const resumeIndex = mockResumes.findIndex(r => 
      r._id === req.params.id && r.user === 'user123'
    );

    if (resumeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const updatedResume = {
      ...mockResumes[resumeIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    mockResumes[resumeIndex] = updatedResume;

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      resume: updatedResume,
    });
  })
);

// Delete resume
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const resumeIndex = mockResumes.findIndex(r => 
      r._id === req.params.id && r.user === 'user123'
    );

    if (resumeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    mockResumes.splice(resumeIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  })
);

// Get AI suggestions - ENHANCED
router.post(
  '/:id/suggestions',
  asyncHandler(async (req, res) => {
    const { targetRole } = req.body;
    const resumeIndex = mockResumes.findIndex(r => 
      r._id === req.params.id && r.user === 'user123'
    );

    if (resumeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const mockSuggestions = [
      {
        _id: 'suggestion_1',
        section: 'experience',
        priority: 'high',
        current: 'Responsibilities listed without metrics',
        suggested: 'Quantify achievements with numbers and percentages (e.g., "Improved performance by 40%")',
        reason: 'Metrics make your experience more impactful and credible',
        isApplied: false,
      },
      {
        _id: 'suggestion_2',
        section: 'skills',
        priority: 'medium',
        current: 'Basic skills listed without organization',
        suggested: 'Categorize skills (Frontend, Backend, Tools) and add proficiency levels',
        reason: 'Organized skills are easier for recruiters to scan quickly',
        isApplied: false,
      },
      {
        _id: 'suggestion_3',
        section: 'summary',
        priority: 'medium',
        current: 'Generic professional summary',
        suggested: `Tailor summary for ${targetRole || 'target role'} with specific technologies and achievements`,
        reason: 'Targeted summaries catch recruiter attention faster',
        isApplied: false,
      }
    ];

    mockResumes[resumeIndex].aiSuggestions = mockSuggestions;
    mockResumes[resumeIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'AI suggestions generated successfully',
      suggestions: mockSuggestions,
    });
  })
);

// Apply suggestion
router.post(
  '/:id/apply-suggestion',
  asyncHandler(async (req, res) => {
    const { suggestionId } = req.body;
    const resumeIndex = mockResumes.findIndex(r => 
      r._id === req.params.id && r.user === 'user123'
    );

    if (resumeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const resume = mockResumes[resumeIndex];
    if (resume.aiSuggestions) {
      const suggestion = resume.aiSuggestions.find(s => s._id === suggestionId);
      if (suggestion) {
        suggestion.isApplied = true;
        suggestion.appliedAt = new Date().toISOString();
        
        // Update ATS score when suggestions are applied
        if (resume.atsAnalysis) {
          resume.atsAnalysis.score = Math.min(resume.atsAnalysis.score + 5, 100);
        }
        
        mockResumes[resumeIndex].updatedAt = new Date().toISOString();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Suggestion applied successfully',
      resume: mockResumes[resumeIndex],
    });
  })
);

// ATS Analysis - ENHANCED
router.get(
  '/:id/ats-analysis',
  asyncHandler(async (req, res) => {
    const resumeIndex = mockResumes.findIndex(r => 
      r._id === req.params.id && r.user === 'user123'
    );

    if (resumeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const atsAnalysis = {
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      passedChecks: [
        'Contact information present',
        'Standard formatting used',
        'Relevant keywords detected',
        'Clear section headings',
        'Professional email address',
        'Work experience detailed'
      ],
      failedChecks: [
        'Missing LinkedIn profile URL',
        'Skills section could be more comprehensive',
        'No quantifiable achievements in experience',
        'Summary could be more targeted'
      ],
      keywords: {
        found: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'Git'],
        missing: ['TypeScript', 'Docker', 'AWS', 'CI/CD', 'REST API', 'Agile'],
      },
      suggestions: [
        'Add LinkedIn profile URL for professional networking',
        'Include quantifiable metrics in experience section',
        'Expand technical skills with current industry standards',
        'Tailor summary for specific job roles'
      ],
      lastAnalyzedAt: new Date().toISOString(),
    };

    mockResumes[resumeIndex].atsAnalysis = atsAnalysis;
    mockResumes[resumeIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'ATS analysis completed',
      atsAnalysis,
    });
  })
);

// Set resume as primary
router.post(
  '/:id/set-primary',
  asyncHandler(async (req, res) => {
    const resumeIndex = mockResumes.findIndex(r => 
      r._id === req.params.id && r.user === 'user123'
    );

    if (resumeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Set all resumes to non-primary
    mockResumes.forEach(resume => {
      if (resume.user === 'user123') {
        resume.isPrimary = false;
      }
    });

    // Set the selected resume as primary
    mockResumes[resumeIndex].isPrimary = true;
    mockResumes[resumeIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Resume set as primary',
      resume: mockResumes[resumeIndex],
    });
  })
);

export default router;