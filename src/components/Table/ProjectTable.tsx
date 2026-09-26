import { Button, Table } from "antd";
import { Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import search from "../../assets/search.png";

interface Project {
  waterSource: string;
  strategy: string;
  no: number | string;
  projectName: string;
  projectDetail: string;
  villageNo: number | string;
  villageName: string;

  lat: number | null;
  long: number | null;

  year: number;
  budget: number;
  benefit: string;
  responsibleAgency: string;
  supportingAgency: string;
}

interface ProjectTableProps {
  projects: Project[];
  searchText: string;
  onSearch: (value: string) => void;
  strategies: string[];
  selectedStrategy: string;
  onStrategyChange: (value: string) => void;
  onOpenDetail: (record: Project) => void;
}

function ProjectTable({
  projects,
  searchText,
  onSearch,
  onOpenDetail,
}: ProjectTableProps) {
  //หัวตาราง
  const headerClassName =
    "!bg-[#023e8a] !text-lg !text-white !font-bold !font-[Kanit]";

  // รายละเอียดคอลัมม์
  const columns: ColumnsType<Project> = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      width: 10,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "ชื่อแผนงาน/โครงการ",
      dataIndex: "projectName",
      key: "projectName",
      width: 250,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "หมู่",
      dataIndex: "villageNo",
      key: "villageNo",
      width: 50,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "หมู่บ้าน",
      dataIndex: "villageName",
      key: "villageName",
      width: 100,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "ยุทธศาสตร์",
      dataIndex: "strategy",
      key: "strategy",
      width: 150,

      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "latitude",
      dataIndex: "lat",
      key: "lat",
      width: 90,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "longtitude",
      dataIndex: "long",
      key: "long",
      width: 90,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "ปีดำเนินการ",
      dataIndex: "year",
      key: "year",
      width: 120,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "งบประมาณ",
      dataIndex: "budget",
      key: "budget",
      width: 70,
      align: "left" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
      render: (value: number) => value.toLocaleString("th-TH"),
    },
    {
      title: "ประโยชน์ที่คาดว่าจะได้รับ",
      dataIndex: "benefit",
      key: "benefit",
      width: 250,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "อปท.ดำเนินการ",
      dataIndex: "responsibleAgency",
      key: "responsibleAgency",
      width: 100,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "ขอรับการสนับสนุน",
      dataIndex: "supportingAgency",
      key: "supportingAgency",
      width: 150,
      align: "center" as const,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
    },
    {
      title: "รายละเอียด",
      key: "action",
      width: 50,
      onHeaderCell: () => ({
        className: headerClassName,
      }),
      align: "center" as const,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(record);
          }}
          className="!font-kanit"
        >
          ดูรายละเอียด
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* search */}
      <div className="flex justify-between m-5">
        <div className="flex gap-2">
          <img src={search} alt="search" className="w-9 h-9" />
          <p className="font-bold text-2xl mt- text-[#023e8a]">
            รายละเอียดโครงการ
          </p>
        </div>

        {/* filter/dropdown */}
        <div>
          <Input.Search
            placeholder="ค้นหาโครงการ / หมู่ที่ / หน่วยงาน"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-8 max-w-md [&_.ant-input]:font-[Kanit]"
          />
        
        </div>
      </div>

      {/* table */}
      <div className="ml-5 mr-5 mb-5 rounded-xl border border-sky-100 bg-white shadow-md">
        <Table
          className="
            [&_.ant-table]:font-[Kanit]
            [&_.ant-table-thead>tr>th]:font-[Kanit]
            [&_.ant-table-tbody>tr>td]:font-[Kanit]
            [&_.ant-pagination]:font-[Kanit]
            [&_.ant-pagination_*]:font-[Kanit]

            [&_.ant-table-tbody>tr>td]:whitespace-normal
            [&_.ant-table-tbody>tr>td]:break-words
            [&_.ant-pagination]:pr-5
        "
          columns={columns}
          dataSource={projects}
          rowKey={(record) => `${record.no}-${record.projectName}`}
          scroll={{ x: "max-content" }}
          onRow={(record) => ({
            onClick: () => onOpenDetail(record),
            className: "cursor-pointer hover:bg-slate-50",
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `ทั้งหมด ${total} รายการ`,
          }}
        />
      </div>
    </div>
  );
}

export default ProjectTable;
