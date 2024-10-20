import withAuth from "@hoc/with-server-auth";

import PlasticFootprintSimple from "@/components/plastic-footprint-simple";
import PlasticFootprintMultiStackBar from "@/components/plastic-footprint-multi-stack-bar";

const DashboardPage = () => {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <PlasticFootprintSimple />
      <PlasticFootprintMultiStackBar />
    </div>
  );
};

export default withAuth(DashboardPage);
