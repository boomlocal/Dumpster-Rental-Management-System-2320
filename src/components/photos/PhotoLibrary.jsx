import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import PhotoViewer from './PhotoViewer';
import PhotoFilters from './PhotoFilters';
import toast from 'react-hot-toast';

const { FiCamera, FiDownload, FiFilter, FiSearch, FiRefreshCw, FiGrid, FiList, FiTrash2 } = FiIcons;

const PhotoLibrary = () => {
  const { user } = useAuth();
  const { photos, customers, jobs, updatePhotoNotes, deletePhoto } = useData();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  // Check if user has permission to download/delete
  const canDownloadOrDelete = user?.role === 'admin' || user?.role === 'office_staff';

  // Advanced Filters
  const [filters, setFilters] = useState({
    dateRange: 'all',
    startDate: '',
    endDate: '',
    type: 'all', // delivery, pickup, etc.
    customerId: 'all',
    jobId: 'all',
    state: 'all',
    city: '',
    dumpsterSize: 'all',
    hasGPS: 'all',
    hasNotes: 'all',
    uploadedBy: 'all',
    userRole: 'all',
    sortBy: 'newest' // newest, oldest
  });

  // Get unique values for filters
  const getUniqueValues = () => {
    const cities = [...new Set(photos.map(photo => photo.location?.city).filter(Boolean))];
    const states = [...new Set(photos.map(photo => photo.location?.state).filter(Boolean))];
    const dumpsterSizes = [...new Set(jobs.map(job => job.dumpsterSize).filter(Boolean))];
    const photoTypes = [...new Set(photos.map(photo => photo.type).filter(Boolean))];
    const userRoles = [...new Set(photos.map(photo => photo.userRole).filter(Boolean))];
    return { cities, states, dumpsterSizes, photoTypes, userRoles };
  };

  // Apply filters to photos
  useEffect(() => {
    let filtered = [...photos];

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(photo => {
        const customer = customers.find(c => c.id === photo.customerId);
        const job = jobs.find(j => j.id === photo.jobId);
        const searchableText = [
          photo.notes,
          photo.filename,
          photo.uploadedBy,
          photo.driverName,
          photo.customerName,
          customer?.name,
          customer?.company,
          job?.dumpsterSize,
          photo.location?.city,
          photo.location?.state,
          photo.address
        ].join(' ').toLowerCase();
        return searchableText.includes(term);
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'custom':
          if (filters.startDate && filters.endDate) {
            filtered = filtered.filter(photo => {
              const photoDate = new Date(photo.timestamp);
              return photoDate >= new Date(filters.startDate) && photoDate <= new Date(filters.endDate);
            });
          }
          break;
        default:
          break;
      }
      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(photo => new Date(photo.timestamp) >= startDate);
      }
    }

    // Customer filter
    if (filters.customerId !== 'all') {
      filtered = filtered.filter(photo => photo.customerId === parseInt(filters.customerId));
    }

    // Job filter
    if (filters.jobId !== 'all') {
      filtered = filtered.filter(photo => photo.jobId === parseInt(filters.jobId));
    }

    // State filter
    if (filters.state !== 'all') {
      filtered = filtered.filter(photo => photo.location?.state === filters.state);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(photo => 
        photo.location?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Dumpster size filter
    if (filters.dumpsterSize !== 'all') {
      filtered = filtered.filter(photo => {
        // Check photo's dumpsterSize property first
        if (photo.dumpsterSize === filters.dumpsterSize) return true;
        
        // If not found, check associated job
        const job = jobs.find(j => j.id === photo.jobId);
        return job?.dumpsterSize === filters.dumpsterSize;
      });
    }

    // Photo type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(photo => photo.type === filters.type);
    }

    // GPS filter
    if (filters.hasGPS !== 'all') {
      filtered = filtered.filter(photo => !!photo.location === (filters.hasGPS === 'true'));
    }

    // Notes filter
    if (filters.hasNotes !== 'all') {
      filtered = filtered.filter(photo => !!photo.notes === (filters.hasNotes === 'true'));
    }

    // User role filter
    if (filters.userRole !== 'all') {
      filtered = filtered.filter(photo => photo.userRole === filters.userRole);
    }

    // Uploaded by filter
    if (filters.uploadedBy !== 'all') {
      filtered = filtered.filter(photo => photo.uploadedBy === filters.uploadedBy);
    }

    // Sort photos
    filtered.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    setFilteredPhotos(filtered);
  }, [photos, filters, searchTerm, customers, jobs]);

  const downloadPhoto = async (photo) => {
    if (!canDownloadOrDelete) {
      toast.error('Only administrators and office staff can download photos');
      return;
    }

    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = photo.filename || `photo_${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Photo downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download photo');
    }
  };

  const downloadAllFiltered = async () => {
    if (!canDownloadOrDelete) {
      toast.error('Only administrators and office staff can download photos');
      return;
    }

    if (filteredPhotos.length === 0) {
      toast.error('No photos to download');
      return;
    }

    toast.success(`Starting download of ${filteredPhotos.length} photos...`);
    for (let i = 0; i < filteredPhotos.length; i++) {
      setTimeout(() => downloadPhoto(filteredPhotos[i]), i * 500);
    }
  };
  
  const handleUpdatePhotoNotes = (photoId, notes) => {
    updatePhotoNotes(photoId, notes);
    toast.success('Photo notes updated');
  };
  
  const handleDeletePhoto = (photoId) => {
    if (!canDownloadOrDelete) {
      toast.error('Only administrators and office staff can delete photos');
      return;
    }
    
    deletePhoto(photoId);
    setSelectedPhoto(null);
    toast.success('Photo deleted successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Photo Library</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {filteredPhotos.length} photos
          </span>
          {canDownloadOrDelete && filteredPhotos.length > 0 && (
            <button
              onClick={downloadAllFiltered}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
              <span>Download All</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-4">
          <div className="relative flex-1 max-w-md">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiFilter} className="w-5 h-5" />
              <span>Filters</span>
            </button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow' : 'text-gray-600'}`}
              >
                <SafeIcon icon={FiGrid} className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-primary-600 shadow' : 'text-gray-600'}`}
              >
                <SafeIcon icon={FiList} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <PhotoFilters
            filters={filters}
            setFilters={setFilters}
            uniqueValues={getUniqueValues()}
            customers={customers}
            jobs={jobs}
          />
        )}
      </div>

      {/* Photos Grid/List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiCamera} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No photos found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <PhotoGridItem
                key={photo.id}
                photo={photo}
                customer={customers.find(c => c.id === photo.customerId)}
                job={jobs.find(j => j.id === photo.jobId)}
                onView={() => setSelectedPhoto(photo)}
                canDownload={canDownloadOrDelete}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPhotos.map((photo) => (
              <PhotoListItem
                key={photo.id}
                photo={photo}
                customer={customers.find(c => c.id === photo.customerId)}
                job={jobs.find(j => j.id === photo.jobId)}
                onView={() => setSelectedPhoto(photo)}
                canDownload={canDownloadOrDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDownload={canDownloadOrDelete ? downloadPhoto : null}
          onDelete={canDownloadOrDelete ? handleDeletePhoto : null}
          onUpdateNotes={handleUpdatePhotoNotes}
          customer={customers.find(c => c.id === selectedPhoto.customerId)}
          job={jobs.find(j => j.id === selectedPhoto.jobId)}
        />
      )}
    </div>
  );
};

// Grid Item Component
const PhotoGridItem = ({ photo, customer, job, onView, canDownload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <img
          src={photo.url}
          alt={`${photo.type} photo`}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={onView}
        />
        <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded text-white text-xs">
          {new Date(photo.timestamp).toLocaleDateString()}
        </div>
        {photo.location && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <SafeIcon icon={FiCamera} className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            {photo.customerName || customer?.name || 'Unknown Customer'}
          </span>
          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
            {photo.type}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {job && (
            <div className="mb-1">
              Job #{job.id} - {photo.dumpsterSize || job.dumpsterSize}
            </div>
          )}
          {photo.address && (
            <div className="truncate">{photo.address}</div>
          )}
          {photo.driverName && (
            <div className="truncate">Driver: {photo.driverName}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// List Item Component
const PhotoListItem = ({ photo, customer, job, onView, canDownload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex-shrink-0 w-20 h-20">
        <img
          src={photo.url}
          alt={`${photo.type} photo`}
          className="w-full h-full object-cover rounded"
          onClick={onView}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-900">
            {photo.customerName || customer?.name || 'Unknown Customer'}
          </span>
          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
            {photo.type}
          </span>
        </div>
        <div className="mt-1 text-sm text-gray-500">
          {job && (
            <span className="mr-3">Job #{job.id} - {photo.dumpsterSize || job.dumpsterSize}</span>
          )}
          {photo.address && (
            <span>{photo.address}</span>
          )}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Driver: {photo.driverName || 'Unknown'} • {new Date(photo.timestamp).toLocaleString()}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center space-x-2">
        <button
          onClick={onView}
          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          <SafeIcon icon={FiCamera} className="w-5 h-5" />
        </button>
        {canDownload && (
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
          >
            <SafeIcon icon={FiDownload} className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PhotoLibrary;