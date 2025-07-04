import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const JobsChart = () => {
  const data = [
    { name: 'Drop-off', value: 45, color: '#0ea5e9' },
    { name: 'Pickup', value: 30, color: '#10b981' },
    { name: 'Exchange', value: 20, color: '#f59e0b' },
    { name: 'Live Load', value: 5, color: '#ef4444' }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default JobsChart;