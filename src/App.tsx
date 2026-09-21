import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import WaterManagement from "./pages/WaterManagement";
import type { SelectedFilter } from "./types/Filter";
import type { WaterSource } from "./types/Water";
import { getDashboardData } from "./services/api";
import type { DashboardData } from "./types/Dashboard";
// import { getWaterData } from "./services/water";
// import { getKPIData } from "./services/kpi";
// import { getFilterData } from "./services/api";

function App() {
  const [filter, setFilter] = useState<SelectedFilter>({
    province: "",
    district: "",
    subdistrict: "",
    type: "",
  });

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [waterData, setWaterData] = useState<WaterSource[]>([]);
  const [selectedWater, setSelectedWater] = useState<WaterSource | null>(null);

  // const [kpi, setKpi] = useState<{
  //   totalWaterSource: number;
  //   totalStorage: number;
  //   storageByType: Record<string, number>;
  //   countByType: Record<string, number>;
  //   utilization: Record<string, number>;
  //   problemSummary: Record<string, number>;
  // }>({
  //   totalWaterSource: 0,
  //   totalStorage: 0,
  //   storageByType: {},
  //   countByType: {},
  //   utilization: {},
  //   problemSummary: {},
  // });

  // โหลด Filter Data ตอนเปิดระบบ
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      console.log("🚀 LOAD DASHBOARD");

      try {
        const data = await getDashboardData();

        if (cancelled) return;

        if (!data.success) {
          throw new Error(data.error || "Dashboard API failed");
        }

        console.log("✅ DASHBOARD DATA LOADED", data);

        setDashboardData(data);
      } catch (error) {
        if (cancelled) return;

        console.error("❌ DASHBOARD LOAD FAILED", error);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // เลือกแหล่งน้ำตัวแรกอัตโนมัติ
  useEffect(() => {
    if (waterData.length > 0) {
      setSelectedWater(waterData[0]);
    } else {
      setSelectedWater(null);
    }
  }, [waterData]);

  // Filter ตัวแรกของระบบใหม่
  const filteredWaterData = useMemo(() => {
    if (!dashboardData) {
      return [];
    }

    return dashboardData.waterData.filter((item) => {
      if (filter.province && item.province !== filter.province) {
        return false;
      }

      if (filter.district && item.district !== filter.district) {
        return false;
      }

      if (filter.subdistrict && item.subdistrict !== filter.subdistrict) {
        return false;
      }

      if (filter.type && item.type !== filter.type) {
        return false;
      }

      return true;
    });
  }, [dashboardData, filter]);

  // Filter สำหรับ Problem
  const filteredProblemSummary = useMemo(() => {
    if (!dashboardData) {
      return [];
    }

    return dashboardData.problemSummaryData.filter((item) => {
      if (filter.province && item.province !== filter.province) {
        return false;
      }

      if (filter.district && item.district !== filter.district) {
        return false;
      }

      if (filter.subdistrict && item.subdistrict !== filter.subdistrict) {
        return false;
      }

      return true;
    });
  }, [dashboardData, filter]);

  // KPI จากข้อมูลใหม่
  const filteredStorageSummary = useMemo(() => {
    if (!dashboardData) {
      return [];
    }

    return dashboardData.storageSummaryData.filter((item) => {
      if (filter.province && item.province !== filter.province) {
        return false;
      }

      if (filter.district && item.district !== filter.district) {
        return false;
      }

      if (filter.subdistrict && item.subdistrict !== filter.subdistrict) {
        return false;
      }

      if (filter.type && item.type !== filter.type) {
        return false;
      }

      return true;
    });
  }, [dashboardData, filter]);

  const kpi = useMemo(() => {
    const totalWaterSource = filteredWaterData.length;

    const totalStorage = filteredStorageSummary.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const storageByType: Record<string, number> = {};
    const countByType: Record<string, number> = {};

    filteredStorageSummary.forEach((item) => {
      storageByType[item.type] = (storageByType[item.type] || 0) + item.total;

      countByType[item.type] = (countByType[item.type] || 0) + item.count;
    });

    const problemSummary: Record<string, number> = {
      น้ำอุปโภคบริโภค: 0,
      น้ำเพื่อการผลิต: 0,
      น้ำท่วม: 0,
      น้ำเสีย: 0,
    };

    filteredProblemSummary.forEach((item) => {
      problemSummary["น้ำอุปโภคบริโภค"] += item["น้ำอุปโภคบริโภค"];

      problemSummary["น้ำเพื่อการผลิต"] += item["น้ำเพื่อการผลิต"];

      problemSummary["น้ำท่วม"] += item["น้ำท่วม"];

      problemSummary["น้ำเสีย"] += item["น้ำเสีย"];
    });

    const utilization: Record<string, number> = {};

    filteredWaterData.forEach((item) => {
      const usage = item.usage?.trim();

      if (!usage) {
        return;
      }

      utilization[usage] = (utilization[usage] || 0) + 1;
    });

    return {
      totalWaterSource,
      totalStorage,
      storageByType,
      countByType,
      utilization,
      problemSummary,
    };
  }, [filteredWaterData, filteredProblemSummary, filteredStorageSummary]);

  // useEffect(() => {
  //   setWaterData(filteredWaterData);
  // }, [dashboardData, filter]);

  useEffect(() => {
    setWaterData(filteredWaterData);
  }, [filteredWaterData]);

  // useEffect(() => {
  //   async function testDashboard() {
  //     try {
  //       const data = await getDashboardData();

  //       console.log("✅ DASHBOARD DATA =", data);
  //       console.log("💧 waterData =", data.waterData?.length);
  //       console.log("🚨 problemSummaryData =", data.problemSummaryData?.length);
  //       console.log("💧 storageSummaryData =", data.storageSummaryData?.length);
  //       console.log("🔎 filterOptions =", data.filterOptions);
  //     } catch (error) {
  //       console.error("❌ DASHBOARD LOAD FAILED", error);
  //     }
  //   }

  //   testDashboard();
  // }, []);

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
              dashboardData={dashboardData}
            />
          }
        />

        <Route path="/water-management" element={<WaterManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
