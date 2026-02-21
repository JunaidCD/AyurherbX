// Dashboard Charts Component
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const CollectionsChart = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Collections Overview</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="collections" fill="#0088FE" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const TrendChart = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data || []}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#00C49F" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const StatusPieChart = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
          {data?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default { CollectionsChart, TrendChart, StatusPieChart };
