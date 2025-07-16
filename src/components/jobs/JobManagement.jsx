import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import JobForm from './JobForm';
import JobList from './JobList';
import toast from 'react-hot-toast';

const { FiPlus, FiSearch, FiFilter } = FiIcons;

const JobManagement = () => {
  const { jobs, addJob, updateJob, deleteJob } = useData();
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddJob = (jobData) => {
    try {
      addJob(jobData);
      setShowJobForm(false);
      toast.success('Job created successfully');
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('Failed to create job');
    }
  };

  const handleUpdateJob = (id, updates) => {
    try {
      updateJob(id, updates);
      setShowJobForm(false);
      setSelectedJob(null);
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    }
  };

  const handleDeleteJob = (jobId) => {
    try {
      deleteJob(jobId);
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobForm(true);
  };

  const handleCloseForm = () => {
    setShowJobForm(false);
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowJobForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>New Job</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        <JobList 
          jobs={filteredJobs} 
          onEditJob={handleEditJob} 
          onDeleteJob={handleDeleteJob}
        />
      </div>

      {showJobForm && (
        <JobForm
          job={selectedJob}
          onClose={handleCloseForm}
          onSave={selectedJob ? handleUpdateJob : handleAddJob}
        />
      )}
    </div>
  );
};

export default JobManagement;