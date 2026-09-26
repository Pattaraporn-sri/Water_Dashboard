import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../services/api";
import BudgetYearFilter from "../components/FilterBar/BudgetYearFilter";
import Header from "../components/Header/Header";
import type { SelectedFilter } from "../types/Filter";
import StrategyChart from "../components/Charts/StrategyChart";
import VillageProjectChart from "../components/Charts/VillageProjectChart";
import WaterSourceChart from "../components/Charts/WaterSourceChart";
import strategy from "../assets/strategy.png";
import village from "../assets/village.png";
import water from "../assets/sea.png";
import projectDetail from "../assets/project.png";
import ProjectTable from "../components/Table/ProjectTable";
import { Modal } from "antd";
import StrategyFilter from "../components/FilterBar/StrategyFilter";
import type { WaterSource } from "../types/Water";
import FilterBar from "../components/FilterBar/FilterBar";

interface ProjectBank {
  no: number | string;
  projectName: string;
  projectDetail: string;
  responsibleAgency: string;
  supportingAgency: string;
  budget: number;
  year: number;
  strategy: string;
  benefit: string;
  villageNo: number | string;
  villageName: string;
  waterSource: string;
  lat: number | null;
  long: number | null;
}

interface WaterManagementState {
  province: string;
  district: string;
  subdistrict: string;
}

interface WaterManagementProps {
  filter: SelectedFilter;
  setFilter: React.Dispatch<React.SetStateAction<SelectedFilter>>;
  waterData: WaterSource[];
}

