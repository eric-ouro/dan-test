import withAuth from "@hoc/with-server-auth";

import PlasticFootprintSimple from "@/components/plastic-footprint-simple";
import PlasticFootprintMultiStackBar from "@/components/plastic-footprint-multi-stack-bar";
import PartnerFootprintMultiStackBar from "@/components/partner-footprint-multi-stack-bar";
import FacilityFootprintMultiStackBar from "@/components/facility-footprint-multi-stack-bar";

const DashboardPage = () => {
  return (
    <>
      <PlasticFootprintSimple />
      <PlasticFootprintMultiStackBar />
      <PartnerFootprintMultiStackBar />
      <FacilityFootprintMultiStackBar />
    </>
  );
};

export default withAuth(DashboardPage);
