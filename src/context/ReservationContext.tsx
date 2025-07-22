import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: number, updates: Partial<Reservation>) => void;
  deleteReservation: (id: number) => void;
  loading: boolean;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  const updateReservation = (id: number, updates: Partial<Reservation>) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteReservation = (id: number) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving real-time updates
      // In a real app, this would be handled by Supabase real-time subscriptions
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ReservationContext.Provider value={{
      reservations,
      addReservation,
      updateReservation,
      deleteReservation,
      loading,
    }}>
      {children}
    </ReservationContext.Provider>
  );
};