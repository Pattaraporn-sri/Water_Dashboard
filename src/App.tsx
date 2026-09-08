import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFilterData } from "./services/api";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import WaterManagement from "./pages/WaterManagement";
import type { SelectedFilter } from "./types/Filter";
import type { WaterSource } from "./types/Water";
import { getWaterData } from "./services/water";
import { getKPIData } from "./services/kpi";

function App() {
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

  // โหลด Filter Data ตอนเปิดระบบ
  useEffect(() => {
    async function loadFilter() {
      const data = await getFilterData();
      console.log(data);
    }

    loadFilter();
  }, []);

  // โหลด Water Data + KPI เมื่อ Filter เปลี่ยน
  useEffect(() => {
    getWaterData(filter).then((data) => {
      console.log("FILTER =", filter);
      setWaterData(data);
    });

    getKPIData(filter).then((data) => {
      setKpi({
        ...data,
        utilization: data.utilization || {},
      });
    });
  }, [filter]);

  // เลือกแหล่งน้ำตัวแรกอัตโนมัติ
  useEffect(() => {
    if (waterData.length > 0) {
      setSelectedWater(waterData[0]);
    } else {
      setSelectedWater(null);
    }
  }, [waterData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              filter={filter}
              setFilter={setFilter}
              waterData={waterData}
              kpi={kpi}
              selectedWater={selectedWater}
              setSelectedWater={setSelectedWater}
            />
          }
        />

        <Route path="/water-management" element={<WaterManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
