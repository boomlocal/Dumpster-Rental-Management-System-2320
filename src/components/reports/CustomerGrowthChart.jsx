import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomerGrowthChart = () => {
  const data = [
    { month: 'Jan', customers: 120 },
    { month: 'Feb', customers: 135 },
    { month: 'Mar', customers: 148 },
    { month: 'Apr', customers: 162 },
    { month: 'May', customers: 178 },
    { month: 'Jun', customers: 195 },
    { month: 'Jul', customers: 210 },
    { month: 'Aug', customers: 228 },
    { month: 'Sep', customers: 245 },
    { month: 'Oct', customers: 260 },
    { month: 'Nov', customers: 278 },
    { month: 'Dec', customers: 295 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [value, 'Customers']} />
        <Area 
          type="monotone" 
          dataKey="customers" 
          stroke="#10b981" 
          fill="#10b981" 
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomerGrowthChart;