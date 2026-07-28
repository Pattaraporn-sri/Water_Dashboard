function getKPIData(filter = {}) {

  const { headers, rows } = getMasterData();

  const provinceIndex = headers.indexOf("จังหวัด");
  const districtIndex = headers.indexOf("อำเภอ");
  const subdistrictIndex = headers.indexOf("ตำบล");

  const storageIndex = headers.findIndex(header =>
    String(header).includes("ปริมาณ") &&
    String(header).includes("เก็บกัก") &&
    !String(header).includes("หน่วยงาน")
  );


  const officialStorageIndex = headers.findIndex(header =>
    String(header).includes("หน่วยงาน")
  );

  let totalWaterSource = 0;
  let totalStorage = 0;

  rows.forEach(row => {

    const province = row[provinceIndex];
    const district = row[districtIndex];
    const subdistrict = row[subdistrictIndex];

    if (filter.province && province !== filter.province) return;

    if (filter.district && district !== filter.district) return;

    if (filter.subdistrict && subdistrict !== filter.subdistrict) return;

    totalWaterSource++;

    const calculatedStorage = Number(row[storageIndex]) || 0;
    const officialStorage = Number(row[officialStorageIndex]) || 0;

    Logger.log({
    name: row[headers.indexOf("ชื่อแหล่งน้ำ")],
    calculatedStorage,
    officialStorage
  });

    // ถ้ามีค่าจากหน่วยงาน ให้ใช้ค่านั้น
    totalStorage += officialStorage > 0
      ? officialStorage
      : calculatedStorage;

  });

  return {
    totalWaterSource,
    totalStorage: getStorageKPI(filter)
  };

}