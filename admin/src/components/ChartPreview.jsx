import React from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * ChartPreview Component
 * Showcases different chart types available in the dashboards
 * Useful for presentations and documentation
 */

const ChartPreview = () => {
  // Sample data for previews
  const sampleLineData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 700 },
  ];

  const sampleBarData = [
    { name: 'A', value: 40 },
    { name: 'B', value: 70 },
    { name: 'C', value: 50 },
    { name: 'D', value: 90 },
  ];

  const samplePieData = [
    { name: 'Category 1', value: 400, color: '#3b82f6' },
    { name: 'Category 2', value: 300, color: '#10b981' },
    { name: 'Category 3', value: 200, color: '#f59e0b' },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Chart Types Preview</h1>
        <p className="text-gray-600">Available visualizations in the analytics dashboards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Line Chart</h3>
          <p className="text-sm text-gray-600 mb-4">Best for: Trends over time, comparisons</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sampleLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bar Chart</h3>
          <p className="text-sm text-gray-600 mb-4">Best for: Comparisons, distributions</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sampleBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Area Chart</h3>
          <p className="text-sm text-gray-600 mb-4">Best for: Cumulative data, trends</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sampleLineData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pie Chart</h3>
          <p className="text-sm text-gray-600 mb-4">Best for: Proportions, percentages</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={samplePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {samplePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Guidelines */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chart Selection Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">📈 Line Charts</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Time series data</li>
              <li>Continuous data</li>
              <li>Multiple metrics comparison</li>
              <li>Trend analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📊 Bar Charts</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Categorical comparisons</li>
              <li>Rankings</li>
              <li>Discrete data points</li>
              <li>Performance metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📉 Area Charts</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Cumulative totals</li>
              <li>Volume over time</li>
              <li>Part-to-whole relationships</li>
              <li>Stacked comparisons</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🥧 Pie Charts</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Proportions/percentages</li>
              <li>Composition of a whole</li>
              <li>Few categories (2-6 ideal)</li>
              <li>Status distributions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="w-full h-20 rounded-lg bg-blue-500 mb-2"></div>
            <p className="text-sm font-medium">Blue</p>
            <p className="text-xs text-gray-500">#3b82f6</p>
            <p className="text-xs text-gray-600 mt-1">Primary, Doctors</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 rounded-lg bg-purple-500 mb-2"></div>
            <p className="text-sm font-medium">Purple</p>
            <p className="text-xs text-gray-500">#8b5cf6</p>
            <p className="text-xs text-gray-600 mt-1">Appointments</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 rounded-lg bg-green-500 mb-2"></div>
            <p className="text-sm font-medium">Green</p>
            <p className="text-xs text-gray-500">#10b981</p>
            <p className="text-xs text-gray-600 mt-1">Success, Patients</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 rounded-lg bg-yellow-500 mb-2"></div>
            <p className="text-sm font-medium">Yellow</p>
            <p className="text-xs text-gray-500">#eab308</p>
            <p className="text-xs text-gray-600 mt-1">Earnings</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 rounded-lg bg-red-500 mb-2"></div>
            <p className="text-sm font-medium">Red</p>
            <p className="text-xs text-gray-500">#ef4444</p>
            <p className="text-xs text-gray-600 mt-1">Cancelled, Errors</p>
          </div>
          <div className="text-center">
            <div className="w-full h-20 rounded-lg bg-orange-500 mb-2"></div>
            <p className="text-sm font-medium">Orange</p>
            <p className="text-xs text-gray-500">#f97316</p>
            <p className="text-xs text-gray-600 mt-1">Offline, Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;
