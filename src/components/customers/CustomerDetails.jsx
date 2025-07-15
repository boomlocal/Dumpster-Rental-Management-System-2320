```jsx
// Add this to CustomerDetails.jsx
import PhotoLibraryView from '../photos/PhotoLibraryView';

// Inside your component, add state for photo library visibility
const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);

// Add this button where appropriate in your JSX
<button
  onClick={() => setShowPhotoLibrary(true)}
  className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
>
  <SafeIcon icon={FiCamera} className="w-4 h-4" />
  <span>View Photos</span>
</button>

// Add this at the end of your JSX
{showPhotoLibrary && (
  <PhotoLibraryView
    photos={photos.filter(p => p.customerId === customer.id)}
    title={`Photos for ${customer.name}`}
    onClose={() => setShowPhotoLibrary(false)}
    onDeletePhoto={handleDeletePhoto}
    onUpdateNotes={handleUpdatePhotoNotes}
    canDownload={user?.role === 'admin'}
  />
)}
```