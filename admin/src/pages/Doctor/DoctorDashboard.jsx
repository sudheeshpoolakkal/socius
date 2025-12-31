import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ExportData from '../../components/ExportData';

// SVG Icons (Matching AdminDashboard)
const EarningsIcon = () => (
  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AppointmentIcon = () => (
  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
  </svg>
);

const PatientIcon = () => (
  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SlotsIcon = () => (
  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Consultation Mode Icons
const OnlineIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const OfflineIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, doctorSlots, getDoctorSlots } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    if (dToken) {
      getDashData();
      getDoctorSlots();
    }
  }, [dToken]);

  // Calculate total slots count
  const totalSlots = Object.values(doctorSlots).reduce((total, slots) => total + slots.length, 0);

  // Mock data for analytics
  const weeklyData = [
    { name: 'Mon', appointments: 5, earnings: 1000, patients: 4 },
    { name: 'Tue', appointments: 8, earnings: 1600, patients: 7 },
    { name: 'Wed', appointments: 6, earnings: 1200, patients: 5 },
    { name: 'Thu', appointments: 9, earnings: 1800, patients: 8 },
    { name: 'Fri', appointments: 12, earnings: 2400, patients: 10 },
    { name: 'Sat', appointments: 7, earnings: 1400, patients: 6 },
    { name: 'Sun', appointments: 4, earnings: 800, patients: 3 },
  ];

  const monthlyData = [
    { name: 'Week 1', appointments: 35, earnings: 7000, patients: 28 },
    { name: 'Week 2', appointments: 42, earnings: 8400, patients: 35 },
    { name: 'Week 3', appointments: 38, earnings: 7600, patients: 31 },
    { name: 'Week 4', appointments: 45, earnings: 9000, patients: 38 },
  ];

  const yearlyData = [
    { name: 'Jan', appointments: 400, earnings: 80000, patients: 300 },
    { name: 'Feb', appointments: 450, earnings: 90000, patients: 320 },
    { name: 'Mar', appointments: 480, earnings: 96000, patients: 350 },
    { name: 'Apr', appointments: 470, earnings: 94000, patients: 340 },
    { name: 'May', appointments: 500, earnings: 100000, patients: 380 },
    { name: 'Jun', appointments: 480, earnings: 96000, patients: 360 },
    { name: 'Jul', appointments: 520, earnings: 104000, patients: 400 },
    { name: 'Aug', appointments: 550, earnings: 110000, patients: 420 },
    { name: 'Sep', appointments: 530, earnings: 106000, patients: 410 },
    { name: 'Oct', appointments: 580, earnings: 116000, patients: 450 },
    { name: 'Nov', appointments: 560, earnings: 112000, patients: 440 },
    { name: 'Dec', appointments: 600, earnings: 120000, patients: 480 },
  ];

  const consultationTypeData = [
    { name: 'Online', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.6) : 0, color: '#3b82f6' },
    { name: 'Offline', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.4) : 0, color: '#f97316' },
  ];

  const appointmentStatusData = [
    { name: 'Completed', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.75) : 0, color: '#10b981' },
    { name: 'Pending', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.15) : 0, color: '#f59e0b' },
    { name: 'Cancelled', value: dashData?.appointments ? Math.floor(dashData.appointments * 0.1) : 0, color: '#ef4444' },
  ];

  const patientDemographicsData = [
    { ageGroup: '0-18', count: 15 },
    { ageGroup: '19-35', count: 45 },
    { ageGroup: '36-50', count: 38 },
    { ageGroup: '51-65', count: 25 },
    { ageGroup: '65+', count: 12 },
  ];

  const data = selectedPeriod === 'week' ? weeklyData : selectedPeriod === 'month' ? monthlyData : yearlyData;

  // Helper function to check if appointment is offline
  const isOfflineAppointment = (appointment) => {
    return appointment.consultationMode === 'offline' || 
           appointment.bookingType === 'offline' || 
           appointment.consultationType === 'offline' || 
           appointment.isOffline === true;
  };

  // Helper function to get consultation mode display
  const getConsultationMode = (appointment) => {
    if (isOfflineAppointment(appointment)) {
      return {
        type: 'offline',
        label: 'Offline',
        icon: OfflineIcon,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700'
      };
    }
    return {
      type: 'online',
      label: 'Online',
      icon: OnlineIcon,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    };
  };

  return (
    dashData && (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        {/* Header with Export Options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Your practice performance</p>
          </div>
          <div className="flex gap-2">
            <ExportData 
              data={[
                { metric: 'Earnings', value: dashData.earnings },
                { metric: 'Appointments', value: dashData.appointments },
                { metric: 'Patients', value: dashData.patients },
                { metric: 'Available Slots', value: totalSlots }
              ]} 
              filename="doctor-dashboard" 
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Earnings Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{currency}{dashData.earnings}</p>
            <p className="text-xs text-gray-500 mt-1">Earnings</p>
          </div>

          {/* Appointments Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{dashData.appointments}</p>
            <p className="text-xs text-gray-500 mt-1">Appointments</p>
          </div>

          {/* Patients Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{dashData.patients}</p>
            <p className="text-xs text-gray-500 mt-1">Patients</p>
          </div>

          {/* Available Slots Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{totalSlots}</p>
            <p className="text-xs text-gray-500 mt-1">Available Slots</p>
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
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedPeriod === 'year'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            Year
          </button>
        </div>

        {/* Analytics Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Appointments & Earnings Trend */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-6">Appointments & Earnings</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="earnings" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Patient Growth */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-6">Patient Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="patients" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPatients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Consultation Type */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-6">Consultation Type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={consultationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '11px' }}
                >
                  {consultationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Appointment Status */}
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

          {/* Patient Demographics */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-6">Age Groups</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={patientDemographicsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="ageGroup" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900">Avg Daily</h4>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {dashData.appointments ? (dashData.appointments / 30).toFixed(1) : 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Appointments per day</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900">Per Visit</h4>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {currency}{dashData.appointments && dashData.earnings ? (dashData.earnings / dashData.appointments).toFixed(0) : 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Average earnings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-900">Rate</h4>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {dashData.appointments ? ((dashData.appointments * 0.75 / dashData.appointments) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Completion rate</p>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-base font-medium text-gray-900">Latest Bookings</h3>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => {
                const consultationMode = getConsultationMode(item);
                return (
                  <div className="flex items-center px-6 py-4 hover:bg-gray-50/50 transition-colors" key={index}>
                    <img 
                      className="w-9 h-9 rounded-xl object-cover" 
                      src={item.userData.image} 
                      alt={item.userData.name} 
                    />
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.userData.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500">{slotDateFormat(item.slotDate)}</p>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{item.slotTime}</span>
                      </div>
                    </div>
                    
                    {/* Consultation Mode & Status */}
                    <div className="ml-4 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${consultationMode.bgColor} ${consultationMode.textColor}`}>
                        <consultationMode.icon />
                        {consultationMode.label}
                      </span>
                      
                      {/* Status Badge */}
                      {item.cancelled ? (
                        <span className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2.5 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
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

export default DoctorDashboard;