const WaterManagement = ({
  filter,
  setFilter,
  waterData,
}: WaterManagementProps) => {
  const [projects, setProjects] = useState<ProjectBank[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState<ProjectBank | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const state = location.state as WaterManagementState | null;

  const { province, district, subdistrict } = filter;
  // const province = state?.province || "";
  // const district = state?.district || "";
  // const subdistrict = state?.subdistrict || "";

  // console.log("===== WATER MANAGEMENT STATE =====");
  // console.log("location.state:", location.state);
  // console.log("province:", province);
  // console.log("district:", district);
  // console.log("subdistrict:", subdistrict);

  // สร้างปีจากข้อมูลโครงการที่ได้รับมา
  const years = Array.from(
    new Set(projects.map((project) => String(project.year)).filter(Boolean)),
  ).sort((a, b) => Number(b) - Number(a));

  // ยุทธ์ศาสตร์การบริหารจัดการทรัพยากรน้ำ 5 ด้าน
  const strategies = Array.from(
    new Set(projects.map((project) => project.strategy).filter(Boolean)),
  );

  // อ่าน Project Bank
  useEffect(() => {
    const fetchProjectBank = async () => {
      try {
        const params = new URLSearchParams({
          action: "projectBank",
          province,
          district,
          subdistrict,
        });

        const url = `${BASE_URL}?${params.toString()}`;

        // console.log("BASE_URL =", BASE_URL);
        // console.log("PARAMS =", params.toString());
        // console.log("FULL URL =", url);

        const response = await fetch(url);

        // console.log("STATUS =", response.status);

        const text = await response.text();

        // console.log("BODY =", text);

        // ✅ ใช้ body ที่อ่านมาแล้ว
        const data = JSON.parse(text);

        // console.log("===== PROJECT BANK DATA =====");
        // console.log(data);

        // console.log("IS ARRAY:", Array.isArray(data));
        // console.log("LENGTH:", data?.length);

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("ข้อมูลไม่ใช่ Array:", data);
          setProjects([]);
        }
      } catch (error) {
        console.error("โหลด Project Bank ไม่สำเร็จ:", error);
        setProjects([]);
      }
    };

    fetchProjectBank();
  }, [province, district, subdistrict]);

  // Filter
  const filteredProjects = projects.filter((project) => {
    const matchYear = selectedYear
      ? String(project.year) === selectedYear
      : true;

    const matchStrategy = selectedStrategy
      ? project.strategy === selectedStrategy
      : true;

    const search = searchText.toLowerCase().trim();

    const matchSearch = search
      ? project.projectName?.toLowerCase().includes(search) ||
        String(project.villageNo).includes(search) ||
        project.responsibleAgency?.toLowerCase().includes(search)
      : true;

    return matchYear && matchStrategy && matchSearch;
  });

  //ช่อง search
  const searchProjects = filteredProjects.filter((project) => {
    const search = searchText.toLowerCase().trim();

    if (!search) return true;

    return (
      project.projectName.toLowerCase().includes(search) ||
      project.villageNo.toString().toLowerCase().includes(search) ||
      project.responsibleAgency?.toLowerCase().includes(search)
    );
  });

  // KPI จำนวนโครงการ
  const projectCount = filteredProjects.length;

  // KPI งบประมาณ
  const totalBudget = filteredProjects.reduce(
    (sum, project) => sum + Number(project.budget || 0),
    0,
  );

  // เปิด Modal แสดงรายละเอียดโครงการ
  const handleOpenDetail = (record: ProjectBank) => {
    setSelectedProject(record);
    setIsModalOpen(true);
  };

  return (
    <div className="font-kanit bg-slate-100 w-full min-w-0 overflow-x-hidden">
      <Header filter={filter} />
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        waterData={waterData}
      />

      <div className="flex justify-between">
        <div className="flex gap-2 ml-5 text-2xl">
          {filter.subdistrict && <p>ตำบล{filter.subdistrict}</p>}

          {filter.district && <p>อำเภอ{filter.district}</p>}

          {filter.province && <p>จังหวัด{filter.province}</p>}

          <p className="text-2xl">
            {selectedYear ? `ประจำปีงบประมาณ ${selectedYear}` : "ทุกปีงบประมาณ"}
          </p>
        </div>

        {/* filter ปีงบประมาณ */}
        <div className="flex gap-2 mr-5">
          <BudgetYearFilter
            years={years}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
          {/* filter ยุทธศาสตร์ */}
          <StrategyFilter
            strategies={strategies}
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
          />
        </div>
      </div>

      {/* KPI */}
      <div className="flex gap-4 ml-5 mr-5">
        <div className="bg-gradient-to-br from-[#5196bc] to-[#024193] p-5 mt-4 rounded-lg w-60 shadow-lg text-white">
          <p className=" text-sm">โครงการทั้งหมด</p>
          <p className="font-bold text-2xl flex justify-center">
            {projectCount} โครงการ
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#5196bc] to-[#024193] p-5 mt-4 rounded-lg w-60 shadow-lg text-white">
          <p className="text-sm">งบประมาณ</p>
          <p className="font-bold text-2xl flex justify-center">
            {totalBudget.toLocaleString()} บาท
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex gap-4 m-5">
        {/* กราฟยุทธศาสตร์ */}
        <div className="bg-white rounded-xl p-5 shadow-lg w-[485px] h-[320px]">
          <div className="flex">
            <img src={strategy} alt="Strategy" className="w-7 h-7 ml-2" />
            <p className="font-bold text-xl text-[#023e8a] mb-5 ml-2">
              ยุทธศาสตร์การบริหารจัดการทรัพยากรน้ำ 5 ด้าน
            </p>
          </div>
          {/* <hr className="w-[400px] ml-11 -mt-2"/> */}
          <StrategyChart projects={filteredProjects} />
        </div>

        {/* กราฟแท่งจำนวนโครงการตามหมู่บ้าน */}
        <div className="bg-white rounded-xl p-5 shadow-lg w-[485px] h-[320px]">
          <div className="flex">
            <img src={village} alt="Village" className="w-8 h-8 ml-2" />
            <p className="font-bold text-xl text-[#023e8a] ml-2 mb-2">
              จำนวนโครงการตามหมู่บ้าน
            </p>
          </div>

          <VillageProjectChart projects={filteredProjects} />
        </div>
        {/* กราฟ Horizontal แสดงหน่วยงานที่รับผิดชอบ */}
        <div className="bg-white rounded-xl p-4 shadow-lg w-[485px] h-[320px]">
          <div className="flex">
            <img src={water} alt="Water" className="w-7 h-7 ml-2" />
            <p className="font-bold text-xl text-[#023e8a] ml-2 mb-3">
              แหล่งน้ำ
            </p>
          </div>
          <WaterSourceChart projects={filteredProjects} />
        </div>
      </div>
      {/* ตารางรายละเอียดโครงการ */}
      <div>
        <ProjectTable
          projects={searchProjects}
          searchText={searchText}
          onSearch={setSearchText}
          strategies={strategies}
          selectedStrategy={selectedStrategy}
          onStrategyChange={setSelectedStrategy}
          onOpenDetail={handleOpenDetail}
        />
        {/* Modal */}
        <Modal
          title={
            <div className="flex gap-2 mb-2 mt-2">
              <img
                src={projectDetail}
                alt="Project Detail"
                className="w-8 h-8 rounded-full shadow-xl"
              />
              <div className="font-bold text-2xl text-[#023e8a]">
                รายละเอียดโครงการ
              </div>
            </div>
          }
          width={550}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          className="font-kanit"
        >
          {selectedProject && (
            <div>
              <hr className="text-neutral-400 mb-2 mt-2 w-[450px]" />
              {/* ยุทธศาสตร์ */}
              <p className="text-xl mt-1">{selectedProject.projectName}</p>
              <p className="mt-1">{selectedProject.projectDetail}</p>

              <div className="grid grid-cols-5 mt-1 mb-1">
                <p>หมู่ที่ : {selectedProject.villageNo}</p>
                <p>หมู่บ้าน : {selectedProject.villageName}</p>
              </div>

              <div>{selectedProject.strategy}</div>
              <div>ปีงบประมาณ : {selectedProject.year}</div>
              <div>
                งบประมาณ : {selectedProject.budget.toLocaleString()} บาท
              </div>

              <p> ประโยชน์ที่ได้รับ : {selectedProject.benefit}</p>
              <p> ดำเนินการ: {selectedProject.responsibleAgency}</p>
              <p> หน่วยงานที่สนับสนุน : {selectedProject.supportingAgency}</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default WaterManagement;
