import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Building2,
  Briefcase,
  DollarSign,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Progress';
import { interviewApi } from '../../api/interviewApi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Interviews = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    date: '',
    packageAmount: '',
    location: '',
    type: 'off-campus',
    status: 'scheduled',
    topicsRequired: '',
    notes: '',
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [interviews, searchQuery, statusFilter]);

const fetchInterviews = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await interviewApi.getAllInterviews({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      company: searchQuery || undefined,
      role: searchQuery || undefined
    });
    
    if (data && data.success) {
      setInterviews(data.interviews || []);
    } else {
      console.error('Error fetching interviews:', error);
      toast.error(error?.message || 'Failed to fetch interviews');
      setInterviews([]);
    }
  } catch (error) {
    console.error('Failed to fetch interviews:', error);
    toast.error('Failed to fetch interviews');
    setInterviews([]);
  } finally {
    setIsLoading(false);
  }
};

  const filterInterviews = () => {
    let filtered = interviews;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (interview) => interview.status === statusFilter
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (interview) =>
          interview.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          interview.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInterviews(filtered);
  };

const handleAddInterview = async (e) => {
  e.preventDefault();

  const interviewData = {
    company: formData.company,
    role: formData.role,
    date: formData.date,
    packageAmount: parseFloat(formData.packageAmount) || 0,
    location: formData.location,
    type: formData.type,
    status: formData.status,
    topicsRequired: formData.topicsRequired,
    notes: formData.notes
  };

  try {
    const { data, error } = await interviewApi.createInterview(interviewData);

    if (data && data.success) {
      toast.success('Interview added successfully!');
      setIsAddModalOpen(false);
      resetForm();
      fetchInterviews();
    } else {
      toast.error(error?.message || 'Failed to add interview');
    }
  } catch (error) {
    toast.error('Failed to add interview');
  }
};

 const handleDeleteInterview = async () => {
  if (!selectedInterview) return;

  try {
    const { data, error } = await interviewApi.deleteInterview(selectedInterview._id);

    if (data && data.success) {
      toast.success('Interview deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedInterview(null);
      fetchInterviews();
    } else {
      toast.error(error?.message || 'Failed to delete interview');
    }
  } catch (error) {
    toast.error('Failed to delete interview');
  }
};

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      date: '',
      packageAmount: '',
      location: '',
      type: 'off-campus',
      status: 'scheduled',
      topicsRequired: '',
      notes: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusVariant = (status) => {
    const variants = {
      scheduled: 'info',
      completed: 'default',
      passed: 'success',
      failed: 'error',
      pending: 'warning',
      cancelled: 'default',
    };
    return variants[status] || 'default';
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'passed', label: 'Passed' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Interviews</h1>
          <p className="text-dark-text-muted">
            Track and manage your interview applications
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Interview
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <p className="text-dark-text-muted text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{interviews.length}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-dark-text-muted text-sm mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-info">
            {interviews.filter((i) => i.status === 'scheduled').length}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-dark-text-muted text-sm mb-1">Passed</p>
          <p className="text-2xl font-bold text-success">
            {interviews.filter((i) => i.status === 'passed').length}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-dark-text-muted text-sm mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-white">
            {interviews.length > 0
              ? Math.round(
                  (interviews.filter((i) => i.status === 'passed').length /
                    interviews.length) *
                    100
                )
              : 0}
            %
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input md:w-48"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Interview List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading interviews..." />
        </div>
      ) : filteredInterviews.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No interviews yet
            </h3>
            <p className="text-dark-text-muted mb-6">
              Start tracking your interview applications
            </p>
            <Button
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Your First Interview
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInterviews.map((interview) => (
            <Card key={interview._id} hover className="!p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Company & Role */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-dark-card-hover flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {interview.role}
                      </h3>
                      <p className="text-dark-text-muted text-sm">
                        {interview.company}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(interview.status)}>
                      {interview.status}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                      <Calendar className="w-4 h-4" />
                      {formatDate(interview.date)}
                    </div>
                    {interview.package?.amount && (
                      <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                        <DollarSign className="w-4 h-4" />
                        ${interview.package.amount.toLocaleString()}
                      </div>
                    )}
                    {interview.location && (
                      <div className="flex items-center gap-2 text-sm text-dark-text-muted">
                        <MapPin className="w-4 h-4" />
                        {interview.location}
                      </div>
                    )}
                    <Badge variant="default" size="sm">
                      {interview.type}
                    </Badge>
                  </div>

                  {/* Topics */}
                  {interview.topicsRequired &&
                    interview.topicsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {interview.topicsRequired.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="default" size="sm">
                            {topic}
                          </Badge>
                        ))}
                        {interview.topicsRequired.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{interview.topicsRequired.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/interviews/${interview._id}`)}
                    className="p-2 rounded-lg bg-dark-card-hover hover:bg-primary-500/20 text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedInterview(interview);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-dark-card-hover hover:bg-error/20 text-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Interview Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add New Interview"
        size="lg"
      >
        <form onSubmit={handleAddInterview} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="e.g., Google"
              required
              leftIcon={<Building2 className="w-5 h-5" />}
            />
            <Input
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer"
              required
              leftIcon={<Briefcase className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Interview Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              leftIcon={<Calendar className="w-5 h-5" />}
            />
            <Input
              label="Package (USD)"
              name="packageAmount"
              type="number"
              value={formData.packageAmount}
              onChange={handleInputChange}
              placeholder="150000"
              leftIcon={<DollarSign className="w-5 h-5" />}
            />
          </div>

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., San Francisco, CA"
            leftIcon={<MapPin className="w-5 h-5" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Interview Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input"
              >
                <option value="on-campus">On-Campus</option>
                <option value="off-campus">Off-Campus</option>
                <option value="referral">Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <Input
            label="Topics Required (comma-separated)"
            name="topicsRequired"
            value={formData.topicsRequired}
            onChange={handleInputChange}
            placeholder="Data Structures, Algorithms, System Design"
          />

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes..."
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              Add Interview
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal.Confirm
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedInterview(null);
        }}
        onConfirm={handleDeleteInterview}
        title="Delete Interview"
        message={`Are you sure you want to delete the interview for ${selectedInterview?.role} at ${selectedInterview?.company}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="primary"
      />
    </div>
  );
};

export default Interviews;