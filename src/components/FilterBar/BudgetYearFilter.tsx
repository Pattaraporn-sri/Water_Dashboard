import { Select } from "antd";

interface BudgetYearFilterProp {
  years: string[];
  selectedYear: string;
  onChange: (year: string) => void;
}

const BudgetYearFilter = ({
  years,
  selectedYear,
  onChange,
}: BudgetYearFilterProp) => {
  return (
    <Select
      value={selectedYear || undefined}
      placeholder="เลือกปีงบประมาณ"
      allowClear
      style={{ width: 200, fontFamily: "Kanit" }}
      onChange={(value) => onChange(value || "")}
      classNames={{
        popup: {
          root: "font-[Kanit]",
        },
      }}
      options={[
        {
          value: "",
          label: "ทุกปีงบประมาณ",
        },
        ...years.map((year) => ({
          value: year,
          label: `ปีงบประมาณ ${year}`,
        })),
      ]}
    />
  );
};

export default BudgetYearFilter;
