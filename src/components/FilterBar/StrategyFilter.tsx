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
  return (
    <Select
      value={selectedStrategy || undefined}
      onChange={onStrategyChange}
      allowClear
      placeholder="เลือกยุทธศาสตร์"
      style={{ width: 200, fontFamily: "Kanit" }}
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
          label: "ทุกยุทธศาสตร์",
          value: "",
        },
        ...strategies.map((strategy) => ({
          label: strategy,
          value: strategy,
        })),
      ]}
    />
  );
};

export default StrategyFilter;
