import { Image, Modal } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { WaterSource } from "../../types/Water";

interface Props {
  selectedWater: WaterSource | null;
  waterData: WaterSource[];
  setSelectedWater: (water: WaterSource) => void;
}

export default function PhotoViewer({
  selectedWater,
  waterData,
  setSelectedWater,
}: Props) {
  const [open, setOpen] = useState(false);

  // รูปของแหล่งน้ำปัจจุบัน
  const image = selectedWater?.image ?? "";

  // หา index ของแหล่งน้ำปัจจุบัน
  const currentIndex = waterData.findIndex(
    (item) => item.ec5_uuid === selectedWater?.ec5_uuid,
  );

  // ไปแหล่งน้ำถัดไป
  const nextWater = () => {
    if (currentIndex === -1) return;

    const next = waterData[(currentIndex + 1) % waterData.length];

    setSelectedWater(next);
  };

  // ไปแหล่งน้ำก่อนหน้า
  const prevWater = () => {
    if (currentIndex === -1) return;

    const prev =
      waterData[currentIndex === 0 ? waterData.length - 1 : currentIndex - 1];

    setSelectedWater(prev);
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        {/* รูปภาพ */}

        <div className="relative flex-1 min-h-0 flex items-center justify-center px-10 sm:px-12">
          {/* ปุ่มก่อนหน้า */}
          <button
            onClick={prevWater}
            disabled={waterData.length <= 1}
            className="absolute left-0 sm:left-2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30"
          >
            <LeftOutlined />
          </button>

          {/* รูปภาพ */}
          {selectedWater?.image ? (
            <div className="flex justify-center items-center w-full h-full">
              <Image
                src={image}
                preview={false}
                alt={selectedWater.name}
                className="rounded-lg cursor-pointer max-h-[180px] sm:max-h-[220px] md:max-h-[250px] w-auto block mx-auto"
                style={{
                  // maxHeight: 260,
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
                onClick={() => setOpen(true)}
              />
            </div>
          ) : (
            <span className="text-gray-400">ไม่มีรูปภาพ</span>
          )}

          {/* ปุ่มถัดไป */}
          <button
            onClick={nextWater}
            disabled={waterData.length <= 1}
            className="absolute right-0 sm:right-2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30"
          >
            <RightOutlined />
          </button>
        </div>

        {/* รายละเอียด */}

        {selectedWater && (
          <div className="text-center font-kanit shrink-0">
            <div className="font-semibold text-[#023e8a] text-base sm:text-lg">
              {selectedWater.name}
            </div>

            <div className="text-xs sm:text-sm text-gray-500">
              ต.{selectedWater.subdistrict}
              {" • "}
              อ.{selectedWater.district}
              {" • "}
              จ.{selectedWater.province}
            </div>

            <div className="text-xs text-gray-400 mb-2">
              แหล่งน้ำที่ {currentIndex + 1}
              {" จาก "}
              {waterData.length}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Modal
        open={open}
        footer={null}
        centered
        width="90%"
        style={{ maxWidth: 900 }}
        onCancel={() => setOpen(false)}
      >
        {selectedWater && (
          <div className="flex flex-col items-center justify-center font-kanit">
            <div className="relative flex items-center justify-center w-full">
              {/* ปุ่มก่อนหน้า */}
              <button
                onClick={prevWater}
                disabled={waterData.length <= 1}
                className="absolute left-1 sm:left-3 md:left-5 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-30 z-10"
              >
                <LeftOutlined />
              </button>

              {/* รูปใหญ่ */}
              {selectedWater.image ? (
                <div className="flex justify-center items-center w-full">
                  <Image
                    src={selectedWater.image}
                    preview={false}
                    className="rounded-lg block mx-auto max-h-[45vh] sm:max-h-[55vh] md:max-h-[70vh] w-auto"
                    style={{
                      maxHeight: "70vh",
                      maxWidth: "90%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : (
                <div className="w-[260px] sm:w-[320px] md:w-[400px] h-[160px] sm:h-[200px] md:h-[250px] flex flex-col items-center justify-center rounded-lg text-gray-400">
                  <div className="mt-3 text-sm sm:text-base">
                    ไม่มีภาพถ่ายแหล่งน้ำ
                  </div>
                </div>
              )}

              {/* ปุ่มถัดไป */}
              <button
                onClick={nextWater}
                disabled={waterData.length <= 1}
                className="absolute right-1 sm:right-3 md:right-5 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-30 z-10"
              >
                <RightOutlined />
              </button>
            </div>

            {/* รายละเอียด */}
            <div className="text-center mt-3 sm:mt-4 md:mt-5 px-2">
              <div className="text-lg sm:text-xl md:text-2xl font-semibold text-[#023e8a]">
                {selectedWater.name}
              </div>

              <div className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600">
                ตำบล {selectedWater.subdistrict}
                <br />
                อำเภอ {selectedWater.district}
                <br />
                จังหวัด {selectedWater.province}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
