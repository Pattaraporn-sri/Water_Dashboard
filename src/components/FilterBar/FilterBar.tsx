import { useState, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import type { FilterResponse, FilterBarProps } from "../../types/Filter";

function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterResponse>({
    provinces: [],
    districts: [],
    subdistricts: [],
    types: [],
  });
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [waterType, setWaterType] = useState("");

  const updateFilter = (p: string, d: string, s: string, t: string) => {
    onFilterChange({
      province: p,
      district: d,
      subdistrict: s,
      type: t,
    });
  };

  useEffect(() => {
    const params = new URLSearchParams({
      action: "filter",
    });

    if (province) {
      params.append("province", province);
    }

    if (district) {
      params.append("district", district);
    }

    if (subdistrict) {
      params.append("subdistrict", subdistrict);
    }

    // console.log(params.toString());

    fetch(`${BASE_URL}?${params.toString()}`)
      .then((res) => res.json())
      .then((data: FilterResponse) => {
        // console.log(data);
        setFilters(data);
      })
      .catch((error) => {
        console.error("โหลด Filter ไม่สำเร็จ:", error);
      });
  }, [province, district, subdistrict]);

  return (
    <div className="w-full max-w-[1650px] min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-kanit bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-xl ml-5 mb-5 -mt-7 px-4 py-4">
      <select
        value={province}
        onChange={(e) => {
          const value = e.target.value;

          setProvince(value);
          setDistrict("");
          setSubdistrict("");

          updateFilter(value, "", "", waterType);
        }}
        className="h-8 w-full min-w-0 rounded-lg bg-white p-1 border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <option value="">📍 ทุกจังหวัด</option>

        {filters.provinces.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={district}
        onChange={(e) => {
          const value = e.target.value;

          setDistrict(value);
          setSubdistrict("");

          updateFilter(province, value, "", waterType);
        }}
        className="h-8 w-full min-w-0 rounded-lg bg-white p-1 border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <option value="">📍 ทุกอำเภอ</option>

        {filters.districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        value={subdistrict}
        onChange={(e) => {
          const value = e.target.value;

          setSubdistrict(value);  

          updateFilter(province, district, value, waterType);
        }}
        className="h-8 w-full min-w-0 rounded-lg bg-white p-1 border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <option value="">📍 ทุกตำบล</option>

        {filters.subdistricts.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={waterType}
        onChange={(e) => {
          const value = e.target.value;

          setWaterType(value);

          updateFilter(province, district, subdistrict, value);
        }}
        className="h-8 w-full min-w-0 rounded-lg bg-white p-1 border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <option value="">💧 ประเภทแหล่งน้ำทั้งหมด</option>

        {filters.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBar;
