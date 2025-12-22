import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, Heading } from '@chakra-ui/react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const ExpenseChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.category,
    value: item.value,
    percentage: item.percentage
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="font-semibold text-neutral-900">{payload[0].name}</p>
          <p className="text-sm text-neutral-600">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-neutral-600">
            {formatPercentage(payload[0].payload.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card.Root className="p-6">
      <Heading size="lg" className="mb-6">Expense Summary</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card.Root>
  );
};

export default ExpenseChart;