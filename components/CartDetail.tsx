import React, { useState } from 'react';
import { ArrowLeft, Plus, Check, ShieldCheck, User as UserIcon, Trash2, Eye } from 'lucide-react';
import { PoolCart, User, ParsedItem, CartItem } from '../types';
import SmartItemInput from './SmartItemInput';

interface CartDetailProps {
  cart: PoolCart;
  currentUser: User;
  onBack: () => void;
  onUpdateCart: (updatedCart: PoolCart) => void;
}

const CartDetail: React.FC<CartDetailProps> = ({ cart, currentUser, onBack, onUpdateCart }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);

  const isAdmin = currentUser.role === 'ADMIN';

  const addItem = (name: string, price: number) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      price,
      userId: currentUser.id,
      userName: currentUser.name
    };

    const updatedCart = {
      ...cart,
      currentAmount: cart.currentAmount + price,
      items: [...cart.items, newItem]
    };
    onUpdateCart(updatedCart);
  };

  const handleManualAdd = () => {
    if (newItemName && newItemPrice) {
      addItem(newItemName, Number(newItemPrice));
      setNewItemName('');
      setNewItemPrice('');
    }
  };

  const handleSmartItems = (items: ParsedItem[]) => {
    let totalAdded = 0;
    const newItems = items.map(item => {
      totalAdded += item.estimatedPrice;
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: item.name,
        price: item.estimatedPrice,
        userId: currentUser.id,
        userName: currentUser.name
      } as CartItem;
    });

    const updatedCart = {
      ...cart,
      currentAmount: cart.currentAmount + totalAdded,
      items: [...cart.items, ...newItems]
    };
    onUpdateCart(updatedCart);
  };

  const removeItem = (itemId: string, price: number) => {
     const updatedItems = cart.items.filter(i => i.id !== itemId);
     const updatedCart = {
         ...cart,
         currentAmount: Math.max(0, cart.currentAmount - price),
         items: updatedItems
     };
     onUpdateCart(updatedCart);
  };

  const myItems = cart.items.filter(i => i.userId === currentUser.id);
  const myTotal = myItems.reduce((sum, item) => sum + item.price, 0);
  const fee = 5; // Convenience fee

  const progressPercent = Math.min(100, (cart.currentAmount / cart.targetAmount) * 100);
  const remaining = Math.max(0, cart.targetAmount - cart.currentAmount);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className={`${isAdmin ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} px-4 py-3 shadow-sm flex items-center gap-3 sticky top-0 z-10 transition-colors`}>
        <button onClick={onBack} className={`p-2 -ml-2 rounded-full ${isAdmin ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
          <ArrowLeft className={`w-5 h-5 ${isAdmin ? 'text-white' : 'text-gray-700'}`} />
        </button>
        <div>
          <h1 className="font-bold leading-tight flex items-center gap-2">
            {cart.vendor} Pool
            {isAdmin && <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">ADMIN VIEW</span>}
          </h1>
          <p className={`text-xs ${isAdmin ? 'text-gray-400' : 'text-gray-500'}`}>{cart.location}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto p-4 ${!isAdmin ? 'pb-32' : 'pb-4'} no-scrollbar`}>
        {/* Progress Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-gray-500">Current Pool Total</p>
              <p className="text-2xl font-bold text-gray-900">₹{cart.currentAmount}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-600 font-medium">
                {remaining > 0 ? `Needs ₹${remaining} more` : 'Goal Reached!'}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${remaining === 0 ? 'bg-green-500' : 'bg-orange-500'}`} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Target: ₹{cart.targetAmount} for Free Delivery
          </p>
        </div>

        {/* Add Items Section - HIDDEN FOR ADMIN */}
        {!isAdmin && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Add Your Items</h3>
            
            <SmartItemInput onAddItems={handleSmartItems} />

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Item Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-[2] px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                onClick={handleManualAdd}
                disabled={!newItemName || !newItemPrice}
                className="bg-gray-900 text-white p-2.5 rounded-lg disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">
              {isAdmin ? 'All Items' : `Current Cart (${cart.items.length})`}
            </h3>
            {cart.items.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm italic">
                    Cart is empty.
                </div>
            )}
            {cart.items.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.userId === currentUser.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                             {item.userName.charAt(0)}
                         </div>
                         <div>
                             <p className="text-sm font-medium text-gray-900">{item.name}</p>
                             <div className="flex items-center gap-1">
                               <p className="text-[10px] text-gray-500">Added by {item.userId === currentUser.id ? 'You' : item.userName}</p>
                               {isAdmin && (
                                 <span className="text-[9px] bg-gray-100 px-1 rounded text-gray-500">ID: {item.userId}</span>
                               )}
                             </div>
                         </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 text-sm">₹{item.price}</span>
                        {/* Allow deletion if user owns item OR if user is admin */}
                        {(item.userId === currentUser.id || isAdmin) && (
                            <button onClick={() => removeItem(item.id, item.price)} className="text-red-400 hover:text-red-600" title="Remove Item">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Bottom Action Bar - HIDDEN FOR ADMIN */}
      {!isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-gray-600">Your Share: ₹{myTotal} + ₹{fee} fee</span>
                  <span className="font-bold text-xl text-gray-900">₹{myTotal > 0 ? myTotal + fee : 0}</span>
              </div>
              
              {myTotal > 0 ? (
                  <button 
                      onClick={() => setShowPayModal(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all"
                  >
                      <ShieldCheck className="w-5 h-5" />
                      Pay & Confirm
                  </button>
              ) : (
                  <div className="w-full bg-gray-100 text-gray-400 font-bold py-3.5 rounded-xl text-center cursor-not-allowed">
                      Add items to join
                  </div>
              )}
          </div>
        </div>
      )}

      {/* Mock Payment Modal */}
      {showPayModal && !isAdmin && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center animate-scale-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Simulated</h2>
                  <p className="text-gray-500 mb-6 text-sm">
                      In a real app, this would open your UPI app (GPay/PhonePe) to pay <b>₹{myTotal + fee}</b> to the host <b>{cart.host.name}</b>.
                  </p>
                  <button 
                    onClick={() => {
                        setShowPayModal(false);
                        onBack();
                    }}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl"
                  >
                      Done
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CartDetail;