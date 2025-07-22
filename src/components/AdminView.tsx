import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, Settings, BarChart3, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { mockSupabaseOperations } from '../lib/supabase';
import { useReservation } from '../context/ReservationContext';
import { useNotification } from '../context/NotificationContext';

interface AdminViewProps {
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
}

interface Reservation {
  id: number;
  table_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date: string;
  time_slot: string;
  party_size: number;
  status: string;
  created_at: string;
}

const AdminView: React.FC<AdminViewProps> = ({ isAuthenticated, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservations' | 'tables'>('dashboard');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const { addNotification } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [reservationsResult, tablesResult] = await Promise.all([
        mockSupabaseOperations.getReservations(),
        mockSupabaseOperations.getTables(),
      ]);

      setReservations(reservationsResult.data || []);
      setTables(tablesResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      addNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(loginForm.email, loginForm.password);
      setLoginError('');
    } catch (error) {
      setLoginError('Invalid credentials');
    }
  };

  const handleUpdateReservation = async (id: number, updates: Partial<Reservation>) => {
    try {
      const { data, error } = await mockSupabaseOperations.updateReservation(id, updates);
      if (error) throw error;
      
      setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
      addNotification('Reservation updated successfully', 'success');
      setEditingReservation(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
      addNotification('Failed to update reservation', 'error');
    }
  };

  const handleDeleteReservation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    
    try {
      const { error } = await mockSupabaseOperations.deleteReservation(id);
      if (error) throw error;
      
      setReservations(prev => prev.filter(r => r.id !== id));
      addNotification('Reservation deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      addNotification('Failed to delete reservation', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600 mt-2">Access the restaurant management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="admin@bellavista.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter your password"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Demo Credentials:</strong><br />
              Email: admin@smitarestaurant.com<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  const todayReservations = reservations.filter(r => r.date === selectedDate);
  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  const totalGuests = reservations.reduce((sum, r) => sum + r.party_size, 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
            <p className="text-gray-600">Manage reservations, tables, and restaurant operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Today's Date</p>
              <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'reservations', label: 'Reservations', icon: Calendar },
          { id: 'tables', label: 'Tables', icon: MapPin },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-5 w-5 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                  <p className="text-3xl font-bold text-gray-900">{totalReservations}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-gray-900">{confirmedReservations}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Guests</p>
                  <p className="text-3xl font-bold text-gray-900">{totalGuests}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Tables</p>
                  <p className="text-3xl font-bold text-gray-900">{tables.filter(t => t.available).length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Today's Reservations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Today's Reservations</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {todayReservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reservations for this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayReservations.map(reservation => (
                  <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{reservation.customer_name}</h3>
                          <p className="text-sm text-gray-600">
                            {reservation.time_slot} • {reservation.party_size} people • Table {tables.find(t => t.id === reservation.table_id)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Reservations</h2>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Table</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Party Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(reservation => (
                  <tr key={reservation.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.customer_name}</p>
                        <p className="text-sm text-gray-600">{reservation.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{new Date(reservation.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{reservation.time_slot}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{tables.find(t => t.id === reservation.table_id)?.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{reservation.party_size}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingReservation(reservation)}
                          className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Table Management</h2>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Table
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
              <div key={table.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{table.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    table.available 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {table.available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity: {table.capacity} people
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location: {table.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button className="text-amber-600 hover:text-amber-700 font-medium text-sm">
                    <Edit2 className="h-4 w-4 inline mr-1" />
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                    <Trash2 className="h-4 w-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Reservation Modal */}
      {editingReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Reservation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingReservation.status}
                  onChange={(e) => setEditingReservation(prev => prev ? {...prev, status: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setEditingReservation(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateReservation(editingReservation.id, { status: editingReservation.status })}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;