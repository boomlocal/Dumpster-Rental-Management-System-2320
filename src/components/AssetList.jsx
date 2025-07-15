import React, { useState } from 'react'
import AssetModal from './AssetModal'
import { FiPlus } from 'react-icons/fi'

function AssetList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [assets, setAssets] = useState([])

  const handleAddAsset = (newAsset) => {
    setAssets([...assets, {...newAsset, id: Date.now()}])
    setIsModalOpen(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Assets</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Add Asset
        </button>
      </div>

      {/* Asset List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map(asset => (
          <div key={asset.id} className="border p-4 rounded-lg">
            <h3 className="font-bold">{asset.name}</h3>
            <p className="text-gray-600">{asset.description}</p>
          </div>
        ))}
      </div>

      {/* Asset Modal */}
      {isModalOpen && (
        <AssetModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddAsset}
        />
      )}
    </div>
  )
}

export default AssetList