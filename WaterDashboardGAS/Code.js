function syncMasterData() {

  const masterSS = SpreadsheetApp.getActiveSpreadsheet();

  const configSheet = masterSS.getSheetByName("Config");
  const masterSheet = masterSS.getSheetByName("Master_Data");

  if (!configSheet) {
    throw new Error("ไม่พบ Sheet : Config");
  }

  if (!masterSheet) {
    throw new Error("ไม่พบ Sheet : Master_Data");
  }

  const configData = configSheet.getDataRange().getValues();

  if (configData.length <= 1) {
    throw new Error("Config ไม่มีข้อมูล");
  }

  const configHeader = configData[0];

  const codeIndex =
    configHeader.indexOf("Code");

  const spreadsheetIdIndex =
    configHeader.indexOf("SpreadsheetID");

  const allRows = [];

  for (let i = 1; i < configData.length; i++) {

    const configRow = configData[i];

    const sourceCode =
      configRow[codeIndex];

    const spreadsheetId =
      configRow[spreadsheetIdIndex];

    if (!spreadsheetId) continue;

    try {

      const sourceSS =
        SpreadsheetApp.openById(spreadsheetId);

      const rawSheet =
        sourceSS.getSheetByName("Raw_data");

      if (!rawSheet) continue;

      const rawData =
        rawSheet.getDataRange().getValues();

      if (rawData.length <= 1) continue;

      const headers = rawData[0];

      const uuidIndex =
        headers.indexOf("ec5_uuid");

      const createdIndex =
        headers.indexOf("created_at");

      const uploadedIndex =
        headers.indexOf("uploaded_at");

      const provinceIndex =
        headers.indexOf("1_");

      const districtIndex =
        headers.indexOf("2_");

      const subDistrictIndex =
        headers.indexOf("3_");

      const villageNoIndex =
        headers.indexOf("4_");

      const villageNameIndex =
        headers.indexOf("5_");

      const waterSourceNameIndex =
        headers.indexOf("6_");

      const waterTypeIndex =
        headers.indexOf("7_");

      const widthIndex =
        headers.indexOf("27__");

      const lengthIndex =
        headers.indexOf("28__");

      const depthIndex =
        headers.indexOf("29__");

      const characterofuseIndex =
        headers.indexOf("30_");

      const discriptcharacterofuseIndex =
        headers.indexOf("31____");

      const currentsituationIndex =
        headers.indexOf("32_");

      const imageIndex =
        headers.indexOf("33_");

      const locationIndex =
        headers.indexOf("34_");

      for (let r = 1; r < rawData.length; r++) {

        const row = rawData[r];

        let latitude = "";
        let longitude = "";

        const location =
          row[locationIndex] || "";

        const latMatch =
          String(location).match(/latitude=([\d.-]+)/);

        const lngMatch =
          String(location).match(/longitude=([\d.-]+)/);

        if (latMatch) {
          latitude = latMatch[1];
        }

        if (lngMatch) {
          longitude = lngMatch[1];
        }

        allRows.push([
          row[uuidIndex],
          row[createdIndex],
          row[uploadedIndex],

          row[provinceIndex],
          row[districtIndex],
          row[subDistrictIndex],

          row[villageNoIndex],
          row[villageNameIndex],

          row[waterSourceNameIndex],
          row[waterTypeIndex],

          row[widthIndex],
          row[lengthIndex],
          row[depthIndex],

          row[characterofuseIndex],
          row[discriptcharacterofuseIndex],
          row[currentsituationIndex],

          latitude,
          longitude,

          row[imageIndex],

          sourceCode
        ]);

      }

    } catch (error) {

      Logger.log(
        "Error : " +
        sourceCode +
        " => " +
        error
      );

    }

  }

  const uniqueData = [];

  const seen = new Set();

  allRows.forEach(row => {

    const uuid = row[0];

    if (!uuid) return;

    if (seen.has(uuid)) return;

    seen.add(uuid);

    uniqueData.push(row);

  });

  if (masterSheet.getLastRow() > 1) {

    masterSheet
      .getRange(
        2,
        1,
        masterSheet.getLastRow() - 1,
        masterSheet.getLastColumn()
      )
      .clearContent();
  }

  if (uniqueData.length > 0) {

    masterSheet
      .getRange(
        2,
        1,
        uniqueData.length,
        uniqueData[0].length
      )
      .setValues(uniqueData);

  }

  Logger.log(
    "Sync Complete : " +
    uniqueData.length +
    " records"
  );

  updateCK002Data();
  updateCK003Data();
  updateCK004Data();
  updateCK005Data();
  updateCK007Data();
}

