import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
    <div className="flex flex-col sm:flex-row items-center gap-3 h-full w-full min-w-0">
      {/* กราฟ */}
      <div className="relative flex-shrink-0 w-[140px] h-[140px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[170px]">
        <Doughnut data={data} options={options} />
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 min-w-0 w-full sm:w-auto sm:flex-1 overflow-y-auto max-h-[140px] sm:max-h-full">
        {label.map((item, index) => (
          <div key={item} className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-6 sm:w-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-xs sm:text-sm truncate">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
