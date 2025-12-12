import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Send, Plus, Leaf, Crown } from 'lucide-react';
import { Vendor, PoolCart, User } from '../types';

interface CreateCartProps {
  currentUser: User;
  mode: 'CREATE' | 'REQUEST';
  defaultMaxSaver?: boolean;
  onClose: () => void;
  onCreate: (cart: PoolCart, duration: number) => void;
}

const CreateCart: React.FC<CreateCartProps> = ({ currentUser, mode, defaultMaxSaver = false, onClose, onCreate }) => {
  const [vendor, setVendor] = useState<Vendor>(Vendor.INSTAMART);
  const [location, setLocation] = useState('Hostel Block A');
  const [duration, setDuration] = useState(15);
  const [targetAmount, setTargetAmount] = useState(defaultMaxSaver ? 500 : 200);
  const [isVeg, setIsVeg] = useState(false);
  const [isMaxSaver, setIsMaxSaver] = useState(defaultMaxSaver);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCart: PoolCart = {
      id: Math.random().toString(36).substr(2, 9),
      host: currentUser,
      vendor,
      location,
      targetAmount,
      currentAmount: 0,
      expiresAt: Date.now() + duration * 60 * 1000,
      items: [],
      status: 'OPEN',
      isVeg,
      isMaxSaver
    };
    onCreate(newCart, duration);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up sm:animate-fade-in ${isMaxSaver ? 'border-t-4 border-yellow-400' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'REQUEST' ? 'Request a Pool' : 'Start a Pool'}
              </h2>
              {isMaxSaver && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-200 flex items-center gap-1"><Crown className="w-3 h-3"/> MAX SAVER</span>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {mode === 'REQUEST' && (
           <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs mb-4 border border-blue-100">
             Admins will review your request. Once approved, other students can join.
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Vendor</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Vendor).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVendor(v)}
                  className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    vendor === v 
                      ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500' 
                      : 'border-gray-200 text-gray-600 hover:border-orange-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option>Hostel Block A</option>
                <option>Hostel Block B</option>
                <option>Girls Hostel 1</option>
                <option>Main Gate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timer (Mins)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={5}
                  max={60}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className={`w-full pl-8 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none ${isMaxSaver ? 'border-yellow-300 bg-yellow-50 focus:ring-2 focus:ring-yellow-500' : 'border-gray-200 focus:ring-2 focus:ring-orange-500'}`}
                />
              </div>
            </div>
          </div>

          {/* Special Toggles */}
          <div className="flex gap-4">
             <button
                type="button"
                onClick={() => setIsVeg(!isVeg)}
                className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm transition-colors ${isVeg ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
             >
                 <Leaf className="w-4 h-4" /> Veg Only
             </button>
             {!defaultMaxSaver && (
                <button
                    type="button"
                    onClick={() => {
                        setIsMaxSaver(!isMaxSaver);
                        setTargetAmount(!isMaxSaver ? 500 : 200);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-sm transition-colors ${isMaxSaver ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                    <Crown className="w-4 h-4" /> Max Saver
                </button>
             )}
          </div>

          <button
            type="submit"
            className={`w-full text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all mt-4 flex items-center justify-center gap-2 ${
                mode === 'REQUEST' 
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
            }`}
          >
            {mode === 'REQUEST' ? (
                <>Submit Request <Send className="w-4 h-4" /></>
            ) : (
                <>Create Pool <Plus className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCart;