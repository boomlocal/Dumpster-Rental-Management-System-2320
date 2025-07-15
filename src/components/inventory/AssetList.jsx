```jsx
// Add to the existing imports
import AssetPhotoViewer from './AssetPhotoViewer';
import UniversalPhotoUpload from '../photos/UniversalPhotoUpload';

// Add to component state
const [showPhotoViewer, setShowPhotoViewer] = useState(false);
const [showPhotoUpload, setShowPhotoUpload] = useState(false);
const [selectedAsset, setSelectedAsset] = useState(null);

// Add photo handling functions
const handleViewPhotos = (asset) => {
  setSelectedAsset(asset);
  setShowPhotoViewer(true);
};

const handleAddPhotos = (asset) => {
  setSelectedAsset(asset);
  setShowPhotoUpload(true);
};

const handlePhotoTaken = async (photoData) => {
  // Update the asset with the new photo
  const updatedAsset = {
    ...selectedAsset,
    photos: [...(selectedAsset.photos || []), photoData]
  };
  onUpdateAsset(updatedAsset);
  toast.success('Photo added successfully');
};

const handleDeletePhoto = async (photoId) => {
  if (!selectedAsset) return;
  
  const updatedPhotos = selectedAsset.photos.filter(p => p.id !== photoId);
  const updatedAsset = {
    ...selectedAsset,
    photos: updatedPhotos
  };
  onUpdateAsset(updatedAsset);
  toast.success('Photo deleted successfully');
  
  // Close photo viewer if no photos left
  if (updatedPhotos.length === 0) {
    setShowPhotoViewer(false);
  }
};

// Add to the asset card JSX
<div className="flex items-center space-x-2">
  <button
    onClick={() => handleViewPhotos(asset)}
    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    title="View Photos"
  >
    <SafeIcon icon={FiCamera} className="w-5 h-5" />
  </button>
  
  {/* Photo count badge */}
  {asset.photos?.length > 0 && (
    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
      {asset.photos.length} photos
    </span>
  )}
</div>

// Add at the end of the component
{showPhotoViewer && selectedAsset && (
  <AssetPhotoViewer
    photos={selectedAsset.photos || []}
    assetNumber={selectedAsset.assetNumber}
    onClose={() => setShowPhotoViewer(false)}
    onDelete={handleDeletePhoto}
    canDelete={true}
    onAddPhotos={() => {
      setShowPhotoViewer(false);
      setShowPhotoUpload(true);
    }}
  />
)}

{showPhotoUpload && selectedAsset && (
  <UniversalPhotoUpload
    type="inventory"
    title={`Upload Photos - ${selectedAsset.assetNumber}`}
    onPhotoTaken={handlePhotoTaken}
    onClose={() => setShowPhotoUpload(false)}
    maxPhotos={5}
  />
)}
```