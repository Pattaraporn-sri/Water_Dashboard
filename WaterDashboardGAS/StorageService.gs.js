function getStorageKPI(filter = {}) {

  let totalStorage = 0;

  const sheets = [
    "CK003_DATA",
    "CK004_DATA",
    "CK005_DATA",
    "CK007_DATA"
  ];


  sheets.forEach(sheetName => {

    totalStorage += getStorageFromSheet(
      sheetName,
      filter
    );

  });


  return totalStorage;

}



// ตัวอ่านกลาง
function getStorageFromSheet(sheetName, filter = {}) {

  const ss = SpreadsheetApp.getActive();

  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return 0;
  }


  const values = sheet
    .getDataRange()
    .getValues();


  const headers = values[0];

  Logger.log("กำลังอ่าน Sheet : " + sheetName);
  Logger.log(headers);

  const provinceIndex =
    headers.indexOf("จังหวัด");

  const districtIndex =
    headers.indexOf("อำเภอ");

  const subdistrictIndex =
    headers.indexOf("ตำบล");


  const storageIndex =
    headers.indexOf("ปริมาณการเก็บกัก");


  const officialIndex =
    headers.indexOf("ปริมาณการเก็บกักจากหน่วยงาน");

  
  if (storageIndex === -1 && officialIndex === -1) {
    return 0;
  }

  let total = 0;


  values.slice(1).forEach(row => {


    // filter
    if (
      filter.province &&
      row[provinceIndex] !== filter.province
    ) return;


    if (
      filter.district &&
      row[districtIndex] !== filter.district
    ) return;


    if (
      filter.subdistrict &&
      row[subdistrictIndex] !== filter.subdistrict
    ) return;



    const calculated =
      Number(row[storageIndex]) || 0;


    const official =
      Number(row[officialIndex]) || 0;



    total += official > 0
      ? official
      : calculated;


  });

  return total;

}