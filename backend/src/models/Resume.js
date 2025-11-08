import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'My Resume',
    },
    contactInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String,
    },
    summary: String,
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        gpa: String,
        achievements: [String],
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        location: String,
        startDate: Date,
        endDate: Date,
        isCurrentRole: Boolean,
        description: [String],
        technologies: [String],
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        link: String,
        github: String,
        highlights: [String],
      },
    ],
    skills: {
      technical: [String],
      languages: [String],
      tools: [String],
      soft: [String],
    },
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        credentialId: String,
        link: String,
      },
    ],
    achievements: [String],
    originalFile: {
      url: String,
      publicId: String,
      filename: String,
      uploadDate: Date,
    },
    aiSuggestions: [
      {
        section: String,
        type: {
          type: String,
          enum: ['improvement', 'addition', 'removal', 'rewrite'],
        },
        original: String,
        suggested: String,
        reason: String,
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
        },
        isApplied: {
          type: Boolean,
          default: false,
        },
        appliedAt: Date,
      },
    ],
    atsAnalysis: {
      score: Number,
      passedChecks: [String],
      failedChecks: [String],
      keywords: {
        found: [String],
        missing: [String],
      },
      suggestions: [String],
      lastAnalyzedAt: Date,
    },
    template: {
      type: String,
      default: 'modern',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    targetRole: String,
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ user: 1, isPrimary: -1 });
resumeSchema.index({ updatedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;