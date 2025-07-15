import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const { FiCamera, FiX, FiMapPin, FiCheck, FiRefreshCw, FiTruck, FiUser, FiUpload, FiImage } = FiIcons;

const UniversalPhotoUpload = ({ 
  jobId, 
  customerId, 
  type, 
  onPhotoTaken, 
  onClose, 
  title = 'Take Photos',
  maxPhotos = 10 
}) => {
  const { addPhoto, jobs, customers } = useData();
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [uploadMode, setUploadMode] = useState('camera'); // 'camera' or 'file'
  const [isDragging, setIsDragging] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Get job and customer details
  const job = jobs.find(j => j.id === jobId);
  const customer = job ? customers.find(c => c.id === job.customerId) : customers.find(c => c.id === customerId);

  useEffect(() => {
    getCurrentLocation();
    if (uploadMode === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [uploadMode]);

  // Handle modal positioning
  useEffect(() => {
    if (modalRef.current) {
      const checkPosition = () => {
        const modalRect = modalRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        if (modalRect.height > viewportHeight - 40) {
          modalRef.current.style.height = 'auto';
          modalRef.current.style.maxHeight = '85vh';
          modalRef.current.style.overflowY = 'auto';
          modalRef.current.style.margin = '20px auto';
          modalRef.current.parentElement.style.alignItems = 'flex-start';
          modalRef.current.parentElement.style.overflowY = 'auto';
        }
      };
      checkPosition();
      window.addEventListener('resize', checkPosition);
      return () => window.removeEventListener('resize', checkPosition);
    }
  }, [photos]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Continue without location - not critical for photo upload
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Camera access denied. Please enable camera permissions or use file upload.');
      setUploadMode('file'); // Fallback to file upload
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = async () => {
    if (photos.length >= maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      context.drawImage(video, 0, 0);
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        const photoData = await createPhotoData(blob, `camera_${Date.now()}.jpg`);
        addPhotoToList(photoData);
        toast.success(`Photo ${photos.length + 1} captured successfully`);
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error('Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (photos.length + validFiles.length > maxPhotos) {
      toast.error(`Cannot upload ${validFiles.length} files. Maximum ${maxPhotos} photos allowed.`);
      return;
    }

    for (const file of validFiles) {
      try {
        const photoData = await createPhotoData(file, file.name);
        addPhotoToList(photoData);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error(`Failed to process ${file.name}`);
      }
    }

    toast.success(`${validFiles.length} photo(s) uploaded successfully`);
  };

  const createPhotoData = async (blob, filename) => {
    return {
      id: Date.now() + Math.random(),
      jobId,
      customerId: customerId || job?.customerId,
      type: type || 'general',
      blob,
      url: URL.createObjectURL(blob),
      timestamp: new Date(),
      location: currentLocation,
      address: job?.address || customer?.address || 'Unknown location',
      dumpsterSize: job?.dumpsterSize || 'Unknown size',
      customerName: customer?.name || 'Unknown Customer',
      driverName: user?.name || 'Unknown User',
      notes: '',
      filename,
      uploadedBy: user?.name || 'Unknown User',
      userRole: user?.role || 'unknown'
    };
  };

  const addPhotoToList = (photoData) => {
    setPhotos(prev => [...prev, photoData]);
    
    // Add to global photo library
    if (addPhoto) {
      addPhoto(photoData);
    }
    
    if (onPhotoTaken) {
      onPhotoTaken(photoData);
    }
  };

  const deletePhoto = (photoId) => {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== photoId);
      // Clean up object URL
      const photoToDelete = prev.find(p => p.id === photoId);
      if (photoToDelete?.url) {
        URL.revokeObjectURL(photoToDelete.url);
      }
      return updated;
    });
    toast.success('Photo deleted');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const saveAndClose = () => {
    toast.success(`${photos.length} photo(s) saved`);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
    >
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto my-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {photos.length}/{maxPhotos}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 space-y-4 overflow-y-auto flex-grow">
          {/* Job Information Card */}
          {(job || customer) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="space-y-1 text-sm text-blue-800">
                {job && (
                  <>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                      <span>{job.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiTruck} className="w-4 h-4" />
                      <span>{job.dumpsterSize} - {type} photos</span>
                    </div>
                  </>
                )}
                {customer && (
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>{customer.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setUploadMode('camera')}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                uploadMode === 'camera' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiCamera} className="w-4 h-4 inline mr-1" />
              Camera
            </button>
            <button
              onClick={() => setUploadMode('file')}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                uploadMode === 'file' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiUpload} className="w-4 h-4 inline mr-1" />
              Upload
            </button>
          </div>

          {/* Camera Mode */}
          {uploadMode === 'camera' && (
            <div className="space-y-3">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-48 object-cover" 
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera Controls */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={capturePhoto}
                    disabled={isCapturing || photos.length >= maxPhotos}
                    className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon 
                      icon={isCapturing ? FiRefreshCw : FiCamera} 
                      className={`w-6 h-6 ${isCapturing ? 'animate-spin' : ''}`} 
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* File Upload Mode */}
          {uploadMode === 'file' && (
            <div className="space-y-3">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <SafeIcon icon={FiImage} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: JPEG, PNG, GIF, WebP (max 10MB each)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Select Files
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
            <p className="font-medium text-blue-800">
              Tips: Take clear photos in good lighting • Max {maxPhotos} photos
            </p>
          </div>

          {/* Captured Photos */}
          {photos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Captured Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img 
                      src={photo.url} 
                      alt={`${type} photo`}
                      className="w-full h-20 object-cover rounded border border-gray-200" 
                    />
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <SafeIcon icon={FiX} className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                      {photo.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Always visible */}
        <div className="flex justify-between p-4 border-t shrink-0 bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={saveAndClose}
            disabled={photos.length === 0}
            className="bg-primary-600 text-white px-3 py-1.5 text-sm rounded font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <SafeIcon icon={FiCheck} className="w-3 h-3" />
            <span>Save ({photos.length})</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UniversalPhotoUpload;