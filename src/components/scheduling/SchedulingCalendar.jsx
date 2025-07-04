import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import CalendarView from './CalendarView';
import JobForm from '../jobs/JobForm';

const { FiCalendar, FiPlus, FiFilter } = FiIcons;

const SchedulingCalendar = () => {
  const { jobs } = useData();
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewType, setViewType] = useState('month');

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowJobForm(true);
  };

  const handleCloseForm = () => {
    setShowJobForm(false);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Scheduling Calendar</h1>
        <div className="flex items-center space-x-4">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="month">Month View</option>
            <option value="week">Week View</option>
            <option value="day">Day View</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowJobForm(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>Schedule Job</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <CalendarView
          jobs={jobs}
          viewType={viewType}
          onDateClick={handleDateClick}
        />
      </div>

      {showJobForm && (
        <JobForm
          job={selectedDate ? { scheduledDate: selectedDate } : null}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default SchedulingCalendar;