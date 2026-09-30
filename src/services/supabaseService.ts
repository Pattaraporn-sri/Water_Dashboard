import { supabase } from "../lib/supabase";
import type { ProblemSummary, StorageSummary } from "../types/Dashboard";

/**
 * ดึงข้อมูลแหล่งน้ำทั้งหมดจาก Supabase
 *
 * ใช้ pagination เพราะข้อมูลมีมากกว่า 1,000 รายการ
 */
export async function getWaterSourcesFromSupabase() {
  const PAGE_SIZE = 1000;

  let allData: any[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("water_sources")
      .select(
        `
        id,
        ec5_uuid,
        province,
        district,
        subdistrict,
        moo,
        village,
        water_name,
        water_type,
        width,
        length,
        depth,
        usage,
        usage_desc,
        problem,
        lat,
        lng,
        image,
        volume,
        source_code,
        created_at,
        uploaded_at,
        updated_at
      `,
      )
      .range(from, to);

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    allData = [...allData, ...data];

    console.log(`📥 Supabase: loaded ${allData.length} records`);

    if (data.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  console.log(`✅ Supabase: loaded total ${allData.length} records`);

  return allData;
}

export async function getDashboardDataFromSupabase() {
  try {
    const [waterData, problemSummaryData, storageSummaryData] =
      await Promise.all([
        getWaterSourcesFromSupabase(),
        getProblemSummaryFromSupabase(),
        getStorageSummaryFromSupabase(),
      ]);

    return {
      success: true,

      generatedAt: new Date().toISOString(),
      version: "supabase",

      waterData: waterData.map((item) => ({
        id: item.id,
        ec5_uuid: item.ec5_uuid,

        province: item.province,
        district: item.district,
        subdistrict: item.subdistrict,

        moo: item.moo,
        village: item.village,

        name: item.water_name,
        type: item.water_type,

        width: item.width,
        length: item.length,
        depth: item.depth,

        usage: item.usage,
        usageDesc: item.usage_desc,

        problem: item.problem,

        lat: item.lat,
        lng: item.lng,

        image: item.image,

        volume: item.volume ?? 0,

        created_at: item.created_at,
        uploaded_at: item.uploaded_at,
      })),

      problemSummaryData,
      storageSummaryData,

      filterOptions: {
        provinces: [],
        districts: [],
        subdistricts: [],
        types: [],
      },
    };
  } catch (error) {
    console.error("❌ getDashboardDataFromSupabase failed:", error);

    return {
      success: false,

      generatedAt: new Date().toISOString(),
      version: "supabase",

      error: error instanceof Error ? error.message : "Supabase request failed",

      waterData: [],
      problemSummaryData: [],
      storageSummaryData: [],

      filterOptions: {
        provinces: [],
        districts: [],
        subdistricts: [],
        types: [],
      },
    };
  }
}

export async function getProblemSummaryFromSupabase(): Promise<
  ProblemSummary[]
> {
  const PAGE_SIZE = 1000;

  let allData: any[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("water_problems")
      .select(
        `
        province,
        district,
        subdistrict,
        problem
      `,
      )
      .range(from, to);

    if (error) {
      console.error("❌ water_problems error:", error);
      throw error;
    }

    if (!data || data.length === 0) break;

    allData = [...allData, ...data];

    if (data.length < PAGE_SIZE) break;

    from += PAGE_SIZE;
  }

  // Group ตาม จังหวัด + อำเภอ + ตำบล
  const summaryMap = new Map<string, ProblemSummary>();

  for (const item of allData) {
    const province = item.province ?? "";
    const district = item.district ?? "";
    const subdistrict = item.subdistrict ?? "";
    const problem = String(item.problem ?? "").trim();

    const key = `${province}|${district}|${subdistrict}`;

    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        province,
        district,
        subdistrict,
        น้ำอุปโภคบริโภค: 0,
        น้ำเพื่อการผลิต: 0,
        น้ำท่วม: 0,
        น้ำเสีย: 0,
      });
    }

    const summary = summaryMap.get(key)!;

    switch (problem) {
      case "น้ำอุปโภคบริโภค":
        summary["น้ำอุปโภคบริโภค"]++;
        break;

      case "น้ำเพื่อการผลิต":
        summary["น้ำเพื่อการผลิต"]++;
        break;

      case "น้ำท่วม":
        summary["น้ำท่วม"]++;
        break;

      case "น้ำเสีย":
        summary["น้ำเสีย"]++;
        break;
    }
  }

  return Array.from(summaryMap.values());
}

export async function getStorageSummaryFromSupabase(): Promise<
  StorageSummary[]
> {
  const PAGE_SIZE = 1000;

  let allData: any[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("water_storage")
      .select(
        `
        province,
        district,
        subdistrict,
        water_type,
        storage_volume
      `,
      )
      .range(from, to);

    if (error) {
      console.error("❌ water_storage error:", error);
      throw error;
    }

    if (!data || data.length === 0) break;

    allData = [...allData, ...data];

    if (data.length < PAGE_SIZE) break;

    from += PAGE_SIZE;
  }

  // Group ตาม จังหวัด + อำเภอ + ตำบล + ประเภทแหล่งน้ำ
  const summaryMap = new Map<string, StorageSummary>();

  for (const item of allData) {
    const province = item.province ?? "";
    const district = item.district ?? "";
    const subdistrict = item.subdistrict ?? "";
    const type = item.water_type ?? "";

    const total = Number(item.storage_volume ?? 0);

    const key = `${province}|${district}|${subdistrict}|${type}`;

    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        province,
        district,
        subdistrict,
        type,
        total: 0,
        count: 0,
      });
    }

    const summary = summaryMap.get(key)!;

    summary.total += total;
    summary.count += 1;
  }

  return Array.from(summaryMap.values());
}

export async function getProjectBankFromSupabase() {
  const PAGE_SIZE = 1000;

  let allData: any[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("project_bank")
      .select(
        `
        id,
        province,
        district,
        subdistrict,
        strategy,
        no,
        project_name,
        project_detail,
        water_source,
        village_no,
        village_name,
        lat,
        lng,
        year,
        budget,
        benefit,
        responsible_agency,
        supporting_agency,
        created_at,
        updated_at
      `,
      )
      .range(from, to);

    if (error) {
      console.error("❌ Supabase Project Bank error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    allData = [...allData, ...data];

    console.log(`📥 Supabase Project Bank: loaded ${allData.length} records`);

    if (data.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  console.log(
    `✅ Supabase Project Bank: loaded total ${allData.length} records`,
  );

  return allData;
}
