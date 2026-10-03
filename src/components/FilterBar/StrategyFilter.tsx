import { Select } from "antd";

interface StrategyFilterProp {
  strategies: string[];
  selectedStrategy: string;
  onStrategyChange: (value: string) => void;
}

const StrategyFilter = ({
  strategies,
  selectedStrategy,
  onStrategyChange,
}: StrategyFilterProp) => {
  // เรียงยุทธศาสตร์ตามเลข
  // ยุทธศาสตร์ 1 → 2 → 3 → 4 → 5
  const sortedStrategies = [...strategies].sort((a, b) => {
    const getNumber = (text: string) => {
      const match = text.match(/ยุทธศาสตร์.*?(\d+)/);

      return match ? Number(match[1]) : 999;
    };

    return getNumber(a) - getNumber(b);
  });

  return (
    <Select
      value={selectedStrategy || undefined}
      onChange={onStrategyChange}
      allowClear
      placeholder={<div className="text-slate-600">ยุทธศาสตร์</div>}
      style={{
        width: 400,
        fontFamily: "Kanit",
      }}
      className="
        w-full h-8 sm:w-[250px]
        [&_.ant-select-selection-placeholder]:!font-[Kanit]
      "
      classNames={{
        popup: {
          root: "font-[Kanit]",
        },
      }}
      options={[
        {
          label: "ทุกยุทธศาสตร์",
          value: "",
        },

        ...sortedStrategies.map((strategy) => ({
          label: strategy,
          value: strategy,
        })),
      ]}
    />
  );
};

export default StrategyFilter;
