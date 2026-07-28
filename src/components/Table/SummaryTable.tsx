interface SummaryTableProps {
  columns: string[];
  rows: (string | number)[][];
}

const SummaryTable = ({ columns, rows }: SummaryTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-sky-100 bg-white shadow-md m-5 font-kanit">
      <table className="min-w-full">
        <thead className="bg-[#023e8a] text-white">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-center font-bold"
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
              className="border-b hover:bg-sky-50"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-center text-sm"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
// function Table() {
//   return (
//     <div className="ml-5">
//         <tr className="text-black font-kanit text-center">
//             <th> ลำดับ</th>
//             <th> ชื่อแหล่งน้ำ</th>
//             <th> ประเภท </th>
//             <th> จังหวัด </th>
//             <th> อำเภอ </th>
//             <th> ตำบล</th>
//             <th> ความกว้าง (ม.) </th>
//             <th> ความยาว (ม.) </th>
//             <th> ความลึก (ม.) </th>
//             <th> ปริมาตร </th>
//         </tr>
//     </div>
//   )
// }

// export default Table