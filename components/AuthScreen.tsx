import React, { useState } from 'react';
import { ShoppingBag, UserPlus, LogIn, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Legacy/Quick Admin Access for demo purposes
    if (isLogin && username === 'admin' && password === 'admin') {
      onLogin({
        id: 'admin-master',
        name: 'Master Admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=1f2937&color=fff',
        rating: 5,
        role: 'ADMIN',
        username: 'admin'
      });
      return;
    }

    if (isLogin) {
      if (username && password) {
        // In a real app, we would fetch the user and check role from a database.
        // For this mock, we default to a standard user login.
        onLogin({
          id: username, 
          name: username,
          avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
          rating: 4.5,
          role: 'USER', 
          username
        });
      } else {
        setError('Please enter username and password');
      }
    } else {
      // Signup Logic
      if (username && password && name) {
        onLogin({
          id: Math.random().toString(36).substr(2, 9), // Unique ID generation
          name: name,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
          rating: 5.0,
          role: 'USER', // Always create as USER (Student)
          username
        });
      } else {
        setError('All fields are required');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden transition-all duration-500">
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
                <ShoppingBag className="w-8 h-8 text-white" />
             </div>
             <h1 className="text-3xl font-black text-white tracking-tight">PoolCart</h1>
             <p className="text-indigo-100 text-sm mt-2 font-medium">Split bills, save money.</p>
           </div>
           <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-10 animate-pulse-subtle"></div>
           <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-10 translate-y-10 animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Toggle Switch */}
          <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-xl">
             <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                Log In
             </button>
             <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                Sign Up
             </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 animate-slide-up">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Username / ID</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm"
                  placeholder={isLogin ? "username" : "choose_username"}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              {isLogin ? (
                <>Log In <LogIn className="w-4 h-4" /></>
              ) : (
                <>Create Account <UserPlus className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {isLogin && (
             <div className="mt-6 text-center">
                 <p className="text-xs text-gray-400">Quick Admin Access: admin / admin</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;