function doGet(e) {

  const template =
    HtmlService.createTemplateFromFile('Index');

  template.params =
    (e && e.parameter)
      ? e.parameter
      : {};

  return template
    .evaluate()
    .setTitle('ระบบเก็บข้อมูล');

}

function getWaterData() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Master_Data");

  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  const headers = data[0];

  const idxProv = headers.indexOf("จังหวัด");
  const idxDist = headers.indexOf("อำเภอ");
  const idxSubDist = headers.indexOf("ตำบล");

  const idxName = headers.indexOf("ชื่อแหล่งน้ำ");
  const idxType = headers.indexOf("ประเภทแหล่งน้ำ");

  const idxWidth = headers.indexOf("ความกว้าง");
  const idxLength = headers.indexOf("ความยาว");
  const idxDepth = headers.indexOf("ความลึก");

  const idxUsage = headers.indexOf("ลักษณะการใช้ประโยชน์");
  const idxUsageDesc = headers.indexOf("อธิบายลักษณะการใช้ประโยชน์");

  const idxProblem = headers.indexOf("สถานการณ์ปัญหา");

  const idxLat = headers.indexOf("lat");
  const idxLng = headers.indexOf("lng");

  const idxImage = headers.indexOf("รูปภาพ");

  const result = [];

  for (let i = 1; i < data.length; i++) {

    const row = data[i];

    const width = parseFloat(row[idxWidth]) || 0;
    const length = parseFloat(row[idxLength]) || 0;
    const depth = parseFloat(row[idxDepth]) || 0;

    result.push({

      prov: row[idxProv] || "",
      dist: row[idxDist] || "",
      subdist: row[idxSubDist] || "",

      name: row[idxName] || "",
      type: row[idxType] || "",

      width: width,
      length: length,
      depth: depth,

      usage: row[idxUsage] || "",
      usageDesc: row[idxUsageDesc] || "",

      problem: row[idxProblem] || "",

      lat: parseFloat(row[idxLat]) || null,
      lng: parseFloat(row[idxLng]) || null,

      image: row[idxImage] || "",

      volume: width * length * depth

    });

  }

  return result;
}

function testProblem() {

  const data = getWaterData();

  const result = data
    .filter(d => d.problem)
    .slice(0, 10);

  Logger.log(JSON.stringify(result));

}

// Boundary
function getBoundaryGeoJSON() {
  const file =
    DriveApp.getFileById("1CFiM75gir9m6uTYKjYnRm9mylZCedPoe");

  return file.getBlob().getDataAsString();
}

function norm(v) {
  return (v || "").toString().trim();
}

// สำหรับแสดง CK002
function getCK002Summary(province, district, subdistrict) {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("CK002_DATA");

  const values =
    sheet.getDataRange()
      .getValues();

  Logger.log( "Rows in CK002_DATA = " + + values.length);

  const result = {
    "น้ำอุปโภคบริโภค": 0,
    "น้ำเพื่อการผลิต": 0,
    "น้ำท่วม": 0,
    "น้ำเสีย": 0
  };

  // normalize INPUT แค่ครั้งเดียว
  province = norm(province);
  district = norm(district);
  subdistrict = norm(subdistrict);

  // convert "ทั้งหมด" → ""
  if (!province || province === "ทั้งหมด") province = "";
  if (!district || district === "ทั้งหมด") district = "";
  if (!subdistrict || subdistrict === "ทั้งหมด") subdistrict = "";

  for (let i = 1; i < values.length; i++) {

    // ✅ normalize DATA ฝั่ง sheet
    const prov = (values[i][0]);
    const dist = (values[i][1]);
    const sub = (values[i][2]);
    const type = (values[i][3]);

    // filter
    if (province && prov !== province) continue;
    if (district && dist !== district) continue;
    if (subdistrict && sub !== subdistrict) continue;

    if (result[type] !== undefined) {
      result[type]++;
    }
  }
  Logger.log(result);

  return result;
}

