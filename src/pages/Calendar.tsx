import { useStore } from '../store/useStore';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';
import { CommunicationModal } from '../components/CommunicationModal';

export function Calendar() {
  const { companies, communications } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const events = communications.map(comm => {
    const company = companies.find(c => c.id === comm.companyId);
    return {
      title: `${company?.name} - ${comm.type}`,
      date: comm.date,
      backgroundColor: '#4F46E5',
      borderColor: '#4F46E5',
      extendedProps: {
        companyId: comm.companyId,
        type: comm.type,
        notes: comm.notes
      }
    };
  });

  const handleDateClick = (arg: { date: Date }) => {
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => {
          setSelectedCompanyId(info.event.extendedProps.companyId);
          setIsModalOpen(true);
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        height="auto"
      />

      {isModalOpen && (
        <CommunicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
            setSelectedCompanyId(null);
          }}
          companyId={selectedCompanyId}
        />
      )}
    </div>
  );
}