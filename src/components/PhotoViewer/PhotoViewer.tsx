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

//   console.log(
//     "PHOTO:",
//     selectedWater?.name,
//     selectedWater?.ec5_uuid,
//     "INDEX:",
//     currentIndex,
//   );

  // ไปแหล่งน้ำถัดไป
  const nextWater = () => {
    // console.log("NEXT CLICK");

    // console.log("CURRENT INDEX =", currentIndex);

    if (currentIndex === -1) return;

    const next = waterData[(currentIndex + 1) % waterData.length];

    // console.log("NEXT WATER =", next);

    setSelectedWater(next);
  };

  // ไปแหล่งน้ำก่อนหน้า
  const prevWater = () => {
    if (currentIndex === -1) return;

    const prev =
      waterData[currentIndex === 0 ? waterData.length - 1 : currentIndex - 1];

    setSelectedWater(prev);
  };

//   console.log("waterData length =", waterData.length);

//   console.log(
//     "waterData =",
//     waterData.map((item) => ({
//       name: item.name,
//       uuid: item.ec5_uuid,
//     })),
//   );

  return (
    <>
      <div className="flex flex-col h-full">
        {/* รูปภาพ */}

        <div
          className="
    relative
    flex-1
    flex
    items-center
    justify-center
    "
        >
          {/* ปุ่มก่อนหน้า */}
          <button
            onClick={prevWater}
            disabled={waterData.length <= 1}
            className="
        absolute
        left-2
        w-10
        h-10
        rounded-full
        bg-white
        shadow-md
        flex
        items-center
        justify-center
        disabled:opacity-30
        "
          >
            <LeftOutlined />
          </button>

          {/* รูปภาพ */}
          {selectedWater?.image ? (
            <Image
              src={image}
              preview={false}
              alt={selectedWater.name}
              className="
        rounded-lg
        cursor-pointer
        "
              style={{
                maxHeight: 260,
                maxWidth: "90%",
                objectFit: "contain",
                
              }}
              onClick={() => setOpen(true)}
            />
          ) : (
            <span className="text-gray-400">ไม่มีรูปภาพ</span>
          )}

          {/* ปุ่มถัดไป */}
          <button
            onClick={nextWater}
            disabled={waterData.length <= 1}
            className="
        absolute
        right-2
        w-10
        h-10
        rounded-full
        bg-white
        shadow-md
        flex
        items-center
        justify-center
        disabled:opacity-30
        "
          >
            <RightOutlined />
          </button>
        </div>

        {/* รายละเอียด */}

        {selectedWater && (
          <div
            className="
              text-center
              font-kanit
              "
          >
            <div
              className="
                font-semibold
                text-[#023e8a]
                text-lg
                "
            >
              {selectedWater.name}
            </div>

            <div
              className="
                text-sm
                text-gray-500
                "
            >
              ต.{selectedWater.subdistrict}
              {" • "}
              อ.{selectedWater.district}
              {" • "}
              จ.{selectedWater.province}
            </div>

            <div
              className="
                text-xs
                text-gray-400
                mb-5
                "
            >
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
        width="85%"
        onCancel={() => setOpen(false)}
      >
        {selectedWater && (
          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            font-kanit
            "
          >
            <div
              className="
              relative
              flex
              items-center
              justify-center
              w-full
            "
            >
              {/* ปุ่มก่อนหน้า */}
              <button
                onClick={prevWater}
                disabled={waterData.length <= 1}
                className="
                absolute
                left-5
                w-12
                h-12
                rounded-full
               bg-white
                shadow-lg
                flex
                items-center
                justify-center
                disabled:opacity-30
                "
              >
                <LeftOutlined />
              </button>

              {/* รูปใหญ่ */}
              {selectedWater.image ? (
                <Image
                  src={selectedWater.image}
                  preview={false}
                  style={{
                    maxHeight: "70vh",
                    maxWidth: "90%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  className="
                w-[400px]
                h-[250px]
                flex
                flex-col
                items-center
                justify-center
                rounded-lg
                 text-gray-400
                "
                >
                  <div className="mt-3">ไม่มีภาพถ่ายแหล่งน้ำ</div>
                </div>
              )}

              {/* ปุ่มถัดไป */}
              <button
                onClick={nextWater}
                disabled={waterData.length <= 1}
                className="
                absolute
                right-5
                w-12
                h-12
                rounded-full
                bg-white
                shadow-lg
                flex
                items-center
                justify-center
                disabled:opacity-30
                "
              >
                <RightOutlined />
              </button>
            </div>

            {/* รายละเอียด */}
            <div
              className="
            text-center
            mt-5
            "
            >
              <div
                className="
                text-2xl
                font-semibold
                text-[#023e8a]
                 "
              >
                {selectedWater.name}
              </div>

              <div className="mt-3 text-gray-600">
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
