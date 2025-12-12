import React, { useEffect, useState } from 'react';
import { Clock, MapPin, ArrowRight, Leaf, Crown, User as UserIcon } from 'lucide-react';
import { PoolCart } from '../types';

interface CartCardProps {
  cart: PoolCart;
  showHostInfo?: boolean;
  onClick: (cartId: string) => void;
}

const VENDOR_LOGOS: Record<string, string> = {
  'Instamart': 'https://logo.clearbit.com/swiggy.com',
  'Blinkit': 'https://logo.clearbit.com/blinkit.com',
  'Zepto': 'https://logo.clearbit.com/zeptonow.com',
  'Dominos': 'https://logo.clearbit.com/dominos.co.in',
  'Swiggy': 'https://logo.clearbit.com/swiggy.com'
};

const CartCard: React.FC<CartCardProps> = ({ cart, showHostInfo = false, onClick }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = cart.expiresAt - now;
      if (diff <= 0) {
        setTimeLeft('Expired');
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    const calcProgress = Math.min(100, (cart.currentAmount / cart.targetAmount) * 100);
    setProgress(calcProgress);

    return () => clearInterval(timer);
  }, [cart]);

  // Visual Styles based on type
  const isVeg = cart.isVeg;
  const isMaxSaver = cart.isMaxSaver;

  let borderColor = "border-gray-100";
  if (isMaxSaver) borderColor = "border-yellow-400 border-2";
  else if (isVeg) borderColor = "border-green-400 border-2";

  return (
    <div 
      onClick={() => onClick(cart.id)}
      className={`bg-white p-4 rounded-xl shadow-sm ${borderColor} active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden`}
    >
      {/* Badges */}
      <div className="absolute top-0 right-0 flex gap-1 p-2">
         {isMaxSaver && (
             <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-yellow-200">
                 <Crown className="w-3 h-3" /> MAX SAVER
             </span>
         )}
         {isVeg && (
             <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-green-200">
                 <Leaf className="w-3 h-3" /> VEG ONLY
             </span>
         )}
      </div>

      <div className="flex justify-between items-start mb-3 mt-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-white flex items-center justify-center">
             {!imageError && VENDOR_LOGOS[cart.vendor] ? (
               <img 
                 src={VENDOR_LOGOS[cart.vendor]} 
                 alt={cart.vendor}
                 className="w-full h-full object-contain p-1"
                 onError={() => setImageError(true)}
               />
             ) : (
               <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                 {cart.vendor[0]}
               </div>
             )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{cart.vendor}</h3>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <MapPin className="w-3 h-3" />
              {cart.location}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>₹{cart.currentAmount} raised</span>
          <span>Goal: ₹{cart.targetAmount}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`${isVeg ? 'bg-green-500' : isMaxSaver ? 'bg-yellow-500' : 'bg-indigo-500'} h-full rounded-full transition-all duration-500`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
             <div className={`px-2 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 w-fit ${timeLeft === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                <Clock className="w-3 h-3" />
                {timeLeft}
             </div>
             {cart.currentAmount >= cart.targetAmount && (
                <p className="text-[10px] text-green-600 font-medium">Free delivery! 🎉</p>
             )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
            {showHostInfo ? (
                <>
                    <img src={cart.host.avatar} alt={cart.host.name} className="w-6 h-6 rounded-full border border-gray-200" />
                    <span className="text-xs text-gray-600">Hosted by <span className="font-medium text-gray-900">{cart.host.name}</span></span>
                </>
            ) : (
                <>
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="w-3 h-3 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-400 italic">Host hidden</span>
                </>
            )}
        </div>
        <div className="flex items-center gap-1 text-indigo-600 text-xs font-semibold">
          Join <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default CartCard;