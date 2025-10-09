import React from 'react';
import { Package, Leaf, MapPin, Calendar, CheckCircle, Database } from 'lucide-react';
import { useCollections } from '../../contexts/CollectionsContext';

const Batches = () => {
  const { collections } = useCollections();

  // Collection Card Component
  const CollectionCard = ({ collection }) => {
    return (
      <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 hover:border-slate-500/70 transition-all duration-300 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{collection.herbName}</h3>
            <p className="text-sm text-slate-400">{collection.quantity} • {collection.location}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">Submitted</span>
          </div>
        </div>

        {/* Collection Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400 text-xs font-medium">COLLECTOR ID</span>
            </div>
            <p className="text-white font-bold text-sm">{collection.collectorId || 'COL 2024'}</p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">BATCH ID</span>
            </div>
            <p className="text-white font-bold text-sm">{collection.batchId || 'BAT 2024 001'}</p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-xs font-medium">COLLECTOR</span>
            </div>
            <p className="text-white font-bold text-sm">Junaid</p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-xs font-medium">STATUS</span>
            </div>
            <p className="text-green-400 font-bold text-sm">Verified</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400 text-xs font-medium">LOCATION</span>
            </div>
            <p className="text-white font-semibold text-sm">{collection.location}</p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-xs font-medium">SUBMISSION DATE</span>
            </div>
            <p className="text-white font-semibold text-sm">{collection.timestamp}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-8">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-60"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-emerald-300 bg-clip-text text-transparent mb-2">
                Batches
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Submitted collections ready for processing
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{collections.length}</div>
                <div className="text-sm text-gray-400">Total Batches</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-gray-500/20 rounded-2xl blur"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-12">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                No Collections Submitted Yet
              </h2>
              
              <p className="text-xl text-gray-300 font-medium">
                Submitted collections will appear here
              </p>
              
              <p className="text-gray-400 mt-4 max-w-md mx-auto">
                When collectors submit herb collection data, it will be displayed here for processing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batches;
