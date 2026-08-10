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
    <div className="p-2 h-64">
      <h3 className="text-2xl font-semibold text[#023e8a]">{title}</h3>
      <p className="text-sm text-[#023e8a]">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default Chart;
