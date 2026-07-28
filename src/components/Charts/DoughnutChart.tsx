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
  "#48cae4",
  "#90e0ef",
  "#e9d8a6",
  "#ee9b00",
  "#ca6702",
  "#bb3e03",
];

const DoughnutChart = ({
  label,
  values,
  showLegend = true,
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
          size: 15,
        },

        formatter: (value: number) => value,
      },
    },

    cutout: "40%",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="h-[200px] w-[200px] mt-5">
        <Doughnut data={data} options={options} />
      </div> 

      <div className="ml-5">
        {label.map((item, index) => (
          <div key={item} className="flex items-center gap-2 ml-2">
            <span
              className="h-3 w-7"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm ml-2">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
