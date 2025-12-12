import React from 'react';
import { LogOut, LayoutDashboard, ShoppingBag, TrendingUp, Users, Check, X, Plus, Leaf, Crown } from 'lucide-react';
import { PoolCart, User, CartRequest } from '../types';
import CartCard from './CartCard';

interface AdminDashboardProps {
  carts: PoolCart[];
  requests: CartRequest[];
  adminUser: User;
  onLogout: () => void;
  onViewCart: (cartId: string) => void;
  onApproveRequest: (req: CartRequest) => void;
  onRejectRequest: (reqId: string) => void;
  onCreateNew: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  carts, 
  requests,
  adminUser, 
  onLogout, 
  onViewCart,
  onApproveRequest,
  onRejectRequest,
  onCreateNew
}) => {
  const totalVolume = carts.reduce((acc, cart) => acc + cart.currentAmount, 0);
  const activeUsers = new Set(carts.flatMap(c => c.items.map(i => i.userId))).size;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-gray-900 text-white px-6 py-4 sticky top-0 z-20 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Admin Console</h1>
              <p className="text-xs text-gray-400">Monitoring {carts.length} Active Pools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={onCreateNew}
               className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
             >
                <Plus className="w-4 h-4" />
                Create Pool
             </button>
            <button 
              onClick={onLogout}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Pending Requests Section */}
        {requests.length > 0 && (
            <div className="mb-8 animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Pending Requests <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">{requests.length}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requests.map(req => (
                        <div key={req.id} className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900">{req.vendor}</h3>
                                        {req.isVeg && <Leaf className="w-4 h-4 text-green-500" />}
                                        {req.isMaxSaver && <Crown className="w-4 h-4 text-yellow-500" />}
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{req.duration}m timer</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">📍 {req.location}</p>
                                <p className="text-xs text-gray-500 mb-4">Requested by <span className="font-medium text-gray-900">{req.requester.name}</span></p>
                                
                                <div className="flex gap-2 mt-2">
                                    <button 
                                        onClick={() => onRejectRequest(req.id)}
                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                    <button 
                                        onClick={() => onApproveRequest(req)}
                                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Pools</p>
                <h3 className="text-2xl font-bold text-gray-900">{carts.length}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Volume</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{totalVolume}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Participants</p>
                <h3 className="text-2xl font-bold text-gray-900">{activeUsers}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Carts */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Live Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carts.map(cart => (
              <div key={cart.id} className="relative group">
                <CartCard 
                  cart={cart} 
                  showHostInfo={true}
                  onClick={onViewCart}
                />
                <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Click to inspect
                </div>
              </div>
            ))}
          </div>
          {carts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No active pools at the moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;