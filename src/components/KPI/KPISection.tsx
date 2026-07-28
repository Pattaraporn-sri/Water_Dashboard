import Chart from "../Charts/ChartCard";
import DoughnutChart from "../Charts/DoughnutChart";
import HorizontalBarChart from "../Charts/HorizontalBarChart";
import MapView from "../Map/MapView";
import { mapData } from "../../mocks/MapMock";

function KPISection() {
  return (
    <div className="font-kanit">
      <div className="flex flex-col items-end mr-5 ">
        <div className="flex">
          {/* KPI */}
          <div className="bg-gradient-to-br from-[#0077b6] to-[#023e8a] w-[265px] h-24 flex items-center justify-center flex-col text-white text-base rounded-xl shadow-lg font-bold">
            <span className="text-base">จำนวนแหล่งน้ำทั้งหมด (แห่ง)</span>
            <p className="text-2xl">294</p>
          </div>
          {/* KPI */}
          <div className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6] w-[265px] h-24 flex items-center justify-center flex-col text-white text-base ml-2 rounded-xl shadow-lg font-bold">
            <span className="text-base">ปริมาณการเก็บกักน้ำรวม (ลบ.ม.)</span>
            <p className="text-2xl">1,234</p>
          </div>
        </div>
        <div className="bg-white w-[535px] h-80 flex pt-5 pl-5 flex-col ml-5 mt-5 text-white rounded-xl shadow-lg">
          <span className="text-base text-[#023e8a]">
            ภาพถ่ายแหล่งน้ำ (นำเสนอทีละภาพ)
          </span>
          <hr className="w-[340px] border-t border-[#023e8a] my-2" />
        </div>
      </div>

      <div className="ml-5 mr-5 absolute -mt-[435px] shadow-lg">
        <MapView data={mapData} />
      </div>

      <div className="flex">
        <div className="bg-white w-[930px] h-[330px] p-5 flex-col text-[#023e8a] rounded-xl shadow-lg ml-5 mt-16">
          <Chart
            title="💧 ปริมาณกักเก็บน้ำแยกตามประเภทแหล่งน้ำ (ลบ.ม.)"
            subtitle=""
          >
            <HorizontalBarChart
              labels={[
                "ลำห้วย/คลอง/ลำประโดง/ลำธาร/แม่น้ำ/เหมืองดิน",
                "บ่อน้ำตื้น/บ่อตอก/บ่อวง",
                "บ่อบาดาล/บ่อโยก",
                "หนอง/บึง/กุด",
                "อ่างเก็บน้ำ",
                "เขื่อน",
                "อาคารชลศาสตร์",
                "สระน้ำ/บ่อน้ำ/แก้มลิง (มนุษย์สร้าง)",
                "พรุ/ทะเลสาบ/บ่อน้ำ",
                "ระบบประปาหมู่บ้าน",
              ]}
              values={[
                10000, 25004, 25000, 48000, 14000, 78500, 25444, 15200, 145602,
                452100,
              ]}
            ></HorizontalBarChart>
          </Chart>
        </div>

        <div className="bg-white w-[535px] h-[350px] pl-5 pt-5 m-5 ml-auto rounded-xl shadow-lg text-[#023e8a]">
          <Chart title="🌊 สัดส่วนประเภทแหล่งน้ำ" subtitle="">
            <DoughnutChart
              label={[
                "หนอง/บึง/กุด",
                "สระน้ำ/บ่อน้ำ/แก้มลิง (มนุษย์สร้าง)",
                "บ่อบาดาล/บ่อโยก",
                "ลำห้วย/คลอง/ลำประโดง",
                "พรุ/ทะเลสาบ/บ่อน้ำ",
                "ระบบประปาหมู่บ้าน",
                "อาคารชลศาสตร์",
                "อ่างเก็บน้ำ",
                "บ่อตอก/บ่อตื้น/บ่อวง",
                "เขื่อน",
              ]}
              values={[50, 20, 10, 5, 45, 18, 2, 23, 16, 8]}
            />
          </Chart>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="bg-white w-[535px] h-[350px] pl-5 pt-5 mr-5 mb-5 ml-auto -mt-[10px] rounded-xl shadow-lg text-[#023e8a]">
          <Chart title="🎯 การใช้ประโยชน์แหล่งน้ำ" subtitle="">
            <DoughnutChart
              label={[
                "การเกษตร",
                "การเกษตร และอุปโภค บริโภค",
                "อุปโภค บริโภค",
                "ไม่ได้ใช้ประโยชน์",
                "ไม่ระบุ",
              ]}
              values={[50, 20, 10, 5, 45]}
            />
          </Chart>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="bg-white w-[930px] h-[330px] pt-5 pl-5 text-[#023e8a] rounded-xl shadow-lg mr-5 ml-5 -mt-[345px]">
          <Chart title="🚨 ปัญหาด้านน้ำในพื้นที่" subtitle="">
            <HorizontalBarChart
              labels={[
                "น้ำท่วม",
                "น้ำเพื่อการผลิต",
                "น้ำอุปโภค บริโภค",
                "น้ำเสีย",
              ]}
              values={[5, 10, 4, 3]}
            />
          </Chart>
        </div>
      </div>
    </div>
  );
}

export default KPISection;
