```jsx
// Add to the imports
import UniversalPhotoUpload from '../photos/UniversalPhotoUpload';

// Add to the form state
const [showPhotoUpload, setShowPhotoUpload] = useState(false);
const [assetPhotos, setAssetPhotos] = useState(asset?.photos || []);

// Add photo handling functions
const handlePhotoTaken = async (photoData) => {
  setAssetPhotos(prev => [...prev, photoData]);
  toast.success('Photo added successfully');
};

const handleDeletePhoto = (photoId) => {
  setAssetPhotos(prev => prev.filter(p => p.id !== photoId));
  toast.success('Photo removed');
};

// Add to the form JSX, after the notes section
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Asset Photos {!asset && '*'}
  </label>
  <div className="space-y-4">
    {/* Photo Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {assetPhotos.map((photo) => (
        <div key={photo.id} className="relative group">
          <img 
            src={photo.url} 
            alt={`Asset ${photo.id}`}
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            onClick={() => handleDeletePhoto(photo.id)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>

    {/* Photo Upload Button */}
    <button
      type="button"
      onClick={() => setShowPhotoUpload(true)}
      className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
    >
      <SafeIcon icon={FiCamera} className="w-5 h-5 text-gray-400" />
      <span className="text-gray-600">Add Photos</span>
    </button>

    {/* Photo Requirements */}
    <p className="text-sm text-gray-500">
      {!asset && '* At least one photo is required. '}
      Upload clear photos of the asset from multiple angles.
    </p>
  </div>
</div>

// Add photo upload modal
{showPhotoUpload && (
  <UniversalPhotoUpload
    type="inventory"
    title={`Upload Photos - ${asset?.assetNumber || 'New Asset'}`}
    onPhotoTaken={handlePhotoTaken}
    onClose={() => setShowPhotoUpload(false)}
    maxPhotos={5}
  />
)}

// Update form validation
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.assetNumber.trim()) {
    newErrors.assetNumber = 'Asset number is required';
  }
  
  // Add photo validation for new assets
  if (!asset && assetPhotos.length === 0) {
    newErrors.photos = 'At least one photo is required';
  }
  
  // ... rest of your validation logic
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// Update handleSubmit to include photos
const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateForm()) {
    toast.error('Please fix the errors before submitting');
    return;
  }

  const assetData = {
    ...formData,
    photos: assetPhotos,
    // ... other asset data
  };

  onSave(assetData);
  onClose();
};
```