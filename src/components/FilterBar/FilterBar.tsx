import { useState, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import type { FilterResponse, FilterBarProps } from "../../types/Filter";

function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterResponse>({
    provinces: [],
    districts: [],
    subdistricts: [],
    types: [],
  });

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

    if (filter.province) {
      params.append("province", filter.province);
    }

    if (filter.district) {
      params.append("district", filter.district);
    }

    if (filter.subdistrict) {
      params.append("subdistrict", filter.subdistrict);
    }

    fetch(`${BASE_URL}?${params.toString()}`)
      .then((res) => res.json())
      .then((data: FilterResponse) => {
        setFilters(data);
      })
      .catch((error) => {
        console.error("โหลด Filter ไม่สำเร็จ:", error);
      });
  }, [filter.province, filter.district, filter.subdistrict]);

  return (
    <div className="min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-kanit bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-xl mx-3 sm:mx-5 -mt-7 mb-5 px-4 py-4 relative z-10">
      <select
        value={filter.province}
        onChange={(e) => {
          const value = e.target.value;

          updateFilter(value, "", "", filter.type);
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
        value={filter.district}
        onChange={(e) => {
          const value = e.target.value;

          updateFilter(filter.province, value, "", filter.type);
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
        value={filter.subdistrict}
        onChange={(e) => {
          const value = e.target.value;

          updateFilter(filter.province, filter.district, value, filter.type);
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
        value={filter.type}
        onChange={(e) => {
          const value = e.target.value;

          updateFilter(
            filter.province,
            filter.district,
            filter.subdistrict,
            value,
          );
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
