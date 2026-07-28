import FilterBar from "../components/FilterBar/FilterBar";
import Header from "../components/Header/Header";
import KPISection from "../components/KPI/KPISection";
import SummaryTable from "../components/Table/SummaryTable";
import MapView from "../components/Map/MapView";
import Loader from "../components/Loader/Loader";

export const tableColumns = [
  "ลำดับ",
  "ชื่อแหล่งน้ำ",
  "ประเภท",
  "จังหวัด",
  "อำเภอ",
  "ตำบล",
  "ความกว้าง (ม.)",
  "ควมายาว (ม.)",
  "ความลึก (ม.)",
  "ปริมาตร",
];

export const tableRows = [
  [
    "1",
    "ห้วย",
    "ลำห้วย/คลอง/ลำประโดง/ลำธาร/แม่น้ำ/เหมืองดิน",
    "ขอนแก่น",
    "เมือง",
    "บ้านเป็ด",
    50,
    45,
    6,
    500,
  ],
  [
    "2",
    "ห้วย",
    "ลำห้วย/คลอง/ลำประโดง/ลำธาร/แม่น้ำ/เหมืองดิน",
    "ขอนแก่น",
    "เมือง",
    "บ้านเป็ด",
    50,
    45,
    6,
    500,
  ],
  [
    "3",
    "ห้วย",
    "ลำห้วย/คลอง/ลำประโดง/ลำธาร/แม่น้ำ/เหมืองดิน",
    "ขอนแก่น",
    "เมือง",
    "บ้านเป็ด",
    50,
    45,
    6,
    500,
  ],
  [
    "4",
    "ห้วย",
    "ลำห้วย/คลอง/ลำประโดง/ลำธาร/แม่น้ำ/เหมืองดิน",
    "ขอนแก่น",
    "เมือง",
    "บ้านเป็ด",
    50,
    45,
    6,
    500,
  ],
  [
    "5",
    "ห้วย",
    "ลำห้วย/คลอง/ลำประโดง/ลำธาร/แม่น้ำ/เหมืองดิน",
    "ขอนแก่น",
    "เมือง",
    "บ้านเป็ด",
    50,
    45,
    6,
    500,
  ],
];

function Dashboard() {
  return (
    <div className="bg-slate-100">
      {/* <Loader /> */}
      <Header />
      <FilterBar />
      <KPISection />
      <SummaryTable columns={tableColumns} rows={tableRows} />
    </div>
  );
}

export default Dashboard;
