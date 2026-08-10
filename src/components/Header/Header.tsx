import Logo from "../../assets/Water_Dashboard.png";

function Header() {
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

        {/* <div className="flex gap-2 text-xs mt-4">
          <div className="bg-[#00466c] hover:bg-[#0077b6] w-24 h-8 text-center pt-2 rounded-2xl shadow-xl text-neutral-50 border-[1px]">
            ส่งออก Excel
          </div>
          <div className="bg-[#00466c] hover:bg-[#0077b6] w-24 h-8 text-center pt-2 rounded-2xl shadow-xl text-neutral-50 border-[1px]">
            Report PDF
          </div>
          <div className="bg-[#00466c] hover:bg-[#0077b6] w-24 h-8 text-center pt-2 rounded-2xl shadow-xl text-neutral-50 border-[1px]">
            บันทึกภาพ
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Header;
