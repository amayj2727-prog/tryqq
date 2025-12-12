import React, { useState } from 'react';
import { Plus, ShoppingBag, LogOut, Crown, Search, Zap, Leaf, Utensils, ShoppingCart, MapPin, Bell } from 'lucide-react';
import CartCard from './components/CartCard';
import CreateCart from './components/CreateCart';
import CartDetail from './components/CartDetail';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import { PoolCart, User, CartRequest, Vendor } from './types';
import { MOCK_CARTS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'HOME' | 'DETAIL' | 'ADMIN'>('HOME');
  const [activeCartId, setActiveCartId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalDefaultMaxSaver, setCreateModalDefaultMaxSaver] = useState(false);
  
  const [carts, setCarts] = useState<PoolCart[]>(MOCK_CARTS);
  const [requests, setRequests] = useState<CartRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories for Filter Chips
  const categories = [
    { id: 'All', label: 'All', icon: null },
    { id: 'Instamart', label: 'Instamart', icon: ShoppingCart },
    { id: 'Zepto', label: 'Zepto', icon: Zap },
    { id: 'Dominos', label: 'Dominos', icon: Utensils },
    { id: 'Veg', label: 'Veg Only', icon: Leaf },
    { id: 'Saver', label: 'Max Saver', icon: Crown },
  ];

  // Auth Handling
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setView('ADMIN');
    } else {
      setView('HOME');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('HOME');
    setActiveCartId(null);
    setSearchQuery('');
    setActiveCategory('All');
  };

  // Cart / Request Handling
  const handleCreateOrRequest = (cartData: PoolCart, duration: number) => {
    if (currentUser?.role === 'ADMIN') {
        // Admin creates immediately
        setCarts([cartData, ...carts]);
        setActiveCartId(cartData.id);
        setView('DETAIL');
    } else {
        // User creates a request
        const newRequest: CartRequest = {
            id: Math.random().toString(36).substr(2, 9),
            requester: currentUser!,
            vendor: cartData.vendor,
            location: cartData.location,
            targetAmount: cartData.targetAmount,
            duration: duration,
            timestamp: Date.now(),
            isVeg: cartData.isVeg,
            isMaxSaver: cartData.isMaxSaver
        };
        setRequests([newRequest, ...requests]);
        alert("Request submitted! An Admin will review it shortly.");
    }
    setShowCreateModal(false);
    setCreateModalDefaultMaxSaver(false);
  };

  const handleUpdateCart = (updatedCart: PoolCart) => {
    setCarts(carts.map(c => c.id === updatedCart.id ? updatedCart : c));
  };

  // Admin Actions
  const handleApproveRequest = (req: CartRequest) => {
      const newCart: PoolCart = {
          id: req.id,
          host: req.requester,
          vendor: req.vendor,
          location: req.location,
          targetAmount: req.targetAmount,
          currentAmount: 0,
          expiresAt: Date.now() + req.duration * 60 * 1000, // Start timer now
          items: [],
          status: 'OPEN',
          isVeg: req.isVeg,
          isMaxSaver: req.isMaxSaver
      };
      setCarts([newCart, ...carts]);
      setRequests(requests.filter(r => r.id !== req.id));
  };

  const handleRejectRequest = (reqId: string) => {
      setRequests(requests.filter(r => r.id !== reqId));
  };

  const openCreateModal = (isMaxSaver: boolean = false) => {
      setCreateModalDefaultMaxSaver(isMaxSaver);
      setShowCreateModal(true);
  }

  // Filter Logic
  const filteredCarts = carts.filter(cart => {
    const matchesSearch = cart.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cart.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory === 'Veg') matchesCategory = !!cart.isVeg;
    else if (activeCategory === 'Saver') matchesCategory = !!cart.isMaxSaver;
    else if (activeCategory !== 'All') matchesCategory = cart.vendor === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // 1. Auth Guard
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const currentCart = carts.find(c => c.id === activeCartId);

  // 2. Admin Dashboard
  if (currentUser.role === 'ADMIN' && view === 'ADMIN') {
    return (
      <AdminDashboard 
        carts={carts}
        requests={requests}
        adminUser={currentUser}
        onLogout={handleLogout}
        onViewCart={(id) => {
          setActiveCartId(id);
          setView('DETAIL');
        }}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        onCreateNew={() => openCreateModal(false)}
      />
    );
  }

  // 3. Cart Detail View
  if (view === 'DETAIL' && currentCart) {
    return (
      <CartDetail 
        cart={currentCart} 
        currentUser={currentUser}
        onBack={() => setView(currentUser.role === 'ADMIN' ? 'ADMIN' : 'HOME')}
        onUpdateCart={handleUpdateCart}
      />
    );
  }

  // 4. Standard User Home Screen
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* Top Bar with Blur Effect */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
         <div className="flex justify-between items-center max-w-md mx-auto">
             <div className="flex flex-col">
                 <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Current Location</span>
                 <div className="flex items-center gap-1 text-indigo-900 font-bold text-sm cursor-pointer hover:text-indigo-600 transition-colors">
                     <MapPin className="w-4 h-4 text-indigo-600" />
                     Hostel Block A <span className="text-gray-400 text-xs">▼</span>
                 </div>
             </div>
             <div className="flex items-center gap-3">
                 <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                     <Bell className="w-5 h-5 text-gray-600" />
                     <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                 </button>
                 <div onClick={handleLogout} className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 cursor-pointer">
                     <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white" />
                 </div>
             </div>
         </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6">
        
        {/* Welcome Section */}
        <div className="mb-6 animate-fade-in">
           <h1 className="text-2xl font-bold text-gray-900 leading-tight">
               Hello, {currentUser.name.split(' ')[0]}! 👋 <br/>
               <span className="text-gray-400 font-normal text-lg">What are we pooling today?</span>
           </h1>
        </div>

        {/* Hero Banner with Gradient & Pattern */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 mb-6 relative overflow-hidden animate-slide-up group cursor-pointer transition-transform active:scale-[0.98]" onClick={() => openCreateModal(false)}>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold">Save on delivery fees</span>
                </div>
                <h2 className="font-bold text-xl mb-1 leading-snug">Start a New Pool</h2>
                <p className="text-indigo-100 text-sm mb-4 opacity-90">Host a cart and let nearby students join in!</p>
                <div className="bg-white text-indigo-700 text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg group-hover:bg-indigo-50 transition-colors">
                    Request Now <Plus className="w-4 h-4" />
                </div>
            </div>
            
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-xl translate-y-10 -translate-x-10"></div>
            <ShoppingBag className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search 'Zepto' or 'Block A'..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-shadow hover:shadow-md"
          />
        </div>

        {/* Categories / Chips */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const Icon = cat.icon;
                return (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
                            flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300
                            ${isActive 
                                ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 shadow-sm'}
                        `}
                    >
                        {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />}
                        {cat.label}
                    </button>
                );
            })}
        </div>

        {/* Live Carts Section Header */}
        <div className="flex items-center justify-between mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
           <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
               Nearby Active Pools
           </h3>
           {filteredCarts.length > 0 && (
               <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   {filteredCarts.length} Live
               </span>
           )}
        </div>

        {/* Carts List Grid */}
        <div className="grid grid-cols-1 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {filteredCarts.map((cart, idx) => (
            <div key={cart.id} style={{ animationDelay: `${0.1 * idx}s` }} className="animate-slide-up">
                <CartCard 
                  cart={cart} 
                  showHostInfo={false}
                  onClick={(id) => {
                    setActiveCartId(id);
                    setView('DETAIL');
                  }} 
                />
            </div>
          ))}

          {filteredCarts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-1">No pools found</h3>
              <p className="text-gray-400 text-xs px-10">
                  {searchQuery 
                    ? `We couldn't find any pools matching "${searchQuery}".` 
                    : "There are no active pools right now. Why not start one?"}
              </p>
              {!searchQuery && (
                  <button 
                    onClick={() => openCreateModal(false)}
                    className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                  >
                      Start a Pool
                  </button>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Enhanced Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 group">
          <button 
            onClick={() => openCreateModal(false)}
            className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group-hover:bg-indigo-600 animate-slide-up"
          >
              <Plus className="w-7 h-7" />
          </button>
          {/* Tooltip */}
          <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              New Request
          </span>
      </div>

      {showCreateModal && (
        <CreateCart 
          currentUser={currentUser}
          mode={currentUser.role === 'ADMIN' ? 'CREATE' : 'REQUEST'}
          defaultMaxSaver={createModalDefaultMaxSaver}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateOrRequest}
        />
      )}
    </div>
  );
};

export default App;