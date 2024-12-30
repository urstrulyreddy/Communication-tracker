import { Company } from '../../types';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Pencil, Trash2 } from 'lucide-react';

interface CompanyListProps {
  companies: Company[];
  selectedCompanyId?: string;
  onSelect: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export function CompanyList({ 
  companies, 
  selectedCompanyId,
  onSelect, 
  onEdit, 
  onDelete 
}: CompanyListProps) {
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
      rowClassName={(row: any) => 
        row.original.id === selectedCompanyId ? 'bg-indigo-50' : ''
      }
    />
  );
}