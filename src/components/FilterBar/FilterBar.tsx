import arrow_down from "../../assets/down.png";

function FilterBar() {
  return (
    <div className="flex justify-evenly items-center font-kanit bg-gradient-to-r from-[#0077b6] to-[#00b4d8] w-95% h-14 rounded-xl ml-5 mr-5 mb-5 -mt-7">
      <div className="flex items-center">
        <div className="bg-white w-[350px] h-8 p-1 rounded-lg">📍 จังหวัด</div>
        <img src={arrow_down} alt="Arrow Down" className="h-3 -ml-6" />
      </div>
      <div className="flex items-center">
        <div className="bg-white w-[350px] h-8 p-1 rounded-lg">📍 อำเภอ</div>
        <img src={arrow_down} alt="Arrow Down" className="h-3 -ml-6" />
      </div>
      <div className="flex items-center">
        <div className="bg-white w-[350px] h-8 p-1 rounded-lg">📍 ตำบล</div>
        <img src={arrow_down} alt="Arrow Down" className="h-3 -ml-6" />
      </div>
      <div className="flex items-center">
        <div className="bg-white w-[350px] h-8 p-1 rounded-lg">
          💧 ประเภทแหล่งน้ำ
        </div>
        <img src={arrow_down} alt="Arrow Down" className="h-3 -ml-6" />
      </div>
    </div>
  );
}

export default FilterBar;
