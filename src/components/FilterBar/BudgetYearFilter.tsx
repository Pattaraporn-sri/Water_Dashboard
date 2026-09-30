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
      placeholder={<div className="text-slate-600">ปีงบประมาณ</div>}
      allowClear
      style={{ width: 390, fontFamily: "Kanit" }}
      onChange={(value) => onChange(value || "")}
      className="
                w-full h-8 sm:w-[250px] ml-3 
                [&_.ant-select-selection-placeholder]:!font-[Kanit]
            "
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
