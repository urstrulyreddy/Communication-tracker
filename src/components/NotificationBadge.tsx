import { Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { isAfter, isSameDay, parseISO } from 'date-fns';

export function NotificationBadge() {
  const { companies, communications } = useStore();
  
  const getDueCount = () => {
    const today = new Date();
    let count = 0;
    
    companies.forEach(company => {
      const lastComm = communications
        .filter(c => c.companyId === company.id)
        .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())[0];
        
      if (lastComm) {
        const nextDue = parseISO(lastComm.date);
        nextDue.setDate(nextDue.getDate() + company.communicationPeriodicity);
        
        if (isAfter(today, nextDue) || isSameDay(today, nextDue)) {
          count++;
        }
      }
    });
    
    return count;
  };

  const count = getDueCount();

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-gray-600" />
      {count > 0 && (
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-xs text-white">{count}</span>
        </div>
      )}
    </div>
  );
}