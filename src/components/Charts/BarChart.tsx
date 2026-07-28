import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Register Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface BarChartProps {
  labels: string[];
  values: number[];
}
const colors = [
  "#023e8a",
  "#0077b6",
  "#0096c7",
  "#00b4d8",
  "#48cae4",
  "#90e0ef",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
];

const BarChart = ({ labels, values }: BarChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: "จำนวนแหล่งน้ำ",
        data: values,

        backgroundColor: colors,

        borderRadius: 2,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: false,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#848485",
          font: {
            size: 10, 
            family: "Kanit", 
          },
        },

        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#848485",
          font:{
            size: 10,
            family: "Kanit",
          }
        },

        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="h-[230px] text-[#023e8a] font-kanit">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
