import withAuth from "@hoc/with-server-auth";

import QueryCooker from "@/components/query-cooker";

const DashboardPage = () => {
  return (
    <div className="flex-1 w-full flex flex-row gap-12">
      <QueryCooker />
    </div>
  );
};

export default withAuth(DashboardPage);
