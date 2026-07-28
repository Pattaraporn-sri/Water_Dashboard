/**
 * ดึงข้อมูลสำหรับ Filter Dashboard
 *
 * @param {string} province จังหวัด (optional)
 * @param {string} district อำเภอ (optional)
 * @returns {Object}
 */
function getFilterData(province = "", district = "") {

  const { headers, rows } = getMasterData();

  const provinceIndex = headers.indexOf("จังหวัด");
  const districtIndex = headers.indexOf("อำเภอ");
  const subdistrictIndex = headers.indexOf("ตำบล");
  const typeIndex = headers.indexOf("ประเภทแหล่งน้ำ");

  const provinces = new Set();
  const districts = new Set();
  const subdistricts = new Set();
  const types = new Set();

  rows.forEach(row => {

    const rowProvince = row[provinceIndex]?.toString().trim();
    const rowDistrict = row[districtIndex]?.toString().trim();
    const rowSubdistrict = row[subdistrictIndex]?.toString().trim();
    const rowType = row[typeIndex]?.toString().trim();

    // จังหวัด
    if (rowProvince) {
      provinces.add(rowProvince);
    }

    // กรองตามจังหวัด
    if (province && rowProvince !== province) {
      return;
    }

    // อำเภอ
    if (rowDistrict) {
      districts.add(rowDistrict);
    }

    // กรองตามอำเภอ
    if (district && rowDistrict !== district) {
      return;
    }

    // ตำบล
    if (rowSubdistrict) {
      subdistricts.add(rowSubdistrict);
    }

    // ประเภทแหล่งน้ำ
    if (rowType) {
      types.add(rowType);
    }

  });

  return {
    provinces: [...provinces].sort(),
    districts: [...districts].sort(),
    subdistricts: [...subdistricts].sort(),
    types: [...types].sort()
  };

}