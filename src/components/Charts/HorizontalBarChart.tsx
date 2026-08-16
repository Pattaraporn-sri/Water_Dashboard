import { useEffect, useState } from "react";
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

  // เพิ่ม
  chartType?: "problem" | "default";
}

const defaultColors = [
  "#023e8a",
  "#0077b6",
  "#0096c7",
  "#00b4d8",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
];

// สีเฉพาะ CK002
const problemColors: Record<string, string> = {
  น้ำอุปโภคบริโภค: "#0000FF", // ฟ้า

  น้ำเพื่อการผลิต: "#228B22", // เขียว

  น้ำท่วม: "#FE0000", // แดง

  น้ำเสีย: "#FFD700", // เหลือง
};

const HorizontalBarChart = ({
  labels,
  values,
  showLegend = false,
  showDataLabels = true,
  chartType = "default",
}: HorizontalBarChartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const backgroundColors =
    chartType === "problem"
      ? labels.map((label) => problemColors[label] || "#94a3b8")
      : values.map((_, index) => defaultColors[index % defaultColors.length]);

  const data = {
    labels,

    datasets: [
      {
        data: values,

        backgroundColor: backgroundColors,

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

            size: isMobile ? 8 : 10,
          },
        },

        grid: {
          color: "#e5e7eb",
        },
      },

      y: {
        afterFit: (scale: any) => {
          scale.width = isMobile ? 90 : 130; // จำกัดความกว้างแกน Y ไม่ให้กินพื้นที่กราฟ
        },
        ticks: {
          color: "#374151",

          font: {
            family: "Kanit",

            size: isMobile ? 9 : 11,
          },

          // ตัดข้อความ label ยาวๆ บนมือถือ ป้องกันล้น
          callback: function (this: any, value: any): string {
            const label = this.getLabelForValue(value);
            const limit = isMobile ? 12 : 16;
            return label.length > limit ? label.slice(0, limit) + "…" : label;
          },
        },

        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalBarChart;
