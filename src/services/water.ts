import { BASE_URL } from "./api";
import type { SelectedFilter } from "../types/Filter";
import type { WaterSource } from "../types/Water";

export async function getWaterData(
  filter: SelectedFilter,
): Promise<WaterSource[]> {
  const params = new URLSearchParams({
    action: "water",
  });

  if (filter.province) {
    params.append("province", filter.province);
  }

  if (filter.district) {
    params.append("district", filter.district);
  }

  if (filter.subdistrict) {
    params.append("subdistrict", filter.subdistrict);
  }

  if (filter.type) {
    params.append("type", filter.type);
  }

  console.log("🚀🚀🚀 WATER API START");
  console.log("🌐 WATER URL:", `${BASE_URL}?${params.toString()}`);

  const startTime = performance.now();

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  console.log(
    "📡 WATER API RESPONSE:",
    ((performance.now() - startTime) / 1000).toFixed(2),
    "seconds",
  );

  const text = await response.text();

  console.log(
    "📦 WATER API TEXT RECEIVED:",
    ((performance.now() - startTime) / 1000).toFixed(2),
    "seconds",
  );

  if (!response.ok) {
    console.log("❌ WATER STATUS =", response.status);
    console.log("❌ WATER BODY =", text);
  }

  const data = JSON.parse(text);

  console.log(
    "✅ WATER API COMPLETE:",
    ((performance.now() - startTime) / 1000).toFixed(2),
    "seconds",
  );

  console.log("📊 WATER RECORDS:", data.length);

  return data;
}