function updateCK002Data() {
  const lock =
    LockService.getScriptLock();
  try {

    lock.waitLock(30000);

    const master = SpreadsheetApp.getActiveSpreadsheet();

    const configSheet =
      master.getSheetByName("config");

    const outputSheet =
      master.getSheetByName("CK002_DATA");

    const configs =
      configSheet
        .getRange(
          2,
          1,
          configSheet.getLastRow() - 1,
          5
        )
        .getValues();

    // เก็บข้อมูลทั้งหมดไว้ใน array ก่อน
    const outputData = [
      [
        "จังหวัด",
        "อำเภอ",
        "ตำบล",
        "ประเภทปัญหา"
      ]
    ];

    configs.forEach(row => {

      const prov = row[1];
      const dist = row[2];
      const sub = row[3];
      const spreadsheetId = row[4];

      try {

        const ss =
          SpreadsheetApp.openById(
            spreadsheetId
          );

        const ck002 =
          ss.getSheetByName("CK002");

        if (!ck002) return;

        const values =
          ck002.getDataRange()
            .getValues();

        for (let i = 6; i < values.length; i++) {

          const problemType =
            values[i][2];

          if (!problemType) continue;

          outputData.push([
            prov,
            dist,
            sub,
            problemType
          ]);
        }

      } catch (err) {

        Logger.log(
          `ERROR ${spreadsheetId}: ${err}`
        );

      }

    });

    // ล้างข้อมูลเก่า
    outputSheet.clearContents();

    // เขียนข้อมูลทั้งหมดทีเดียว
    outputSheet
      .getRange(
        1,
        1,
        outputData.length,
        outputData[0].length
      )
      .setValues(outputData);

    SpreadsheetApp.flush();

    Logger.log(
      `CK002_DATA Updated : ${outputData.length - 1} rows`
    );
  } finally {

    lock.releaseLock();

  }
}

// ดึงข้อมูล CK003
function updateCK003Data() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const configSheet = ss.getSheetByName("config");
    const outputSheet = ss.getSheetByName("CK003_DATA");

    outputSheet.clearContents();

    outputSheet.appendRow([
      "จังหวัด",
      "อำเภอ",
      "ตำบล",
      "ปริมาณเก็บกักรวม (คำนวณ)",
      "ปริมาณเก็บกักรวม (หน่วยงานราชการ)",
      "ปริมาณที่ใช้"
    ]);

    const configs = configSheet.getRange(2,1,configSheet.getLastRow()-1,5).getValues();

    configs.forEach(row => {

      const prov = row[1];
      const dist = row[2];
      const sub  = row[3];
      const id   = row[4];

      const ss2 = SpreadsheetApp.openById(id);
      const sheet = ss2.getSheetByName("CK003");
      if (!sheet) return;

      const values = sheet.getDataRange().getValues();

      for (let i = 6; i < values.length; i++) {

        const calc = values[i][16];
        const gov  = values[i][17];

        const volume = (gov !== "" && gov != null) ? gov : calc;

        outputSheet.appendRow([
          prov, dist, sub,
          Number(calc),
          Number(gov),
          Number(volume)
        ]);
      }
    });

  } finally {
    lock.releaseLock();
  }
}

// ดึงข้อมูล CK004
function updateCK004Data() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const configSheet = ss.getSheetByName("config");
    const outputSheet = ss.getSheetByName("CK004_DATA");

    outputSheet.clearContents();

    outputSheet.appendRow([
      "จังหวัด",
      "อำเภอ",
      "ตำบล",
      "ปริมาณเก็บกักรวม (คำนวณ)",
      "ปริมาณเก็บกักรวม (หน่วยงานราชการ)",
      "ปริมาณที่ใช้"
    ]);

    const configs = configSheet.getRange(2,1,configSheet.getLastRow()-1,5).getValues();

    configs.forEach(row => {

      const prov = row[1];
      const dist = row[2];
      const sub  = row[3];
      const id   = row[4];

      const ss2 = SpreadsheetApp.openById(id);
      const sheet = ss2.getSheetByName("CK004");
      if (!sheet) return;

      const values = sheet.getDataRange().getValues();

      for (let i = 6; i < values.length; i++) {

        const calc = values[i][21];
        const gov  = values[i][22];

        const volume = (gov !== "" && gov != null) ? gov : calc;

        outputSheet.appendRow([
          prov, dist, sub,
          Number(calc),
          Number(gov),
          Number(volume)
        ]);
      }
    });

  } finally {
    lock.releaseLock();
  }
}

// ดึงข้อมูล CK005
function updateCK005Data() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const configSheet = ss.getSheetByName("config");
    const outputSheet = ss.getSheetByName("CK005_DATA");

    outputSheet.clearContents();

    outputSheet.appendRow([
      "จังหวัด",
      "อำเภอ",
      "ตำบล",
      "ปริมาณเก็บกักรวม (คำนวณ)",
      "ปริมาณเก็บกักรวม (หน่วยงานราชการ)",
      "ปริมาณที่ใช้"
    ]);

    const configs = configSheet.getRange(2,1,configSheet.getLastRow()-1,5).getValues();

    configs.forEach(row => {

      const prov = row[1];
      const dist = row[2];
      const sub  = row[3];
      const id   = row[4];

      const ss2 = SpreadsheetApp.openById(id);
      const sheet = ss2.getSheetByName("CK005");
      if (!sheet) return;

      const values = sheet.getDataRange().getValues();

      for (let i = 6; i < values.length; i++) {

        const calc = values[i][21];
        const gov  = values[i][22];

        const volume = (gov !== "" && gov != null) ? gov : calc;

        outputSheet.appendRow([
          prov, dist, sub,
          Number(calc),
          Number(gov),
          Number(volume)
        ]);
      }
    });

  } finally {
    lock.releaseLock();
  }
}

