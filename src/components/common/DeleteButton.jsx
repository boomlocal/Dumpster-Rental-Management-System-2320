import React, {useState} from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const {FiTrash2} = FiIcons;

const DeleteButton = ({onDelete, itemName='item', itemIdentifier='', buttonSize='normal', // 'normal' or 'small'
className=''}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const buttonClasses = buttonSize === 'small' 
    ? 'p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors' 
    : 'flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ' + className;

  return (
    <>
      <button 
        onClick={() => setShowConfirmation(true)} 
        className={buttonClasses}
        title={`Delete ${itemName}`}
      >
        <SafeIcon icon={FiTrash2} className={buttonSize === 'small' ? "w-4 h-4" : "w-5 h-5"} />
        {buttonSize !== 'small' && <span>Delete</span>}
      </button>
      <DeleteConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onDelete={onDelete}
        itemName={itemName}
        itemIdentifier={itemIdentifier}
      />
    </>
  );
};

export default DeleteButton;