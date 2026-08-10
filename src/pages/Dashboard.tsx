import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar/FilterBar";
import Header from "../components/Header/Header";
import KPISection from "../components/KPI/KPISection";
import SummaryTable from "../components/Table/SummaryTable";
import type { SelectedFilter } from "../types/Filter";
import type { WaterSource } from "../types/Water";
import { getWaterData } from "../services/water";
import { getKPIData } from "../services/kpi";

export const tableColumns = [
  "ลำดับ",
  "ชื่อแหล่งน้ำ",
  "ประเภท",
  "จังหวัด",
  "อำเภอ",
  "ตำบล",
  "ความกว้าง (ม.)",
  "ควมายาว (ม.)",
  "ความลึก (ม.)",
  "ปริมาตร",
];

function Dashboard() {
  const [filter, setFilter] = useState<SelectedFilter>({
    province: "",
    district: "",
    subdistrict: "",
    type: "",
  });

  const [waterData, setWaterData] = useState<WaterSource[]>([]);
  const [selectedWater, setSelectedWater] = useState<WaterSource | null>(null);

  const [kpi, setKpi] = useState<{
    totalWaterSource: number;
    totalStorage: number;
    storageByType: Record<string, number>;
    countByType: Record<string, number>;
    utilization: Record<string, number>;
    problemSummary: Record<string, number>;
  }>({
    totalWaterSource: 0,
    totalStorage: 0,
    storageByType: {},
    countByType: {},
    utilization: {},
    problemSummary: {},
  });

  useEffect(() => {
    getWaterData(filter).then((data) => {
      // console.log("WATER DATA =", data);
      console.log("FILTER =", filter);

      setWaterData(data);
    });

    getKPIData(filter).then((data) => {
      // console.log("KPI API =", data);

      setKpi({
        ...data,
        utilization: data.utilization || {},
      });
    });
  }, [filter]);

  //แสดงรูปแรกของแหล่งน้ำที่เลือก
  useEffect(() => {
    if (waterData.length > 0) {
      setSelectedWater(waterData[0]);
    } else {
      setSelectedWater(null);
    }
  }, [waterData]);

  useEffect(() => {
    console.log("SELECTED WATER UPDATE =", selectedWater);
  }, [selectedWater]);

  return (
    <div className="bg-slate-100 w-full min-w-0 font-kanit overflow-x-hidden">
      <Header />
      <FilterBar onFilterChange={setFilter} />
      <KPISection
        waterData={waterData}
        kpi={kpi}
        selectedWater={selectedWater}
        setSelectedWater={setSelectedWater}
      />
      <SummaryTable columns={tableColumns} waterData={waterData} />
    </div>
  );
}

export default Dashboard;
