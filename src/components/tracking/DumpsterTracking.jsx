import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import MapView from './MapView';
import DumpsterList from './DumpsterList';
import LiveTrackingMap from './LiveTrackingMap';
import BinTrackingPanel from './BinTrackingPanel';

const { FiMap, FiList, FiMapPin, FiFilter, FiNavigation, FiEye, FiPackage } = FiIcons;

const DumpsterTracking = () => {
  const { dumpsters } = useData();
  const [viewType, setViewType] = useState('live'); // 'live', 'bins', 'map', 'list'
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDumpsters = dumpsters.filter(dumpster =>
    statusFilter === 'all' || dumpster.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Real-Time Tracking</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="deployed">Deployed</option>
              <option value="in-transit">In Transit</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('live')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                viewType === 'live'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiNavigation} className="w-4 h-4 inline mr-1" />
              Live Map
            </button>

            <button
              onClick={() => setViewType('bins')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                viewType === 'bins'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiPackage} className="w-4 h-4 inline mr-1" />
              Bin Tracker
            </button>
            
            <button
              onClick={() => setViewType('map')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                viewType === 'map'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiMap} className="w-4 h-4 inline mr-1" />
              Map
            </button>

            <button
              onClick={() => setViewType('list')}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                viewType === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4 inline mr-1" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Live Tracking View */}
      {viewType === 'live' && <LiveTrackingMap />}

      {/* Bin Tracking Panel */}
      {viewType === 'bins' && <BinTrackingPanel />}

      {/* Traditional Map and List Views */}
      {(viewType === 'map' || viewType === 'list') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {viewType === 'map' ? (
            <MapView dumpsters={filteredDumpsters} />
          ) : (
            <DumpsterList dumpsters={filteredDumpsters} />
          )}
        </div>
      )}
    </div>
  );
};

export default DumpsterTracking;