import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, Settings, BarChart3, Grid3x3, Bell, Menu } from 'lucide-react';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import MenuView from './components/MenuView';
import { supabase } from './lib/supabase';
import { ReservationProvider } from './context/ReservationContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin' | 'menu'>('customer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (!session && (currentView === 'admin')) {
          setCurrentView('customer');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [currentView]);

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setCurrentView('admin');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('customer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <ReservationProvider>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-amber-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Grid3x3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Smita Restaurant</h1>
                    <p className="text-sm text-gray-600">Premium Dining Experience</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentView('customer')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === 'customer'
                        ? 'bg-amber-100 text-amber-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="h-4 w-4 inline mr-2" />
                    Customer
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('menu')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === 'menu'
                        ? 'bg-amber-100 text-amber-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Menu className="h-4 w-4 inline mr-2" />
                    Menu
                  </button>
                  
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setCurrentView('admin')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          currentView === 'admin'
                            ? 'bg-amber-100 text-amber-700 font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Settings className="h-4 w-4 inline mr-2" />
                        Admin
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg transition-all"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setCurrentView('admin')}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
                    >
                      <Settings className="h-4 w-4 inline mr-2" />
                      Admin Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentView === 'customer' ? (
              <CustomerView />
            ) : currentView === 'menu' ? (
              <MenuView />
            ) : (
              <AdminView 
                isAuthenticated={isAuthenticated}
                onLogin={handleAdminLogin}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-amber-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      (555) 123-4567
                    </p>
                    <p className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      info@smitarestaurant.com
                    </p>
                    <p className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      123 Culinary Street, Food City
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hours</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
                    <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                    <p>Sunday: 4:00 PM - 9:00 PM</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-600 text-sm">
                    Experience exceptional dining at Smita Restaurant, where culinary artistry meets 
                    warm hospitality in an elegant atmosphere perfect for any occasion.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ReservationProvider>
    </NotificationProvider>
  );
}

export default App;