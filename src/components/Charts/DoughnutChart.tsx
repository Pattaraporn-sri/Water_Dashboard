import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DoughnutChartProps {
  label: string[];
  values: number[];
  showLegend?: boolean;
  showDataLabels?: boolean;
}

const colors = [
  "#023e8a",
  "#0077b6",
  "#0096c7",
  "#00b4d8",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
  "#ae2012",
];

const DoughnutChart = ({
  label,
  values,
  showDataLabels = true,
}: DoughnutChartProps) => {
  const data = {
    labels: label,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 1,
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

      tooltip: {
        enabled: true,
      },

      datalabels: {
        display: showDataLabels,

        color: "#fff",

        font: {
          family: "Kanit",
          size: 12,
        },

        formatter: (value: number) => value,
      },
    },

    cutout: "45%",
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 h-full w-full min-w-0">
      {/* กราฟ */}
      <div className="relative flex-shrink-0 w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[170px]">
        <Doughnut data={data} options={options} />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 sm:gap-y-1.5 items-center min-w-0 w-full sm:w-auto sm:max-w-[240px] flex-1 min-h-0 overflow-y-auto px-2 justify-items-start mx-auto sm:mx-0">
        {label.map((item, index) => (
          <React.Fragment key={item}>
            <span
              className="h-2.5 w-6 sm:w-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs sm:text-sm truncate" title={item}>
              {item}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
