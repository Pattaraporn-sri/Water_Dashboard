import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

interface HorizontalBarChartProps {
  labels: string[];
  values: number[];
  showLegend?: boolean;
  showDataLabels?: boolean;
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

const HorizontalBarChart = ({
  labels,
  values,
  showLegend = false,
  showDataLabels = true,
}: HorizontalBarChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        data: values,

        backgroundColor: values.map(
          (_, index) => colors[index % colors.length],
        ),

        borderRadius: 0,
        borderSkipped: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    indexAxis: "y" as const,

    plugins: {
      legend: {
        display: showLegend,
      },

      tooltip: {
        enabled: true,
      },

      datalabels: {
        display: showDataLabels,

        anchor: "end" as const,
        align: "right" as const,

        color: "#023e8a",

        font: {
          family: "Kanit",
          size: 10,
          weight: "bold" as const,
        },

        formatter: (value: number) => value.toLocaleString(),
      },
    },

    scales: {
      x: {
        beginAtZero: true,

        ticks: {
          color: "#374151",

          font: {
            family: "Kanit",
            size: 10,
          },
        },

        grid: {
          color: "#e5e7eb",
        },
      },

      y: {
        ticks: {
          color: "#374151",

          font: {
            family: "Kanit",
            size: 12,
          },
        },

        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-[250px] -mt-3">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalBarChart;
