/**
 * อ่านข้อมูลจากชีต MASTER_DATA
 * @returns {{headers: string[], rows: any[][]}}
 */
function getMasterData() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName(SHEET.MASTER);

  const values = sheet.getDataRange().getValues();

  const headers = values.shift();

  return {
    headers,
    rows: values
  };

}