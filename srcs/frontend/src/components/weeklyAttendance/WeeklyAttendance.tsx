"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import classes from './weeklyAttendance.module.css';
import { useUserContext } from '@/context/UserContext';

const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
  ssr: false,
});

interface WeeklyAttendanceProps {
  user: 'current' | 'search';
}

const WeeklyAttendance: React.FC<WeeklyAttendanceProps> = ({ user }) => {
  const { userData, userDataSearch } = useUserContext();
  const [chartData, setChartData] = useState({
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        label: 'Game Results',
        data: [0, 0],
        backgroundColor: [
          'rgba(0, 0, 0, 0.6)',
          'rgba(255, 255, 255, 0.6)',
        ],
        borderColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    const data = user === 'search' ? userDataSearch : userData;

    const adjustedData = [data.wins, data.loses];

    setChartData({
      labels: ['Wins', 'Losses'],
      datasets: [
        {
          label: 'Game Results',
          data: adjustedData,
          backgroundColor: [
            'rgba(0, 0, 0, 0.6)',
            'rgba(255, 255, 255, 0.6)',
          ],
          borderColor: 'rgba(0, 0, 0, 0.6)',
          borderWidth: 2,
        },
      ],
    });
  }, [user, userData, userDataSearch]);

  const options = {
    plugins: {
      datalabels: {
        color: 'black',
      },
    },
  };

  return (
    <div className={classes.container}>
      <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}

export default WeeklyAttendance;
