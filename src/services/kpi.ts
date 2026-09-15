import type { SelectedFilter } from "../types/Filter";
import { BASE_URL } from "./api";

export async function getKPIData(filter: SelectedFilter) {
  const params = new URLSearchParams({
    action: "kpi",
    province: filter.province,
    district: filter.district,
    subdistrict: filter.subdistrict,
    type: filter.type,
  });
  console.log("🎯 KPI FILTER SENT:", {
    province: filter.province,
    district: filter.district,
    subdistrict: filter.subdistrict,
    type: filter.type,
  });

  console.log("🎯 KPI REQUEST URL:", `${BASE_URL}?${params.toString()}`);

  const url = `${BASE_URL}?${params.toString()}`;

  console.log("🚀 KPI API START");
  console.log("🌐 KPI URL:", url);

  const startTime = performance.now();

  const res = await fetch(url);

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log("📡 KPI API RESPONSE:", elapsed, "seconds");
  console.log("📡 STATUS:", res.status);
  console.log("📡 OK:", res.ok);
  console.log("📡 REDIRECTED:", res.redirected);
  console.log("📡 FINAL URL:", res.url);

  if (!res.ok) {
    const errorText = await res.text();

    console.error("❌ KPI API ERROR:", errorText);

    throw new Error(`KPI API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  console.log(
    "✅ KPI API COMPLETE:",
    ((performance.now() - startTime) / 1000).toFixed(2),
    "seconds",
  );

  console.log("🚨 CK002 problemSummary:", data.problemSummary);

  return data;
}
