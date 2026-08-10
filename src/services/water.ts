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
  // console.log(params.toString());

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  const text = await response.text();

  // console.log("WATER API RESPONSE", text);
  // console.log(text);

  if (!response.ok) {
    console.log("STATUS =", response.status);
    console.log("BODY =", text);
  }

  return JSON.parse(text);

  //   return response.json();
}
