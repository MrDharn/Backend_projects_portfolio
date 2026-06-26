const StatCard = ({ title, value, icon, color }) => {
  const Icon = icon;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;