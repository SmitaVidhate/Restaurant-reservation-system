import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, CheckCircle, AlertCircle, Menu as MenuIcon } from 'lucide-react';
import { mockSupabaseOperations, mockTables, mockTimeSlots } from '../lib/supabase';
import { useReservation } from '../context/ReservationContext';
import { useNotification } from '../context/NotificationContext';

interface Table {
  id: number;
  name: string;
  capacity: number;
  location: string;
  available: boolean;
}

interface ReservationForm {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date: string;
  time_slot: string;
  party_size: number;
  table_id: number | null;
}

const CustomerView: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    date: '',
    time_slot: '',
    party_size: 2,
    table_id: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);

  const { addReservation } = useReservation();
  const { addNotification } = useNotification();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const { data, error } = await mockSupabaseOperations.getTables();
      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      console.error('Error loading tables:', error);
      addNotification('Error loading tables', 'error');
    }
  };

  const handleDateTimeSelection = () => {
    if (!selectedDate || !selectedTime) {
      addNotification('Please select both date and time', 'error');
      return;
    }
    setReservationForm(prev => ({
      ...prev,
      date: selectedDate,
      time_slot: selectedTime,
      party_size: partySize,
    }));
    setCurrentStep(2);
  };

  const handleTableSelection = (tableId: number) => {
    setSelectedTable(tableId);
    setReservationForm(prev => ({
      ...prev,
      table_id: tableId,
    }));
    setCurrentStep(3);
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await mockSupabaseOperations.createReservation(reservationForm);
      if (error) throw error;

      addReservation(data);
      setReservationComplete(true);
      addNotification('Reservation confirmed successfully!', 'success');
    } catch (error) {
      console.error('Error creating reservation:', error);
      addNotification('Failed to create reservation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetReservation = () => {
    setCurrentStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedTable(null);
    setPartySize(2);
    setReservationForm({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      date: '',
      time_slot: '',
      party_size: 2,
      table_id: null,
    });
    setReservationComplete(false);
  };

  const availableTables = tables.filter(table => 
    table.available && table.capacity >= partySize
  );

  const today = new Date().toISOString().split('T')[0];

  if (reservationComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservation Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your table has been reserved for {reservationForm.party_size} people on{' '}
            {new Date(reservationForm.date).toLocaleDateString()} at {reservationForm.time_slot}.
          </p>
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              A confirmation email has been sent to {reservationForm.customer_email}
            </p>
          </div>
          <button
            onClick={resetReservation}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Menu Teaser */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <MenuIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Explore Our Menu</h3>
              <p className="text-gray-600">Discover our award-winning dishes and signature creations</p>
            </div>
          </div>
          <button
            onClick={() => window.location.hash = 'menu'}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            View Menu
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep >= step ? 'text-amber-600' : 'text-gray-500'
              }`}>
                {step === 1 && 'Date & Time'}
                {step === 2 && 'Select Table'}
                {step === 3 && 'Your Details'}
              </span>
              {step < 3 && (
                <div className={`w-16 h-0.5 ml-4 ${
                  currentStep > step ? 'bg-amber-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Date & Time Selection */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-2" />
                Party Size
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                  <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <Clock className="h-4 w-4 inline mr-2" />
              Available Times
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {mockTimeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all ${
                    selectedTime === time
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleDateTimeSelection}
              disabled={!selectedDate || !selectedTime}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Table Selection
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Table Selection */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Table</h2>
          
          <div className="mb-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-amber-800">
              <strong>Reservation Details:</strong> {partySize} people on{' '}
              {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTables.map(table => (
              <div
                key={table.id}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedTable === table.id
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                }`}
                onClick={() => handleTableSelection(table.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{table.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {table.capacity}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {table.location}
                </div>
              </div>
            ))}
          </div>

          {availableTables.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tables available for your party size and selected time.</p>
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-4 px-6 py-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                Try Different Date/Time
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Back to Date & Time
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Customer Details */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
          
          <form onSubmit={handleSubmitReservation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={reservationForm.customer_name}
                  onChange={(e) => setReservationForm(prev => ({
                    ...prev,
                    customer_name: e.target.value
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={reservationForm.customer_email}
                  onChange={(e) => setReservationForm(prev => ({
                    ...prev,
                    customer_email: e.target.value
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={reservationForm.customer_phone}
                  onChange={(e) => setReservationForm(prev => ({
                    ...prev,
                    customer_phone: e.target.value
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Party Size:</strong> {partySize} people</p>
                <p><strong>Table:</strong> {tables.find(t => t.id === selectedTable)?.name}</p>
                <p><strong>Location:</strong> {tables.find(t => t.id === selectedTable)?.location}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
              >
                Back to Table Selection
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerView;