# Smita Restaurant Management System

A comprehensive full-stack restaurant management system built with React, TypeScript, and Tailwind CSS for Smita Restaurant.

## Features

### Customer Features
- **Interactive Reservation System**: 3-step booking process (Date/Time → Table Selection → Customer Details)
- **Menu Browsing**: Beautiful menu cards with detailed descriptions, ratings, and dietary information
- **Real-time Availability**: Live table availability updates
- **Responsive Design**: Optimized for all devices

### Admin Features
- **Dashboard**: Comprehensive overview with statistics and analytics
- **Reservation Management**: View, edit, and manage all reservations
- **Table Management**: Configure tables, capacity, and availability
- **Real-time Updates**: Live reservation monitoring

### Technical Features
- **Concurrent Booking Protection**: Prevents double-booking with optimistic locking
- **Real-time Notifications**: Toast notifications and status updates
- **Modern UI/UX**: Elegant design with smooth animations
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Database Ready**: Supabase integration prepared
- **Deployment**: Netlify ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd smita-restaurant-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminView.tsx   # Admin dashboard
│   ├── CustomerView.tsx # Customer booking interface
│   └── MenuView.tsx    # Menu display
├── context/            # React contexts
│   ├── NotificationContext.tsx
│   └── ReservationContext.tsx
├── lib/                # Utilities and configurations
│   └── supabase.ts     # Database configuration
└── App.tsx             # Main application component
```

## Configuration

### Database Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Update the credentials in `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'your-project-url'
const supabaseAnonKey = 'your-anon-key'
```

### Admin Access
- Email: admin@smitarestaurant.com
- Password: admin123

## Deployment

The project is configured for easy deployment to Netlify:

```bash
npm run build
```

## Features in Detail

### Reservation System
- Multi-step booking process with validation
- Real-time table availability checking
- Automatic conflict resolution
- Email confirmation system

### Menu System
- Category-based filtering (Appetizers, Main Courses, Desserts, Beverages)
- Detailed item modals with ratings and dietary information
- Signature dish highlighting
- Chef's special section

### Admin Dashboard
- Real-time reservation monitoring
- Table management with capacity controls
- Reservation editing and status updates
- Analytics and reporting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@smitarestaurant.com or create an issue in the repository.