import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ProjectBank {
  projectName: string;
  responsibleAgency: string;
  supportingAgency: string;
  budget: number;
  year: number;
  strategy: string;
  benefit: string;
  waterSource: string;
}

interface WaterSourceChartProps {
  projects: ProjectBank[];
}

const WaterSourceChart = ({ projects }: WaterSourceChartProps) => {
  // นับจำนวนโครงการตามแหล่งน้ำ
  const waterSourceCount = projects.reduce<Record<string, number>>(
    (acc, project) => {
      const waterSource = project.waterSource?.trim();

      if (!waterSource) return acc;

      acc[waterSource] = (acc[waterSource] || 0) + 1;

      return acc;
    },
    {},
  );

  const waterSourceNames = Object.keys(waterSourceCount);
  const values = Object.values(waterSourceCount);

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


  const data = {
    labels: waterSourceNames,
    datasets: [
      {
        label: "จำนวนโครงการ",
        data: values,

        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 1,

        borderRadius: 4,
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

      // ปรับสีตัวเลขบนแท่งกราฟเป็นสีขาว
      datalabels: {
        color: "#ffffff",
        font: {
          family: "Kanit",
          size: 12,
        },
      },

      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw || 0;

            return `${value} โครงการ`;
          },
        },
      },
    },

    scales: {
      x: {
        beginAtZero: true,

        ticks: {
          font: {
            family: "Kanit",
            size: 10,
          },

          precision: 0,
        },

        // title: {
        //   display: true,
        //   text: "จำนวนโครงการ",
        //   font: {
        //     family: "Kanit",
        //     size: 13,
        //   },
        // },
      },

      y: {
        ticks: {
          font: {
            family: "Kanit",
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[250px]">
      {projects.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          ไม่มีข้อมูลโครงการ
        </div>
      ) : waterSourceNames.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          ไม่มีข้อมูลแหล่งน้ำ
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default WaterSourceChart;

