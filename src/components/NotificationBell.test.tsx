import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationBell } from './NotificationBell';
import { useStore } from '../store/useStore';
import { sampleCompanies, sampleCommunications } from '../mocks/sampleData';
import { vi } from 'vitest';

// Mock the store
vi.mock('../store/useStore', () => ({
  useStore: vi.fn(),
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('NotificationBell', () => {
  beforeEach(() => {
    (useStore as any).mockImplementation(() => ({
      companies: sampleCompanies,
      communications: sampleCommunications,
    }));
  });

  it('renders notification count correctly', () => {
    render(<NotificationBell />);
    const badge = screen.getByText(/\d+/);
    expect(badge).toBeInTheDocument();
  });

  it('shows notification dropdown when clicked', () => {
    render(<NotificationBell />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('displays overdue notifications', () => {
    render(<NotificationBell />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText(/Overdue/)).toBeInTheDocument();
  });
}); 