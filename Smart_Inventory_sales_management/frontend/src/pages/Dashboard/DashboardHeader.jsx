const DashboardHeader = () => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back, Admin.
        </p>
      </div>

      <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
        Today
      </button>
    </div>
  );
};

export default DashboardHeader;