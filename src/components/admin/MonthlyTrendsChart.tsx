import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyTrendsChart: React.FC = () => {
  // Mock data - in a real app, this would come from your API
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const registrations = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 42];
  const activeUsers = [10, 15, 12, 20, 18, 25, 22, 28, 25, 32, 30, 35];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: 'New Registrations',
        data: registrations,
        backgroundColor: 'rgba(31, 75, 115, 0.5)', // primary color
        borderColor: 'rgba(31, 75, 115, 1)',
        borderWidth: 1,
      },
      {
        label: 'Active Users',
        data: activeUsers,
        backgroundColor: 'rgba(34, 151, 163, 0.5)', // secondary color
        borderColor: 'rgba(34, 151, 163, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-[400px]">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MonthlyTrendsChart;