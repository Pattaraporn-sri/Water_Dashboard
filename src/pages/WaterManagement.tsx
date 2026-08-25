import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

const WaterManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5 font-kanit">
      <div className="bg-green-600 flex justify-center items-center p-4 rounded-lg">
        <h1 className="text-3xl font-bold">การบริหารจัดการน้ำ</h1>
      </div>

      <Breadcrumb
        items={[
          {
            title: (
              <span onClick={() => navigate("/")} className="cursor-pointer">
                Home
              </span>
            ),
          },
          {
            title: "Water Management",
          },
        ]}
        className="mt-2"
      />

      <div className="flex gap-2 mt-4">
        <button>จังหวัด</button>
        <button>อำเภอ</button>
        <button>ตำบล</button>
        <button>ปีงบประมาณ</button>
      </div>
      <div className="flex gap-4">
        <div className="bg-orange-300 p-4 mt-4 rounded-lg w-60">
        โครงการทั้งหมด 128 โครงการ
      </div>
      <div className="bg-orange-300 p-4 mt-4 rounded-lg w-60">
        142.5340 ล้านบาท
      </div>
      </div>
      
      <div className="flex justify-between gap-4 mt-4">
        <div className="bg-yellow-100 rounded-lg w-1/2 p-4">
          <p className="font-bold text-lg">
            ยุทธศาสตร์การบริหารจัดการทรัพยากรน้ำ 5 ด้าน
          </p>
          <div> กราฟวงกลม </div>
        </div>
        <div className="bg-blue-300 h-64 rounded-lg ">
          MAP
        </div>
      </div>
      <div>
        <p className="font-bold text-xl p-4 mt-4">รายละเอียดโครงการ (ตาราง)</p>
      </div>
    </div>
  );
};

export default WaterManagement;
