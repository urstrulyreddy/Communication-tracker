/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import { CommunicationType } from '../types';
import { format, subDays, parseISO, isWithinInterval } from 'date-fns';
import { Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DateRangePicker } from '../components/ui/DateRangePicker';
import { Card } from '../components/ui/Card';

export function Reports() {
  const { communications, companies } = useStore();
  const [dateRange, setDateRange] = useState<[Date, Date]>([subDays(new Date(), 30), new Date()]);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  // Filter communications based on selected filters
  const filteredCommunications = communications.filter(comm => {
    const dateMatches = isWithinInterval(parseISO(comm.date), {
      start: dateRange[0],
      end: dateRange[1]
    });
    const companyMatches = selectedCompany === 'all' || comm.companyId === selectedCompany;
    const methodMatches = selectedMethod === 'all' || comm.type === selectedMethod;
    return dateMatches && companyMatches && methodMatches;
  });

  // Communication Methods Distribution
  const communicationsByType = Object.values(CommunicationType).map(type => ({
    name: type,
    count: filteredCommunications.filter(c => c.type === type).length,
    responseRate: calculateResponseRate(type)
  }));

  // Overdue Communications Trend
  const overdueByDate = generateOverdueTrend();

  // Response Rate Calculation
  function calculateResponseRate(type: CommunicationType): number {
    const typeComms = filteredCommunications.filter(c => c.type === type);
    const responses = typeComms.filter(c => c.notes?.toLowerCase().includes('responded') || false);
    return typeComms.length ? (responses.length / typeComms.length) * 100 : 0;
  }

  // Generate Overdue Trend Data
  function generateOverdueTrend() {
    const dates = [];
    let currentDate = new Date(dateRange[0]);
    while (currentDate <= dateRange[1]) {
      dates.push({
        date: format(currentDate, 'MMM d'),
        overdue: companies.filter(company => {
          const lastComm = communications
            .filter(c => c.companyId === company.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          if (!lastComm) return false;
          
          const nextDue = new Date(lastComm.date);
          nextDue.setDate(nextDue.getDate() + company.communicationPeriodicity);
          return nextDue < currentDate;
        }).length
      });
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    return dates;
  }

  // Export Data
  const exportData = async (exportFormat: 'csv' | 'pdf') => {
    const data = filteredCommunications.map(comm => ({
      date: format(parseISO(comm.date), 'yyyy-MM-dd'),
      company: companies.find(c => c.id === comm.companyId)?.name,
      type: comm.type,
      notes: comm.notes
    }));

    if (exportFormat === 'csv') {
      const csv = convertToCSV(data);
      downloadFile(csv, 'communications.csv', 'text/csv');
    } else {
      console.log('PDF export to be implemented');
    }
  };

  const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

  // Add these new sections
  const successRateByCompany = useMemo(() => 
    companies.map(company => ({
      name: company.name,
      rate: calculateCompanySuccessRate(company.id)
    }))
  , [companies, communications]);

  const communicationTrends = useMemo(() => 
    generateCommunicationTrends()
  , [dateRange, communications]);

  function calculateCompanySuccessRate(companyId: string): number {
    const companyComms = filteredCommunications.filter(c => c.companyId === companyId);
    if (companyComms.length === 0) return 0;

    const responses = companyComms.filter(c => 
      c.notes?.toLowerCase().includes('responded') || false
    );
    return (responses.length / companyComms.length) * 100;
  }

  function generateCommunicationTrends() {
    const trends = [];
    let currentDate = new Date(dateRange[0]);
    
    while (currentDate <= dateRange[1]) {
      const dayComms = filteredCommunications.filter(comm => 
        format(parseISO(comm.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
      );

      trends.push({
        date: format(currentDate, 'MMM d'),
        total: dayComms.length,
        responded: dayComms.filter(c => 
          c.notes?.toLowerCase().includes('responded')
        ).length
      });

      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }
    
    return trends;
  }

  return (
    <div className="space-y-6 p-6 bg-white/50 backdrop-blur-sm rounded-lg">
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-lg">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Communication Analytics</h3>
            <div className="flex gap-4">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="all">All Methods</option>
                {Object.values(CommunicationType).map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
              <div className="flex gap-2">
                <Button onClick={() => exportData('csv')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => exportData('pdf')} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Communication Methods Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={communicationsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#4F46E5" name="Count" />
                  <Bar dataKey="responseRate" fill="#10B981" name="Response Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-4">Method Effectiveness</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={communicationsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {communicationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Overdue Trend */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Overdue Communications Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={overdueByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="overdue" stroke="#EF4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-6">Communication Activity Log</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommunications
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((comm) => (
                    <tr key={comm.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(parseISO(comm.date), 'PPp')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {companies.find(c => c.id === comm.companyId)?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {comm.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {comm.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            comm.notes?.toLowerCase().includes('responded')
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {comm.notes?.toLowerCase().includes('responded') ? 'Responded' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Analytics Sections */}
      <Card gradient>
        <Card.Header>
          <h3 className="text-lg font-medium">Company Success Rates</h3>
        </Card.Header>
        <Card.Content>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={successRateByCompany}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="rate" fill="#10B981" name="Success Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </Card.Content>
      </Card>

      <Card gradient>
        <Card.Header>
          <h3 className="text-lg font-medium">Communication Trends</h3>
        </Card.Header>
        <Card.Content>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={communicationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="total" stroke="#4F46E5" name="Total Communications" />
              <Line type="monotone" dataKey="responded" stroke="#10B981" name="Responses" />
            </LineChart>
          </ResponsiveContainer>
        </Card.Content>
      </Card>
    </div>
  );
}

// Helper functions for export
function convertToCSV(data: any[]) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  return [headers, ...rows].join('\n');
}

function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}