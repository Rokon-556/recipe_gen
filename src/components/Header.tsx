import React from 'react';
import { ChefHat, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChefHat size={32} className="text-white" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Recipe Visualizer</h1>
            <p className="text-sm text-orange-100">Create branded recipe images with action figures</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-orange-100 hover:text-white transition-colors cursor-pointer">About</span>
            <span className="text-orange-100 hover:text-white transition-colors cursor-pointer">Features</span>
            <span className="text-orange-100 hover:text-white transition-colors cursor-pointer">Contact</span>
          </div>
          {userEmail && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-orange-100">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;