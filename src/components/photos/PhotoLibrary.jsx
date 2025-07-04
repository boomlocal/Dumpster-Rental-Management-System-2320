import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import PhotoViewer from './PhotoViewer';
import PhotoFilters from './PhotoFilters';
import toast from 'react-hot-toast';

const { FiCamera, FiDownload, FiEye, FiMapPin, FiClock, FiUser, FiFilter, FiSearch, FiEdit3 } = FiIcons;

const PhotoLibrary = () => {
  const { user } = useAuth();
  const { photos, customers, updatePhotoNotes } = useData();
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotes, setEditingNotes] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 'all',
    startDate: '',
    endDate: '',
    type: 'all', // delivery, pickup, all
    customerId: 'all',
    city: '',
    street: '',
    hasGPS: 'all',
    hasNotes: 'all'
  });

  useEffect(() => {
    applyFilters();
  }, [photos, filters, searchTerm]);

  const applyFilters = () => {
    let filtered = [...(photos || [])];

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
          if (filters.startDate) {
            const customStart = new Date(filters.startDate);
            filtered = filtered.filter(photo => photo.timestamp >= customStart);
          }
          if (filters.endDate) {
            const customEnd = new Date(filters.endDate);
            customEnd.setHours(23, 59, 59, 999);
            filtered = filtered.filter(photo => photo.timestamp <= customEnd);
          }
          break;
        default:
          break;
      }

      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(photo => photo.timestamp >= startDate);
      }
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(photo => photo.type === filters.type);
    }

    // Customer filter
    if (filters.customerId !== 'all') {
      filtered = filtered.filter(photo => photo.customerId === parseInt(filters.customerId));
    }

    // Location filters
    if (filters.city) {
      filtered = filtered.filter(photo => {
        const address = getPhotoAddress(photo);
        return address.toLowerCase().includes(filters.city.toLowerCase());
      });
    }

    if (filters.street) {
      filtered = filtered.filter(photo => {
        const address = getPhotoAddress(photo);
        return address.toLowerCase().includes(filters.street.toLowerCase());
      });
    }

    // GPS filter
    if (filters.hasGPS !== 'all') {
      const hasGPS = filters.hasGPS === 'true';
      filtered = filtered.filter(photo => !!photo.location === hasGPS);
    }

    // Notes filter
    if (filters.hasNotes !== 'all') {
      const hasNotes = filters.hasNotes === 'true';
      filtered = filtered.filter(photo => !!photo.notes === hasNotes);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(photo => {
        const customer = getCustomerName(photo.customerId);
        const address = getPhotoAddress(photo);
        const notes = photo.notes || '';
        
        const searchText = `${customer} ${address} ${notes}`.toLowerCase();
        return searchText.includes(searchTerm.toLowerCase());
      });
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredPhotos(filtered);
  };

  const getCustomerName = (customerId) => {
    const customer = customers?.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getPhotoAddress = (photo) => {
    // In a real app, you'd reverse geocode the GPS coordinates
    // For now, we'll use the customer address
    const customer = customers?.find(c => c.id === photo.customerId);
    return customer?.address || 'Unknown Address';
  };

  const downloadPhoto = async (photo) => {
    if (user?.role !== 'admin') {
      toast.error('Only administrators can download photos');
      return;
    }

    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${photo.filename || `photo_${photo.id}.jpg`}`;
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
    if (user?.role !== 'admin') {
      toast.error('Only administrators can download photos');
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

  const startEditingNotes = (photo) => {
    setEditingNotes(photo.id);
    setNoteText(photo.notes || '');
  };

  const saveNotes = async () => {
    try {
      await updatePhotoNotes(editingNotes, noteText);
      setEditingNotes(null);
      setNoteText('');
      toast.success('Notes updated successfully');
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setNoteText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Photo Library</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {filteredPhotos.length} photos
          </span>
          {user?.role === 'admin' && filteredPhotos.length > 0 && (
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiFilter} className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <PhotoFilters
            filters={filters}
            setFilters={setFilters}
            customers={customers}
          />
        )}
      </div>

      {/* Photos Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiCamera} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No photos found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Photo */}
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={`${photo.type} photo`}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  
                  {/* Photo Type Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                    photo.type === 'delivery' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {photo.type}
                  </div>

                  {/* GPS Indicator */}
                  {photo.location && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                      <SafeIcon icon={FiMapPin} className="w-3 h-3" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedPhoto(photo)}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiEye} className="w-4 h-4" />
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => downloadPhoto(photo)}
                          className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                        >
                          <SafeIcon icon={FiDownload} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Photo Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span className="truncate">{getCustomerName(photo.customerId)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <SafeIcon icon={FiClock} className="w-4 h-4" />
                    <span>{photo.timestamp.toLocaleDateString()} {photo.timestamp.toLocaleTimeString()}</span>
                  </div>

                  {photo.location && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                      <span className="truncate">
                        {photo.location.lat.toFixed(4)}, {photo.location.lng.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {/* Notes Section */}
                  <div className="border-t pt-2">
                    {editingNotes === photo.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          rows={2}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Add notes..."
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={saveNotes}
                            className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditingNotes}
                            className="text-xs text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-600 flex-1">
                          {photo.notes ? (
                            <span>{photo.notes}</span>
                          ) : (
                            <span className="italic text-gray-400">No notes</span>
                          )}
                        </p>
                        <button
                          onClick={() => startEditingNotes(photo)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <SafeIcon icon={FiEdit3} className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDownload={user?.role === 'admin' ? downloadPhoto : null}
          customer={customers?.find(c => c.id === selectedPhoto.customerId)}
        />
      )}
    </div>
  );
};

export default PhotoLibrary;