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

  const res = await fetch(`${BASE_URL}?${params}`);

  return res.json();
}
