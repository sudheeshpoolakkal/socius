import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ExportData from '../../components/ExportData';

// SVG Icons
const DoctorIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AppointmentIcon = () => (
  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PatientIcon = () => (
  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const EarningsIcon = () => (
  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HospitalIcon = () => (
  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
  </svg>
);

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { currencySymbol, slotDateFormat } = useContext(AppContext);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  // Mock data for analytics - In production, this should come from the backend
  const weeklyData = [
    { name: 'Mon', appointments: 12, earnings: 2400, patients: 8 },
    { name: 'Tue', appointments: 19, earnings: 3800, patients: 14 },
    { name: 'Wed', appointments: 15, earnings: 3000, patients: 11 },
    { name: 'Thu', appointments: 22, earnings: 4400, patients: 17 },
    { name: 'Fri', appointments: 28, earnings: 5600, patients: 21 },
    { name: 'Sat', appointments: 18, earnings: 3600, patients: 13 },
    { name: 'Sun', appointments: 10, earnings: 2000, patients: 7 },
  ];

  const monthlyData = [
    { name: 'Week 1', appointments: 85, earnings: 17000, patients: 62 },
    { name: 'Week 2', appointments: 92, earnings: 18400, patients: 68 },
    { name: 'Week 3', appointments: 78, earnings: 15600, patients: 58 },
    { name: 'Week 4', appointments: 105, earnings: 21000, patients: 75 },
  ];

  const appointmentStatusData = [
    { name: 'Completed', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.7) : 0, color: '#10b981' },
    { name: 'Pending', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.2) : 0, color: '#f59e0b' },
    { name: 'Cancelled', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.1) : 0, color: '#ef4444' },
  ];

  const topDoctorsData = [
    { name: 'Dr. Smith', appointments: 45, earnings: 9000 },
    { name: 'Dr. Johnson', appointments: 38, earnings: 7600 },
    { name: 'Dr. Williams', appointments: 35, earnings: 7000 },
    { name: 'Dr. Brown', appointments: 32, earnings: 6400 },
    { name: 'Dr. Davis', appointments: 28, earnings: 5600 },
  ];

  const hospitalPerformanceData = [
    { name: 'City Hospital', doctors: 25, appointments: 180, rating: 4.5 },
    { name: 'Care Medical', doctors: 18, appointments: 145, rating: 4.3 },
    { name: 'Health Plus', doctors: 22, appointments: 165, rating: 4.7 },
    { name: 'Metro Hospital', doctors: 15, appointments: 120, rating: 4.2 },
  ];

  const data = selectedPeriod === 'week' ? weeklyData : monthlyData;

  return (
    dashData && (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        {/* Header with Export Options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Platform overview and analytics</p>
          </div>
          <div className="flex gap-2">
            <ExportData 
              data={[
                { metric: 'Doctors', value: dashData.doctors },
                { metric: 'Appointments', value: dashData.appointments },
                { metric: 'Patients', value: dashData.patients },
                { metric: 'Earnings', value: dashData.earnings },
                { metric: 'Hospitals', value: dashData.hospitals }
              ]} 
              filename="admin-dashboard" 
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{dashData.doctors}</p>
            <p className="text-xs text-gray-500 mt-1">Doctors</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{dashData.appointments}</p>
            <p className="text-xs text-gray-500 mt-1">Appointments</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{dashData.patients}</p>
            <p className="text-xs text-gray-500 mt-1">Patients</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{currencySymbol}{dashData.earnings}</p>
            <p className="text-xs text-gray-500 mt-1">Earnings</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{dashData.hospitals}</p>
            <p className="text-xs text-gray-500 mt-1">Hospitals</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedPeriod === 'week'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedPeriod === 'month'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Month
          </button>
        </div>

        {/* Analytics Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Appointments Trend */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-6">Appointments Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorAppointments)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-6">Earnings Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value) => [`${currencySymbol}${value}`, 'Earnings']}
                />
                <Bar dataKey="earnings" fill="#eab308" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Appointment Status Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-6">Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '11px' }}
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performing Doctors */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 lg:col-span-2">
            <h3 className="text-base font-medium text-gray-900 mb-6">Top Doctors</h3>
            <div className="space-y-3">
              {topDoctorsData.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{doctor.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Appointments</p>
                      <p className="font-semibold text-gray-900 text-sm">{doctor.appointments}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Earnings</p>
                      <p className="font-semibold text-green-600 text-sm">{currencySymbol}{doctor.earnings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Performance */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-6">Hospital Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hospitalPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="doctors" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="appointments" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-900">Latest Bookings</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div className="flex items-center px-6 py-4 hover:bg-gray-50/50 transition-colors" key={index}>
                  <img className="w-9 h-9 rounded-xl object-cover" src={item.docData?.image || '/doctor-icon.png'} alt={item.docData?.name || 'Doctor'} />
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.docData?.name || 'Doctor Name'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{slotDateFormat(item.slotDate)}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-4">
                    {item.cancelled ? (
                      <span className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium">Completed</span>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No appointments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;