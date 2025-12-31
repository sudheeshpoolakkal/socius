import React from 'react';

const QuickStats = ({ stats }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Quick Stats Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            {stat.change && (
              <p className={`text-xs mt-1 ${stat.change > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% vs last period
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
