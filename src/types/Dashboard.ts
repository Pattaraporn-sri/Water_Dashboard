import type { WaterSource } from "./Water";

export interface ProblemSummary {
  province: string;
  district: string;
  subdistrict: string;
  "น้ำอุปโภคบริโภค": number;
  "น้ำเพื่อการผลิต": number;
  "น้ำท่วม": number;
  "น้ำเสีย": number;
}

export interface StorageSummary {
  province: string;
  district: string;
  subdistrict: string;
  type: string;
  total: number;
  count: number;
}

export interface DashboardFilterOptions {
  provinces: string[];
  districts: string[];
  subdistricts: string[];
  types: string[];
}

export interface DashboardData {
  success: boolean;
  generatedAt: string;
  version: string;

  waterData: WaterSource[];

  problemSummaryData: ProblemSummary[];

  storageSummaryData: StorageSummary[];

  filterOptions: DashboardFilterOptions;
}