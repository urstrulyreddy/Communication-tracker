# Communication Tracker Application

A React-based application for managing and tracking business communications with companies. Built with TypeScript, Tailwind CSS, and modern React patterns.

## Overview

The Communication Tracker helps organizations maintain consistent communication with their business contacts through:
- Automated tracking of communication schedules
- Multi-channel communication logging (LinkedIn, Email, Phone, etc.)
- Role-based access (Admin/User)
- Analytics and reporting
- Real-time notifications

## Features

### User Module
- **Dashboard View**
  - Grid-like company listing
  - Last 5 communications per company
  - Next scheduled communication
  - Color-coded status indicators
  - Multi-select companies for batch actions

- **Communication Management**
  - Log communications with date and type
  - Add detailed notes
  - Track contact information
  - Set communication periodicity

- **Notifications**
  - Overdue communications alerts
  - Due today reminders
  - Real-time status updates

### Admin Module
- Company management (CRUD operations)
- Communication method configuration
- User role management
- System settings

### Analytics & Reports
- Communication trends
- Success rate analysis
- Custom date range filtering
- Exportable reports

## Technical Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **Charts**: Recharts
- **UI Components**: Headless UI
- **Icons**: Lucide Icons
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)

## Installation

1. Clone the repository:

2. Install dependencies:

3. Create a `.env` file in the root directory:

4. Start the development server:

npm run dev






## Project Structure

├── components/ # Reusable components
│ ├── ui/ # Base UI components
│ ├── admin/ # Admin-specific components
│ └── layout/ # Layout components
├── pages/ # Page components
├── store/ # Zustand stores
├── types/ # TypeScript types
├── utils/ # Utility functions
├── mocks/ # Sample data
└── styles/ # Global styles


## Authentication

The application includes two user roles with demo credentials:

- **Admin User**
  - Email: admin@example.com
  - Password: admin123
  - Full system access

- **Regular User**
  - Email: user@example.com
  - Password: user123
  - Limited to communication logging and viewing

## Key Components

### Dashboard
- Company listing with status
- Communication history
- Quick actions
- Notification center

### Communication Modal
- Type selection
- Date picker
- Notes field
- Contact details

### Reports
- Date range selection
- Multiple chart types
- Export functionality

## Configuration

### Tailwind Configuration


## Known Limitations

1. **Browser Support**
   - Optimized for modern browsers
   - Limited IE support

2. **Performance**
   - Large datasets may impact performance
   - Recommended limit: 1000 companies

3. **Offline Functionality**
   - Limited offline support
   - Requires internet for most features

## Development Guidelines

1. **Code Style**
   - Use TypeScript strictly
   - Follow ESLint rules
   - Use functional components
   - Implement proper error handling

2. **Component Structure**
   - Keep components small and focused
   - Use composition over inheritance
   - Implement proper prop validation
   - Document complex logic

3. **State Management**
   - Use Zustand for global state
   - Local state for component-specific data
   - Implement proper error boundaries

## Deployment

1. Build the application: