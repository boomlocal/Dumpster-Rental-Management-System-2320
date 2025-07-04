import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
  const data = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 28000 },
    { month: 'Mar', revenue: 35000 },
    { month: 'Apr', revenue: 42000 },
    { month: 'May', revenue: 38000 },
    { month: 'Jun', revenue: 45000 },
    { month: 'Jul', revenue: 48000 },
    { month: 'Aug', revenue: 52000 },
    { month: 'Sep', revenue: 46000 },
    { month: 'Oct', revenue: 49000 },
    { month: 'Nov', revenue: 53000 },
    { month: 'Dec', revenue: 58000 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#0ea5e9" 
          strokeWidth={2}
          dot={{ fill: '#0ea5e9' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;