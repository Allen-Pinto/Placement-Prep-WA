import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Plus,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Loader, ProgressCircle } from '../../components/common/Progress';
import { resumeApi } from '../../api/interviewApi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Resume = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await resumeApi.getResumes();
      
      if (data) {
        setResumes(data.resumes || []);
        if (data.resumes?.length > 0) {
          setSelectedResume(data.resumes[0]);
        }
      } else {
        console.error('Error fetching resumes:', error);
        setResumes([]);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    setIsAnalyzing(true);

    try {
      const { data, error } = await resumeApi.uploadResume(formData);
      
      if (data) {
        toast.success('Resume uploaded successfully!');
        setIsUploadModalOpen(false);
        setUploadedFile(null);
        fetchResumes();
      } else {
        toast.error(error?.message || 'Failed to upload resume');
      }
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetAISuggestions = async () => {
    if (!selectedResume) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await resumeApi.getAISuggestions(
        selectedResume._id,
        'Software Engineer'
      );

      if (data) {
        toast.success('AI suggestions generated!');
        setSelectedResume({
          ...selectedResume,
          aiSuggestions: data.suggestions,
        });
      } else {
        toast.error(error?.message || 'Failed to generate suggestions');
      }
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleATSAnalysis = async () => {
    if (!selectedResume) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await resumeApi.analyzeATS(selectedResume._id);

      if (data) {
        toast.success('ATS analysis complete!');
        setSelectedResume({
          ...selectedResume,
          atsAnalysis: data.atsAnalysis,
        });
      } else {
        toast.error(error?.message || 'Failed to analyze resume');
      }
    } catch (error) {
      toast.error('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySuggestion = async (suggestionId) => {
    if (!selectedResume) return;

    try {
      const { data, error } = await resumeApi.applySuggestion(
        selectedResume._id,
        suggestionId
      );

      if (data) {
        toast.success('Suggestion applied!');
        fetchResumes();
      } else {
        toast.error(error?.message || 'Failed to apply suggestion');
      }
    } catch (error) {
      toast.error('Failed to apply suggestion');
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      const { data, error } = await resumeApi.deleteResume(resumeId);

      if (data) {
        toast.success('Resume deleted successfully!');
        fetchResumes();
        if (selectedResume?._id === resumeId) {
          setSelectedResume(null);
        }
      } else {
        toast.error(error?.message || 'Failed to delete resume');
      }
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  if (isLoading) {
    return <Loader fullScreen text="Loading resumes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Resume Management
          </h1>
          <p className="text-dark-text-muted">
            Upload, analyze, and improve your resume with AI
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No resumes yet
            </h3>
            <p className="text-dark-text-muted mb-6">
              Upload your resume to get AI-powered suggestions and ATS analysis
            </p>
            <Button
              variant="primary"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Your First Resume
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">My Resumes</h3>
            {resumes.map((resume) => (
              <Card
                key={resume._id}
                hover
                className={`!p-4 cursor-pointer transition-all ${
                  selectedResume?._id === resume._id
                    ? 'ring-2 ring-primary-500'
                    : ''
                }`}
                onClick={() => setSelectedResume(resume)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {resume.title}
                    </h4>
                    <p className="text-sm text-dark-text-muted">
                      {formatDate(resume.updatedAt)}
                    </p>
                    {resume.isPrimary && (
                      <Badge variant="success" size="sm" className="mt-2">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteResume(resume._id);
                    }}
                    className="p-2 rounded-lg hover:bg-error/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-error" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Resume Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedResume ? (
              <>
                {/* ATS Score */}
                {selectedResume.atsAnalysis ? (
                  <Card>
                    <div className="text-center py-6">
                      <ProgressCircle
                        value={selectedResume.atsAnalysis.score}
                        max={100}
                        size={150}
                        label="ATS Score"
                        className="mb-4 mx-auto"
                      />
                      <p className="text-dark-text-muted">
                        Your resume is {selectedResume.atsAnalysis.score >= 80 ? 'well' : 'moderately'} optimized for ATS
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card gradient>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          ATS Analysis
                        </h3>
                        <p className="text-white/90 text-sm mb-4">
                          Check how well your resume passes Applicant Tracking Systems
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleATSAnalysis}
                          isLoading={isAnalyzing}
                        >
                          Analyze Resume
                        </Button>
                      </div>
                      <TrendingUp className="w-16 h-16 text-white/20" />
                    </div>
                  </Card>
                )}

                {/* AI Suggestions */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      AI Suggestions
                    </h3>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Sparkles className="w-4 h-4" />}
                      onClick={handleGetAISuggestions}
                      isLoading={isAnalyzing}
                    >
                      Generate
                    </Button>
                  </div>

                  {selectedResume.aiSuggestions &&
                  selectedResume.aiSuggestions.length > 0 ? (
                    <div className="space-y-4">
                      {selectedResume.aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border ${
                            suggestion.isApplied
                              ? 'bg-success/10 border-success/30'
                              : 'bg-dark-card-hover border-dark-border'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              variant={
                                suggestion.priority === 'high'
                                  ? 'error'
                                  : suggestion.priority === 'medium'
                                  ? 'warning'
                                  : 'info'
                              }
                              size="sm"
                            >
                              {suggestion.priority} priority
                            </Badge>
                            {!suggestion.isApplied && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleApplySuggestion(suggestion._id)
                                }
                              >
                                Apply
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-dark-text-muted mb-2">
                            Section: {suggestion.section}
                          </p>
                          <p className="text-white mb-2">
                            {suggestion.suggested}
                          </p>
                          <p className="text-sm text-dark-text-muted">
                            💡 {suggestion.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-dark-text-muted mx-auto mb-3" />
                      <p className="text-dark-text-muted">
                        No suggestions yet. Click "Generate" to get AI-powered recommendations.
                      </p>
                    </div>
                  )}
                </Card>

                {/* ATS Checks */}
                {selectedResume.atsAnalysis && (
                  <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      ATS Compatibility
                    </h3>

                    {/* Passed Checks */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-success mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Passed Checks
                      </h4>
                      <ul className="space-y-2">
                        {selectedResume.atsAnalysis.passedChecks?.map(
                          (check, index) => (
                            <li
                              key={index}
                              className="text-sm text-dark-text-muted flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-success" />
                              {check}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Failed Checks */}
                    {selectedResume.atsAnalysis.failedChecks?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-error mb-2 flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Needs Improvement
                        </h4>
                        <ul className="space-y-2">
                          {selectedResume.atsAnalysis.failedChecks.map(
                            (check, index) => (
                              <li
                                key={index}
                                className="text-sm text-dark-text-muted flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4 text-error" />
                                {check}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Keywords */}
                    <div className="mt-4 pt-4 border-t border-dark-border">
                      <h4 className="text-sm font-medium text-white mb-2">
                        Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.atsAnalysis.keywords?.found?.map(
                          (keyword) => (
                            <Badge key={keyword} variant="success" size="sm">
                              {keyword}
                            </Badge>
                          )
                        )}
                        {selectedResume.atsAnalysis.keywords?.missing?.map(
                          (keyword) => (
                            <Badge key={keyword} variant="error" size="sm">
                              {keyword} (missing)
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-dark-text-muted mx-auto mb-3" />
                  <p className="text-dark-text-muted">
                    Select a resume to view details
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
<Modal
  open={isUploadModalOpen}
  onClose={() => {
    setIsUploadModalOpen(false);
    setUploadedFile(null);
  }}
  title="Upload Resume"
  size="md"
>
  <div className="space-y-4">
    {/* FIXED: Clickable Drag & Drop Area */}
    <label htmlFor="resume-upload">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragActive
            ? 'border-primary-500 bg-primary-500/10'
            : uploadedFile
            ? 'border-success bg-success/10'
            : 'border-dark-border hover:border-primary-500 hover:bg-primary-500/5'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
          <>
            <FileText className="w-12 h-12 text-success mx-auto mb-4" />
            <p className="text-white font-medium mb-2">File Selected!</p>
            <p className="text-success text-sm mb-2">{uploadedFile.name}</p>
            <p className="text-dark-text-muted text-sm">
              Click to select a different file
            </p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-dark-text-muted mx-auto mb-4" />
            <p className="text-white mb-2">
              {dragActive ? 'Drop your resume here' : 'Click to upload your resume'}
            </p>
            <p className="text-sm text-dark-text-muted">
              PDF or DOCX, max 5MB
            </p>
          </>
        )}
      </div>
    </label>

    {/* Hidden file input */}
    <input
      type="file"
      accept=".pdf,.docx"
      onChange={handleFileChange}
      className="hidden"
      id="resume-upload"
    />

    {/* Selected File Info - Only show when file is selected */}
    {uploadedFile && (
      <div className="flex items-center gap-3 p-4 bg-dark-card rounded-xl">
        <FileText className="w-8 h-8 text-primary-500" />
        <div className="flex-1">
          <p className="font-medium text-white">{uploadedFile.name}</p>
          <p className="text-sm text-dark-text-muted">
            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {
              uploadedFile.type === 'application/pdf' ? 'PDF' : 'DOCX'
            }
          </p>
        </div>
        <button
          onClick={() => setUploadedFile(null)}
          className="p-2 rounded-lg hover:bg-error/20 transition-colors"
          title="Remove file"
        >
          <Trash2 className="w-5 h-5 text-error" />
        </button>
      </div>
    )}

    {/* Upload Button */}
    <div className="flex gap-3 pt-4">
      <Button
        variant="secondary"
        fullWidth
        onClick={() => {
          setIsUploadModalOpen(false);
          setUploadedFile(null);
        }}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        fullWidth
        onClick={handleUpload}
        disabled={!uploadedFile}
        isLoading={isAnalyzing}
      >
        {isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
      </Button>
    </div>
  </div>
</Modal>
    </div>
  );
};

export default Resume;