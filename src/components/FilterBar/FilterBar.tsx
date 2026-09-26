import type { FilterBarProps } from "../../types/Filter";
import type { WaterSource } from "../../types/Water";

interface NewFilterBarProps extends FilterBarProps {
  waterData: WaterSource[];
}

function FilterBar({ filter, onFilterChange, waterData }: NewFilterBarProps) {
  const updateFilter = (
    province: string,
    district: string,
    subdistrict: string,
    type: string,
  ) => {
    onFilterChange({
      province,
      district,
      subdistrict,
      type,
    });
  };

  // -----------------------------
  // จังหวัด
  // -----------------------------
  const provinces = Array.from(
    new Set(waterData.map((item) => item.province?.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "th"));

  // -----------------------------
  // อำเภอ
  // -----------------------------
  const districts = Array.from(
    new Set(
      waterData
        .filter((item) => !filter.province || item.province === filter.province)
        .map((item) => item.district?.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "th"));

  // -----------------------------
  // ตำบล
  // -----------------------------
  const subdistricts = Array.from(
    new Set(
      waterData
        .filter(
          (item) =>
            (!filter.province || item.province === filter.province) &&
            (!filter.district || item.district === filter.district),
        )
        .map((item) => item.subdistrict?.trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "th"));

  // -----------------------------
  // ประเภทแหล่งน้ำ
  // -----------------------------
  // -----------------------------
  // ประเภทแหล่งน้ำ
  // -----------------------------

  const types = [
    "บ่อน้ำตื้น/บ่อตอก/บ่อวง",
    "บ่อบาดาล/บ่อโยก",
    "หนอง/บึง/กุด",
    "อ่างเก็บน้ำ",
    "เขื่อน",
    "อาคารชลศาสตร์",
    "สระน้ำ/บ่อน้ำ/แก้มลิง (มนุษย์สร้าง)",
    "พรุ/ทะเลสาบ/บ่อน้ำ",
    "ลำห้วย/คลอง/ลำประโดง/ลำธาร/แม่น้ำ/เหมืองดิน",
    "ระบบประปาหมู่บ้าน",
  ];
  
  // const types = Array.from(
  //   new Set(
  //     waterData
  //       .filter(
  //         (item) =>
  //           (!filter.province || item.province === filter.province) &&
  //           (!filter.district || item.district === filter.district) &&
  //           (!filter.subdistrict || item.subdistrict === filter.subdistrict),
  //       )
  //       .map((item) => item.type?.trim())
  //       .filter(Boolean),
  //   ),
  // ).sort((a, b) => a.localeCompare(b, "th"));

  return (
    <div className="min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-kanit bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-xl mx-3 sm:mx-5 -mt-7 mb-5 px-4 py-4 relative z-10">
      {/* จังหวัด */}
      <select
        value={filter.province}
        onChange={(e) => {
          const value = e.target.value;

          updateFilter(value, "", "", "");
        }}
        className="h-8 w-full min-w-0 rounded-lg bg-white p-1 border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <option value="">📍 ทุกจังหวัด</option>

        {provinces.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>

      {/* อำเภอ */}
      <select
        value={filter.district}
        onChange={(e) => {
          const value = e.target.value;

          updateFilter(filter.province, value, "", "");
        }}
        className="h-8 w-full min-w-0 rounded-lg bg-white p-1 border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <option value="">📍 ทุกอำเภอ</option>

        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      {/* ตำบล */}
      <select
        value={filter.subdistrict}
        onChange={(e) => {
          const value = e.target.value;

          updateFilter(filter.province, filter.district, value, "");
        }}
        className="h-8 w-full min-w-0 rounded-lg bg-white p-1 border border-gray-300 focus:border-sky-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      >
        <option value="">📍 ทุกตำบล</option>

        {subdistricts.map((subdistrict) => (
          <option key={subdistrict} value={subdistrict}>
            {subdistrict}
          </option>
        ))}
      </select>

      {/* ประเภทแหล่งน้ำ */}
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

        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBar;
