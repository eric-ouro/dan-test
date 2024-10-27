import withAuth from "@hoc/with-server-auth";

import PlasticFootprintSimple from "@/components/plastic-footprint-simple";
import PlasticFootprintMultiStackBar from "@/components/plastic-footprint-multi-stack-bar";

const DashboardPage = () => {
  return (
    <>
      <PlasticFootprintSimple />
      <PlasticFootprintMultiStackBar />
    </>
  );
};

export default withAuth(DashboardPage);
