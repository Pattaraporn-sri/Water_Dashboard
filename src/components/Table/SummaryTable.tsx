import { useState, useEffect } from "react";
import type { WaterSource } from "../../types/Water";
import { Pagination } from "antd";

interface SummaryTableProps {
  columns: string[];
  waterData: WaterSource[];
}

const SummaryTable = ({ columns, waterData }: SummaryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //reset หน้าเมื่อ filter เปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [waterData]);

  //ข้อมูลที่แสดงในหน้าปัจุบัน
  const currentData = waterData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const rows = currentData.map((item, index) => [
    (currentPage - 1) * pageSize + index + 1,
    item.name,
    item.type,
    item.province,
    item.district,
    item.subdistrict,
    item.width,
    item.length,
    item.depth,
    item.volume,
  ]);

  return (
    <div
      className="
      rounded-xl
      border
      border-sky-100
      bg-white
      shadow-md
      m-5
      font-kanit
    "
    >
      {/* ตาราง */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#023e8a] text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="
                    px-4
                    py-3
                    text-center
                    font-bold
                  "
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="
                  border-b
                  hover:bg-sky-50
                "
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="
                      px-4
                      py-3
                      text-center
                      text-sm
                    "
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div
        className="
          flex
          justify-center
          py-4
        "
      >
        <Pagination
          current={currentPage}
          total={waterData.length}
          pageSize={pageSize}
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100"]}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} จาก ${total} รายการ`
          }
          onChange={(page, size) => {
            setCurrentPage(page);

            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

export default SummaryTable;
