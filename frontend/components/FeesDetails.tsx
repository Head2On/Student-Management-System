"use client";
import { useState } from 'react';
import { Search, Filter, Download, Calendar } from 'lucide-react';

export default function StudentFeeDetails() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const stats = [
    { icon: '⏰', label: 'Overdue amount', value: '$60,400' },
    { icon: '💰', label: 'Unpaid totals', value: '$60,400' },
    { icon: '💵', label: 'Total paid', value: '$60,400' },
    { icon: '📄', label: 'Scheduled for today', value: '05 invoices' }
  ];

  const feeRecords = [
    { 
      status: 'Paid', 
      date: '23.05.2023', 
      number: '#054', 
      student: 'Leslie Alexander', 
      total: '$2800', 
      remaining: '$0',
      statusColor: 'bg-green-100 text-green-700'
    },
    { 
      status: 'Overdue', 
      date: '23.05.2023', 
      number: '#054', 
      student: 'Leslie Alexander', 
      total: '$2800', 
      remaining: '$400',
      statusColor: 'bg-orange-100 text-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto font-domine">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Fees</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Search and Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter invoice number"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <button className="text-sm font-medium text-gray-700">All Invoices</button>
                <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">54</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <button className="text-sm font-medium text-gray-700">Unpaid</button>
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded">14</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <button className="text-sm font-medium text-gray-700">Draft</button>
                <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">3</span>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
              </button>
            </div>
          </div>

          {/* Filter Panel (Hidden by default) */}
          {showFilters && (
            <div className="bg-gray-100 rounded-xl p-6 mb-6 space-y-4 text-black ">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Customer</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Customers</option>
                    <option>Jane Cooper</option>
                    <option>Leslie Alexander</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Statuses</option>
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Overdue</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select date"
                      className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select date"
                      className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 uppercase">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 uppercase">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 uppercase">Number</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 uppercase">Student</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 uppercase">Total</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-600 uppercase">Remaining Fees</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {feeRecords.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${record.statusColor}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-800">{record.date}</td>
                    <td className="py-4 px-4 text-gray-800 font-medium">{record.number}</td>
                    <td className="py-4 px-4 text-gray-800">{record.student}</td>
                    <td className="py-4 px-4 text-gray-800 font-semibold">{record.total}</td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${record.remaining === '$0' ? 'text-green-600' : 'text-orange-600'}`}>
                        {record.remaining}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Download size={16} />
                          <span className="text-sm font-medium">Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}