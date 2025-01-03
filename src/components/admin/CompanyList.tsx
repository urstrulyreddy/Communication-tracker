import { Company, Communication } from '../../types';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { isAfter, isSameDay} from 'date-fns';
import { Tooltip } from '../ui/Tooltip';

interface CompanyListProps {
  companies: Company[];
  selectedCompanyId?: string;
  onSelect: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function CompanyList({ 
  companies, 
  selectedCompanyId,
  onSelect, 
  onEdit, 
  onDelete 
}: CompanyListProps) {
  const { communications } = useStore();

  const getCompanyStatus = (companyId: string) => {
    const companyComms = communications
      .filter(c => c.companyId === companyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (companyComms.length === 0) return 'default';

    const lastComm = companyComms[0];
    const company = companies.find(c => c.id === companyId);
    if (!company) return 'default';

    const nextDueDate = new Date(lastComm.date);
    nextDueDate.setDate(nextDueDate.getDate() + company.communicationPeriodicity);

    const today = new Date();
    
    if (isAfter(today, nextDueDate)) {
      return 'overdue';
    } else if (isSameDay(today, nextDueDate)) {
      return 'due';
    }
    return 'default';
  };

  const getLastCommunication = (companyId: string): Communication | null => {
    return communications
      .filter(c => c.companyId === companyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
  };

  const columns = [
    {
      header: 'Company',
      accessorKey: 'name',
      cell: (info: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(info.row.original);
          }}
          className="text-left font-medium text-indigo-600 hover:text-indigo-900"
        >
          {info.getValue()}
        </button>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'location',
    },
    {
      header: 'Periodicity',
      accessorKey: 'communicationPeriodicity',
      cell: (info: any) => `${info.getValue()} days`,
    },
    {
      header: 'Last Communication',
      cell: (info: any) => {
        const lastComm = getLastCommunication(info.row.original.id);
        if (!lastComm) return 'No communications';

        return (
          <Tooltip 
            content={
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-900">{lastComm.type}</span>
                  <span className="text-xs text-gray-500">{formatDate(lastComm.date)}</span>
                </div>
                {lastComm.notes && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Notes:</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {lastComm.notes}
                    </p>
                  </div>
                )}
                {lastComm.contactDetails && (
                  <div className="border-t pt-2 mt-2">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Contact Details:</h4>
                    <div className="space-y-1">
                      {lastComm.contactDetails.email && (
                        <p className="text-sm text-gray-700">
                          Email: {lastComm.contactDetails.email}
                        </p>
                      )}
                      {lastComm.contactDetails.phone && (
                        <p className="text-sm text-gray-700">
                          Phone: {lastComm.contactDetails.phone}
                        </p>
                      )}
                      {lastComm.contactDetails.linkedinProfile && (
                        <p className="text-sm text-gray-700">
                          LinkedIn: {lastComm.contactDetails.linkedinProfile}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            }
          >
            <div className="cursor-help flex items-center gap-2">
              <span>{new Date(lastComm.date).toLocaleDateString()}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                {lastComm.type}
              </span>
            </div>
          </Tooltip>
        );
      },
    },
    {
      header: 'Actions',
      cell: (info: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(info.row.original)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(info.row.original.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={companies}
      columns={columns}
      className="min-w-full"
      rowClassName={(row: any) => {
        const status = getCompanyStatus(row.original.id);
        const statusClasses = {
          overdue: 'bg-red-50',
          due: 'bg-yellow-50',
          default: ''
        };
        return `${statusClasses[status]} ${row.original.id === selectedCompanyId ? 'bg-indigo-50' : ''}`;
      }}
    />
  );
}