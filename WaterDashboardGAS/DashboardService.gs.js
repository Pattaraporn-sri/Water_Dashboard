/**
 * Dashboard Service
 * รวมข้อมูลทั้งหมดที่ใช้ใน Dashboard
 */
function getDashboardData(filter = {}) {
  return {
    filter: getFilterData(),
    kpi: getKPIData(filter),
    chart: getChartData(filter),
    map: getMapData(filter),
    table: getTableData(filter),
  };
}

function getFilterData() {

}

function getKPIData(filter) {

}

function getChartData(filter) {

}

function getMapData(filter) {

}

function getTableData(filter) {

}