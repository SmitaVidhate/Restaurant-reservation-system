import { createClient } from '@supabase/supabase-js'

// Note: In a real application, these would be environment variables
const supabaseUrl = 'https://your-project-url.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data and functions for demonstration
export const mockTables = [
  { id: 1, name: 'Table 1', capacity: 2, location: 'Window', available: true },
  { id: 2, name: 'Table 2', capacity: 4, location: 'Main Floor', available: true },
  { id: 3, name: 'Table 3', capacity: 6, location: 'Private Room', available: false },
  { id: 4, name: 'Table 4', capacity: 2, location: 'Bar Area', available: true },
  { id: 5, name: 'Table 5', capacity: 8, location: 'Private Room', available: true },
  { id: 6, name: 'Table 6', capacity: 4, location: 'Patio', available: true },
];

export const mockReservations = [
  {
    id: 1,
    table_id: 3,
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '555-1234',
    date: '2025-01-15',
    time_slot: '19:00',
    party_size: 4,
    status: 'confirmed',
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 2,
    table_id: 2,
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    customer_phone: '555-5678',
    date: '2025-01-15',
    time_slot: '20:00',
    party_size: 2,
    status: 'confirmed',
    created_at: '2025-01-10T11:00:00Z',
  },
];

export const mockTimeSlots = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

// Mock functions to simulate database operations
export const mockSupabaseOperations = {
  getTables: async () => {
    return { data: mockTables, error: null };
  },
  
  getReservations: async () => {
    return { data: mockReservations, error: null };
  },
  
  createReservation: async (reservation: any) => {
    const newReservation = {
      id: Date.now(),
      ...reservation,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };
    mockReservations.push(newReservation);
    return { data: newReservation, error: null };
  },
  
  updateReservation: async (id: number, updates: any) => {
    const index = mockReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReservations[index] = { ...mockReservations[index], ...updates };
      return { data: mockReservations[index], error: null };
    }
    return { data: null, error: 'Reservation not found' };
  },
  
  deleteReservation: async (id: number) => {
    const index = mockReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReservations.splice(index, 1);
      return { data: null, error: null };
    }
    return { data: null, error: 'Reservation not found' };
  },
};