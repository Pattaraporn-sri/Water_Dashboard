function Chart({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#023e8a]">
        {title}
      </h3>
      {subtitle && <p className="text-sm text-[#023e8a]">{subtitle}</p>}
      <div className="flex-1 min-h-0 mt-2 sm:mt-4">{children}</div>
    </div>
  );
}

export default Chart;
