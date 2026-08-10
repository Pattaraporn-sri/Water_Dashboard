import Chart from "../Charts/ChartCard";
import DoughnutChart from "../Charts/DoughnutChart";
import HorizontalBarChart from "../Charts/HorizontalBarChart";
import MapView from "../Map/MapView";
import type { WaterSource } from "../../types/Water";
import { useEffect } from "react";
import PhotoViewer from "../PhotoViewer/PhotoViewer";

interface KPISectionProps {
  waterData: WaterSource[];
  kpi: {
    utilization: {
      [key: string]: number;
    };
    totalWaterSource: number;
    totalStorage: number;
    storageByType: {
      [key: string]: number;
    };
    countByType: {
      [key: string]: number;
    };
    problemSummary: {
      [key: string]: number;
    };
  };
  selectedWater: WaterSource | null;
  setSelectedWater: (water: WaterSource) => void;
}

function KPISection({
  waterData,
  kpi,
  selectedWater,
  setSelectedWater,
}: KPISectionProps) {
  // ปริมาณกักเก็บน้ำแยกตามประเภทแหล่งน้ำ
  const storageByType = waterData.reduce(
    (acc, item) => {
      const type = item.type || "ไม่ระบุ";

      acc[type] = (acc[type] || 0) + (Number(item.volume) || 0);

      return acc;
    },
    {} as Record<string, number>,
  );

  const countByType = waterData.reduce(
    (acc, item) => {
      const type = item.type || "ไม่ระบุ";

      acc[type] = (acc[type] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const storageLabels = Object.keys(storageByType);
  const storageValues = Object.values(storageByType);

  // ลักษณะการใช้ประโยชน์
  const labels = Object.keys(kpi.utilization || {});
  const values = Object.values(kpi.utilization || {});

  // ปัญหาด้านน้ำ CK002
  const problemLabels = Object.keys(kpi.problemSummary || {});
  const problemValues = Object.values(kpi.problemSummary || {});

  useEffect(() => {
    // console.log("water Data:", waterData);
    // console.log("KPI Data:", kpi);
  }, [waterData, kpi]);

  return (
    <div className="font-kanit px-3 sm:px-5 w-full max-w-full overflow-x-hidden">
      {/* ================= TOP SECTION ================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)]">
        {/* Map */}
        <div className="rounded-xl shadow-lg overflow-hidden h-[320px] sm:h-[420px] lg:h-[520px] w-full max-w-full">
          <MapView data={waterData} onMarkerClick={setSelectedWater} />
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-5 w-full min-w-0">
          {/* KPI */}
          <div className="flex flex-col gap-2 sm:flex-row w-full">
            <div
              className="bg-gradient-to-br from-[#0077b6] to-[#023e8a]
              w-full sm:flex-1 lg:w-[350px] h-28 flex items-center justify-center flex-col
              text-white rounded-xl shadow-lg font-bold"
            >
              <span className="text-xl">จำนวนแหล่งน้ำทั้งหมด (แห่ง)</span>

              <p className="text-2xl">{waterData.length.toLocaleString()}</p>
            </div>

            <div
              className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6]
              w-full sm:flex-1 lg:w-[350px] h-28 flex items-center justify-center flex-col
              text-white rounded-xl shadow-lg font-bold"
            >
              <span className="text-xl">ปริมาณการเก็บกักน้ำรวม (ลบ.ม.)</span>

              <p className="text-2xl">
                {Object.values(storageByType)
                  .reduce((sum, value) => sum + value, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* รูปภาพ */}
          <div
            className="bg-white w-full min-h-[320px] md:h-[390px]
            p-5 flex flex-col
            text-[#023e8a] rounded-xl shadow-lg"
          >
            <span className="text-xl font-bold">
              📸 ภาพถ่ายแหล่งน้ำ (นำเสนอทีละภาพ)
            </span>

            <PhotoViewer
              selectedWater={selectedWater}
              waterData={waterData}
              setSelectedWater={setSelectedWater}
            />
          </div>
        </div>
      </div>

      {/* ================= CHART ROW 1 ================= */}
      <div className="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        {/* ปริมาณกักเก็บน้ำ */}
        <div
          className="bg-white w-full h-[320px] sm:h-[350px]
          p-5 text-[#023e8a] rounded-xl shadow-lg"
        >
          <Chart
            title="💧 ปริมาณกักเก็บน้ำแยกตามประเภทแหล่งน้ำ (ลบ.ม.)"
            subtitle=""
          >
            <HorizontalBarChart labels={storageLabels} values={storageValues} />
          </Chart>
        </div>

        {/* สัดส่วนประเภทแหล่งน้ำ */}
        <div
          className="bg-white w-full min-w-0 h-[320px] sm:h-[350px]
          p-5 rounded-xl shadow-lg text-[#023e8a]"
        >
          <Chart title="🌊 สัดส่วนประเภทแหล่งน้ำตามประเภท" subtitle="">
            <DoughnutChart
              label={Object.keys(countByType)}
              values={Object.values(countByType)}
            />
          </Chart>
        </div>
      </div>

      {/* ================= CHART ROW 2 ================= */}
      <div className="grid grid-cols-1 gap-5 mt-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        {/* ปัญหาด้านน้ำ */}
        <div
          className="bg-white w-full h-[320px] sm:h-[350px]
          p-5 text-[#023e8a]
          rounded-xl shadow-lg"
        >
          <Chart title="🚨 ปัญหาด้านน้ำในพื้นที่" subtitle="">
            <HorizontalBarChart
              labels={problemLabels}
              values={problemValues}
              chartType="problem"
            />
          </Chart>
        </div>

        {/* การใช้ประโยชน์ */}
        <div
          className="bg-white w-full min-w-0 h-[320px] sm:h-[350px]
          p-5 rounded-xl shadow-lg text-[#023e8a]"
        >
          <Chart title="🎯 การใช้ประโยชน์แหล่งน้ำ" subtitle="">
            <DoughnutChart label={labels} values={values} />
          </Chart>
        </div>
      </div>
    </div>
  );
}

export default KPISection;