// ดึงข้อมูล CK007
function updateCK007Data() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const configSheet = ss.getSheetByName("config");
    const outputSheet = ss.getSheetByName("CK007_DATA");

    outputSheet.clearContents();

    outputSheet.appendRow([
      "จังหวัด",
      "อำเภอ",
      "ตำบล",
      "ปริมาณเก็บกักรวม (คำนวณ)",
      "ปริมาณเก็บกักรวม (หน่วยงานราชการ)",
      "ปริมาณที่ใช้"
    ]);

    const configs = configSheet.getRange(2,1,configSheet.getLastRow()-1,5).getValues();

    configs.forEach(row => {

      const prov = row[1];
      const dist = row[2];
      const sub  = row[3];
      const id   = row[4];

      const ss2 = SpreadsheetApp.openById(id);
      const sheet = ss2.getSheetByName("CK007");
      if (!sheet) return;

      const values = sheet.getDataRange().getValues();

      for (let i = 6; i < values.length; i++) {

        const calc = values[i][18];
        const gov  = values[i][19];

        const volume = (gov !== "" && gov != null) ? gov : calc;

        outputSheet.appendRow([
          prov, dist, sub,
          Number(calc),
          Number(gov),
          Number(volume)
        ]);
      }
    });

  } finally {
    lock.releaseLock();
  }
}

// ฟังก์ชันสรุปข้อมูล
function getCK004Summary(
  province,
  district,
  subdistrict
) {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("CK004_DATA");

  const values =
    sheet.getDataRange()
         .getValues();

  let totalVolume = 0;

  for (let i = 1; i < values.length; i++) {

    const prov = values[i][0];
    const dist = values[i][1];
    const sub = values[i][2];
    const volume =
      Number(values[i][3]) || 0;

    if (
      province &&
      province !== "ทั้งหมด" &&
      prov !== province
    ) continue;

    if (
      district &&
      district !== "ทั้งหมด" &&
      dist !== district
    ) continue;

    if (
      subdistrict &&
      subdistrict !== "ทั้งหมด" &&
      sub !== subdistrict
    ) continue;

    totalVolume += volume;
  }

  return totalVolume;
}

// รวมปริมาณการเก็บกักจาก CK003-CK007 KPI
function getTotalStorage(
  province,
  district,
  subdistrict
) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheetNames = [
    "CK003_DATA",
    "CK004_DATA",
    "CK005_DATA",
    "CK007_DATA"
  ];

  let totalVolume = 0;

  sheetNames.forEach(sheetName => {

    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) return;

    const values = sheet.getDataRange().getValues();

    for (let i = 1; i < values.length; i++) {

      const prov = values[i][0];
      const dist = values[i][1];
      const sub = values[i][2];
      const volume = Number(values[i][5]) || 0;

      if (
        province &&
        province !== "ทั้งหมด" &&
        prov !== province
      ) continue;

      if (
        district &&
        district !== "ทั้งหมด" &&
        dist !== district
      ) continue;

      if (
        subdistrict &&
        subdistrict !== "ทั้งหมด" &&
        sub !== subdistrict
      ) continue;

      totalVolume += volume;

    }

  });

  return totalVolume;

}

// กราฟปริมาณการเก็บกักแยกตามประเภทแหล่งน้ำใช้ตัวนี้ 
function getStorageByType(province, district, subdistrict) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheets = [
    { name: "CK003_DATA", type: "เส้นทางน้ำ" },
    { name: "CK004_DATA", type: "แหล่งเก็บกักน้ำผิวดิน" },
    { name: "CK005_DATA", type: "อาคารชลศาสตร์" },
    { name: "CK007_DATA", type: "น้ำประปา" }
  ];

  const result = {};

  sheets.forEach(s => {

    const sheet = ss.getSheetByName(s.name);
    if (!sheet) return;

    const values = sheet.getDataRange().getValues();

    let total = 0;

    for (let i = 1; i < values.length; i++) {

      const prov = values[i][0];
      const dist = values[i][1];
      const sub  = values[i][2];
      const volume = Number(values[i][5]) || 0;

      if (!volume || isNaN(volume)) continue;
      if (province && province !== "ทั้งหมด" && prov !== province) continue;
      if (district && district !== "ทั้งหมด" && dist !== district) continue;
      if (subdistrict && subdistrict !== "ทั้งหมด" && sub !== subdistrict) continue;

      total += volume;
    }

    result[s.type] = total;

  });

  return result;

}

