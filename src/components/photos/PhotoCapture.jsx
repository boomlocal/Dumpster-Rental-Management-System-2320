import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

const { FiCamera, FiX, FiMapPin, FiClock, FiCheck, FiRefreshCw } = FiIcons;

const PhotoCapture = ({ jobId, customerId, type, onPhotoTaken, onClose }) => {
  const { addPhoto } = useData();
  const [photos, setPhotos] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const maxPhotos = 5;
  const photoType = type; // 'delivery' or 'pickup'

  useEffect(() => {
    startCamera();
    getCurrentLocation();
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment' // Use back camera on mobile
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

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
          toast.error('Unable to get location. Photos will be saved without GPS data.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  };

  const capturePhoto = async () => {
    if (photos.length >= maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed for ${photoType}`);
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
        const photoData = {
          id: Date.now(),
          jobId,
          customerId,
          type: photoType,
          blob,
          url: URL.createObjectURL(blob),
          timestamp: new Date(),
          location: currentLocation,
          notes: '',
          filename: `${photoType}_${Date.now()}.jpg`
        };

        setPhotos(prev => [...prev, photoData]);
        
        // Add to global photo library
        if (addPhoto) {
          await addPhoto(photoData);
        }
        
        if (onPhotoTaken) {
          onPhotoTaken(photoData);
        }

        toast.success(`Photo ${photos.length + 1} captured successfully`);
      }, 'image/jpeg', 0.9);

    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error('Failed to capture photo');
    } finally {
      setIsCapturing(false);
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

  const saveAndClose = () => {
    toast.success(`${photos.length} photos saved for ${photoType}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {photoType === 'delivery' ? 'Delivery' : 'Pickup'} Photos
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {photos.length}/{maxPhotos} photos
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
              <SafeIcon icon={FiX} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Camera Section */}
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing || photos.length >= maxPhotos}
                  className="bg-white text-gray-900 p-4 rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={isCapturing ? FiRefreshCw : FiCamera} 
                    className={`w-8 h-8 ${isCapturing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Location Indicator */}
              {currentLocation && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                  <span>GPS Active</span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Photo Guidelines:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Take clear photos showing dumpster placement and surroundings</li>
                <li>• Ensure good lighting for photo clarity</li>
                <li>• Include any relevant damage or conditions</li>
                <li>• Photos are automatically GPS tagged and timestamped</li>
              </ul>
            </div>
          </div>

          {/* Captured Photos */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Captured Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={`${photoType} photo`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    
                    {/* Photo Info Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-opacity"
                      >
                        <SafeIcon icon={FiX} className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Timestamp */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {photo.timestamp.toLocaleTimeString()}
                    </div>

                    {/* GPS Indicator */}
                    {photo.location && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                        <SafeIcon icon={FiMapPin} className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => getCurrentLocation()}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <SafeIcon icon={FiMapPin} className="w-4 h-4" />
              <span>Refresh GPS</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveAndClose}
                disabled={photos.length === 0}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
                <span>Save Photos ({photos.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCapture;