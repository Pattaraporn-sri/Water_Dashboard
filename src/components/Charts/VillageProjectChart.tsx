import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
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
  villageNo: number | string;
  villageName: string;
}

interface VillageProjectChartProps {
  projects: ProjectBank[];
}

const colors = [
  "#023e8a",
  "#0077b6",
  "#0096c7",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
];

const VillageProjectChart = ({ projects }: VillageProjectChartProps) => {
  // นับจำนวนโครงการแยกตามหมู่บ้าน
  const villageCount = projects.reduce<
    Record<string, { villageNo: number; count: number }>
  >((acc, project) => {
    const villageName = project.villageName?.trim();

    if (!villageName) return acc;

    const villageNo = Number(project.villageNo);

    if (!acc[villageName]) {
      acc[villageName] = {
        villageNo: Number.isNaN(villageNo) ? 999 : villageNo,
        count: 0,
      };
    }

    acc[villageName].count += 1;

    return acc;
  }, {});

  // เรียงตามหมู่ที่
  const villages = Object.entries(villageCount).sort(
    ([, a], [, b]) => a.villageNo - b.villageNo,
  );

  const labels = villages.map(([name]) => name);

  const values = villages.map(([, data]) => data.count);

  const data = {
    labels,

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

    indexAxis: "y" as const,

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
          label: (context: any) => `${context.raw || 0} โครงการ`,
        },
      },
    },

    scales: {
      x: {
        beginAtZero: true,

        ticks: {
          precision: 0,
          font: {
            family: "Kanit",
          },
        },

        // title: {
        //   display: true,
        //   text: "จำนวนโครงการ",
        //   font: {
        //     family: "Kanit",
        //   },
        // },
      },

      y: {
        ticks: {
          font: {
            family: "Kanit",
          },
        },
        // title: {
        //   display: true,
        //   text: "หมู่บ้าน",
        //   font: {
        //     family: "Kanit",
        //   },
        // },
      },
    },
  };

  return (
    <div className="w-full h-[230px]">
      {projects.length === 0 || labels.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          ไม่มีข้อมูลโครงการ
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default VillageProjectChart;
