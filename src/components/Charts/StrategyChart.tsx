import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProjectBank {
  projectName: string;
  responsibleAgency: string;
  supportingAgency: string;
  budget: number;
  year: number;
  strategy: string;
  benefit: string;
}

interface StrategyChartProps {
  projects: ProjectBank[];
}

const StrategyChart = ({ projects }: StrategyChartProps) => {
  // นับจำนวนโครงการตามยุทธศาสตร์
  const strategyCount = projects.reduce<Record<string, number>>(
    (acc, project) => {
      const strategy = project.strategy?.trim();

      if (!strategy) return acc;

      acc[strategy] = (acc[strategy] || 0) + 1;

      return acc;
    },
    {},
  );

  const strategyNames = Object.keys(strategyCount);
  const values = Object.values(strategyCount);

  const labels = strategyNames.map((strategy) => {
    const match = strategy.match(/^ยุทธศาสตร์ที่\s*\d+/);

    return match ? match[0] : strategy;
  });

  const data = {
    labels,
    datasets: [
      {
        data: values,

        backgroundColor: [
          "#4D96FF",
          "#dc2626",
          "#FFD93D",
          "#16a34a",
          "#FF922B",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,

        tooltip: {
          callbacks: {
            label: (context: any) => {
              const index = context.dataIndex;
              const fullName = strategyNames[index];
              const value = context.raw || 0;

              return [fullName, `${value} โครงการ`];
            },
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "right" as const,

        labels: {
          font: {
            family: "Kanit",
            size: 14,
          },
          padding: 10,
          // ลดขนาดช่องสี่เหลี่ยมสี
          boxWidth: 38,
          boxHeight: 12,
        },
      },

      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;

            return `${label}: ${value} โครงการ`;
          },
        },
      },

      datalabels: {
        color: "#fff",

        font: {
          family: "Kanit",
          size: 12,
        },
      },
    },
    cutout: "45%",
  };

  return (
    <div className="w-[430px] h-[200px]">
      {projects.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          ไม่มีข้อมูลโครงการ
        </div>
      ) : (
        <Doughnut data={data} options={options} />
      )}
    </div>
  );
};

export default StrategyChart;
