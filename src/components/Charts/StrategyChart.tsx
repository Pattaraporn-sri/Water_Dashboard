import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
  // =====================================================
  // 1. นับจำนวนโครงการตามยุทธศาสตร์
  // =====================================================

  const strategyCount = projects.reduce<Record<string, number>>(
    (acc, project) => {
      const strategy = project.strategy?.trim();

      if (!strategy) return acc;

      acc[strategy] = (acc[strategy] || 0) + 1;

      return acc;
    },
    {},
  );

  // =====================================================
  // 2. เรียงยุทธศาสตร์ตามเลข
  //    ยุทธศาสตร์ 1 → 2 → 3 → 4 → 5
  // =====================================================

  const strategyNames = Object.keys(strategyCount).sort((a, b) => {
    const getNumber = (text: string) => {
      const match = text.match(/ยุทธศาสตร์.*?(\d+)/);

      return match ? Number(match[1]) : 999;
    };

    return getNumber(a) - getNumber(b);
  });

  // จำนวนโครงการตามลำดับยุทธศาสตร์
  const values = strategyNames.map((strategy) => strategyCount[strategy] || 0);

  // =====================================================
  // 3. สีของแต่ละยุทธศาสตร์
  // =====================================================

  const strategyColors = [
    "#4D96FF", // ยุทธศาสตร์ 1
    "#dc2626", // ยุทธศาสตร์ 2
    "#FFD93D", // ยุทธศาสตร์ 3
    "#16a34a", // ยุทธศาสตร์ 4
    "#FF922B", // ยุทธศาสตร์ 5
  ];

  // =====================================================
  // 4. Doughnut Data
  // =====================================================

  const data = {
    labels: strategyNames,

    datasets: [
      {
        data: values,

        backgroundColor: strategyNames.map(
          (_, index) => strategyColors[index % strategyColors.length],
        ),

        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  // =====================================================
  // 5. Chart Options
  // =====================================================

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      // -------------------------------------------------
      // ปิด Legend ของ Chart.js
      // เพราะใช้ Custom Legend เอง
      // -------------------------------------------------

      legend: {
        display: false,
      },

      // -------------------------------------------------
      // Tooltip
      // -------------------------------------------------

      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;

            return `${label}: ${value} โครงการ`;
          },
        },
      },

      // -------------------------------------------------
      // ตัวเลขบน Doughnut
      // -------------------------------------------------

      datalabels: {
        color: "#ffffff",

        font: {
          family: "Kanit",
          size: 14,
          weight: "bold" as const,
        },

        formatter: (value: number) => {
          return value;
        },
      },
    },

    cutout: "40%",
  };

  // =====================================================
  // 6. Render
  // =====================================================

  return (
    <div className="w-[500px] h-[220px]">
      {projects.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          ไม่มีข้อมูลโครงการ
        </div>
      ) : (
        <div className="flex items-center h-full">
          {/* =================================================
              Doughnut
          ================================================= */}

          <div className="w-[250px] h-[210px] shrink-0">
            <Doughnut data={data} options={options} />
          </div>

          {/* =================================================
              Custom Legend
          ================================================= */}

          <div className="flex flex-col gap-2 ml-1">
            {strategyNames.map((strategy, index) => (
              <div key={strategy} className="flex items-center gap-2">
                {/* -----------------------------------------
                    สีของยุทธศาสตร์
                ----------------------------------------- */}

                <span
                  className="w-[14px] h-[14px] rounded-[3px] shrink-0"
                  style={{
                    backgroundColor:
                      strategyColors[index % strategyColors.length],
                  }}
                />

                {/* -----------------------------------------
                    ชื่อยุทธศาสตร์
                ----------------------------------------- */}

                <span
                  className="text-[14px] leading-tight whitespace-nowrap"
                  style={{
                    fontFamily: "Kanit",
                  }}
                >
                  {strategy}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyChart;
