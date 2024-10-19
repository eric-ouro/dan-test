import withAuth from "@hoc/with-server-auth";

import PlasticFootprintSimple from "@/components/plastic-footprint-simple";

const DashboardPage = () => {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <PlasticFootprintSimple />
    </div>
  );
};

export default withAuth(DashboardPage);
