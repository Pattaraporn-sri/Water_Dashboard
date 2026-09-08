import { NavLink } from "react-router-dom";
import Logo from "../../assets/Water_Dashboard.png";
import type { SelectedFilter } from "../../types/Filter";

interface HaederProps {
  filter: SelectedFilter;
}

function Header({ filter }: HaederProps) {
  return (
    <div className="font-kanit w-full min-w-0 overflow-x-hidden">
      <div className="w-full flex justify-between bg-[linear-gradient(135deg,#003049_0%,#0077b6_100%)] pt-8 p-4 h-36">
        <div className="flex">
          <img
            src={Logo}
            alt="Logo"
            className="h-16 w-16 bg-zinc-200 rounded-xl"
          />
          <h1 className="p-4 text-3xl font-bold text-zinc-100">
            ระบบเก็บข้อมูล
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          {/* แหล่งน้ำ */}
          <NavLink
            to="/"
            state={{
              province: filter.province,
              district: filter.district,
              subdistrict: filter.subdistrict,
              type: filter.type,
            }}
            className={({ isActive }) =>
              `text-center px-4 rounded-xl shadow-xl h-10 flex items-center border-[1px] transition
              ${
                isActive
                  ? "bg-white text-[#00466c] border-white"
                  : "bg-[#00466c] text-neutral-50 border-[#ffffff] hover:bg-[#0077b6]"
              }`
            }
          >
            แหล่งน้ำ
          </NavLink>

          {/* การบริหารจัดการน้ำ */}
          <NavLink
            to="/water-management"
            state={{
              province: filter.province,
              district: filter.district,
              subdistrict: filter.subdistrict,
            }}
            className={({ isActive }) =>
              `text-center px-4 rounded-xl shadow-xl h-10 flex items-center border-[1px] transition
              ${
                isActive
                  ? "bg-white text-[#00466c] border-white"
                  : "bg-[#00466c] text-neutral-50 border-[#ffffff] hover:bg-[#0077b6]"
              }`
            }
          >
            การบริหารจัดการน้ำ
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Header;