// รวม KPI + Chart เป็น call เดียว
function getStorageDashboard(province, district, subdistrict) {
  Logger.log("===== getDashboardStorage =====");
  Logger.log({
  province: province,
  district: district,
  subdistrict: subdistrict
  });

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheets = [
    { name: "CK003_DATA", type: "เส้นทางน้ำ" },
    { name: "CK004_DATA", type: "แหล่งเก็บกักน้ำผิวดิน" },
    { name: "CK005_DATA", type: "อาคารชลศาสตร์" },
    { name: "CK007_DATA", type: "น้ำประปา" }
  ];

  const result = {};
  let total = 0;

  sheets.forEach(s => {

    const sheet = ss.getSheetByName(s.name);
    if (!sheet) return;

    const values = sheet.getDataRange().getValues();


    let sum = 0;

    for (let i = 1; i < values.length; i++) {

      const prov = values[i][0];
      const dist = values[i][1];
      const sub  = values[i][2];
      const volume = Number(values[i][3]) || 0;

      if (province && province !== "ทั้งหมด" && prov !== province) continue;
      if (district && district !== "ทั้งหมด" && dist !== district) continue;
      if (subdistrict && subdistrict !== "ทั้งหมด" && sub !== subdistrict) continue;

      sum += volume;
    }

    result[s.type] = sum;
    total += sum;
  });

  Logger.log({
  total: total,
  byType: result
});

  return {
    byType: result,
    total: total
  };
}

const typeMap = {
  CK003_DATA: [
    "ลำห้วย/คลอง/ลำประโดง/ลำธาร/เหมืองดิน"
  ],

  CK004_DATA: [
    "หนอง/บึง/กุด/อ่างเก็บน้ำ/พรุ/ทะเลสาบ/บ่อน้ำ/สระน้ำ/แก้มลิง"
  ],

  CK005_DATA: [
    "ฝาย/นบ"
  ],

  CK007_DATA: [
    "ระบบประปาหมู่บ้าน"
  ]
};

function getCKByType(type) {
  for (const [ck, list] of Object.entries(typeMap)) {
    if (list.includes(type)) return ck;
  }
  return null;
}

function getDashboardStorage(province, district, subdistrict) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheets = [
    "CK003_DATA",
    "CK004_DATA",
    "CK005_DATA",
    "CK007_DATA"
  ];

  let totalAll = 0;
  const byType = {};

  sheets.forEach(sheetName => {

    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;

    const values = sheet.getDataRange().getValues();

    for (let i = 1; i < values.length; i++) {

      const prov = values[i][0];
      const dist = values[i][1];
      const sub  = values[i][2];
      const volume = Number(values[i][5]) || 0;

      const types = typeMap[sheetName];

      Logger.log(sheetName);
      Logger.log(types);

  
      // if (typeFilter && typeFilter !== "ทั้งหมด") {
      //   if (!types.includes(typeFilter)) continue;
      // }

      if (province && province !== "ทั้งหมด" && prov !== province) continue;
      if (district && district !== "ทั้งหมด" && dist !== district) continue;
      if (subdistrict && subdistrict !== "ทั้งหมด" && sub !== subdistrict) continue;

      Logger.log({
      province: prov,
      district: dist,
      subdistrict: sub,
      volume: volume
      });


      totalAll += volume;

    
      types.forEach(t => {
        if (!byType[t]) byType[t] = 0;
        byType[t] += volume;
      });
    }
  });

  Logger.log("byType = " + JSON.stringify(byType));
  Logger.log("total = " + totalAll);

  return {
    total: totalAll,
    byType: byType
  };
}

function testDashboardStorage() {

  const result = getDashboardStorage("", "", "");

  Logger.log(
    JSON.stringify(result, null, 2)
  );

}

function testFilter() {
  Logger.log(getFilterData());
}

function testKPI() {

  const { headers } = getMasterData();
  const storageIndex = headers.findIndex(header =>
    String(header).includes("ปริมาณ") &&
    String(header).includes("เก็บกัก") &&
    !String(header).includes("หน่วยงาน")
  );


  const officialStorageIndex = headers.findIndex(header =>
    String(header).includes("หน่วยงาน")
  );

  Logger.log(headers);
  Logger.log(storageIndex);
  Logger.log(officialStorageIndex);

}










