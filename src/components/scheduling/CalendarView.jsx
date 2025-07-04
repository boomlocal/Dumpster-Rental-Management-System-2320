import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';

const { FiChevronLeft, FiChevronRight, FiTruck } = FiIcons;

const CalendarView = ({ jobs, viewType, onDateClick }) => {
  const { customers } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  const getJobsForDate = (date) => {
    return jobs.filter(job => isSameDay(job.scheduledDate, date));
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;

    // Header with days of week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const headerRow = (
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(dayName => (
          <div key={dayName} className="p-2 text-center text-sm font-medium text-gray-500">
            {dayName}
          </div>
        ))}
      </div>
    );

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayJobs = getJobsForDate(day);
        
        days.push(
          <motion.div
            key={day.toString()}
            whileHover={{ scale: 1.02 }}
            onClick={() => onDateClick(cloneDay)}
            className={`min-h-[100px] p-2 border cursor-pointer transition-colors ${
              !isSameMonth(day, monthStart)
                ? 'text-gray-400 bg-gray-50'
                : isToday(day)
                ? 'bg-primary-50 border-primary-200'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-medium ${
                isToday(day) ? 'text-primary-600' : 'text-gray-900'
              }`}>
                {format(day, dateFormat)}
              </span>
              {dayJobs.length > 0 && (
                <span className="text-xs bg-primary-100 text-primary-600 px-1 rounded">
                  {dayJobs.length}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {dayJobs.slice(0, 3).map((job, index) => (
                <div
                  key={job.id}
                  className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                >
                  {getCustomerName(job.customerId)}
                </div>
              ))}
              {dayJobs.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayJobs.length - 3} more
                </div>
              )}
            </div>
          </motion.div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div>
        {headerRow}
        {rows}
      </div>
    );
  };

  const nextMonth = () => {
    setCurrentDate(addDays(currentDate, 30));
  };

  const prevMonth = () => {
    setCurrentDate(addDays(currentDate, -30));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {renderMonthView()}
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span>Scheduled Jobs</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-100 rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;