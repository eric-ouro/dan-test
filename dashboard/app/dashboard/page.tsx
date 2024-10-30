import withAuth from "@hoc/with-server-auth";

import PlasticFootprintSimple from "@/components/plastic-footprint-simple";
import PlasticFootprintMultiStackBar from "@/components/plastic-footprint-multi-stack-bar";
import PartnerFootprintSimple from "@/components/partner-footprint-simple";
import PartnerFootprintMultiStackBar from "@/components/partner-footprint-multi-stack-bar";
import FacilityFootprintSimple from "@/components/facility-footprint-simple";
import FacilityFootprintMultiStackBar from "@/components/facility-footprint-multi-stack-bar";

const DashboardPage = () => {
  return (
    <>
      <PlasticFootprintSimple />
      <PlasticFootprintMultiStackBar />
      <PartnerFootprintSimple />
      <PartnerFootprintMultiStackBar />
      <FacilityFootprintSimple />
      <FacilityFootprintMultiStackBar />
    </>
  );
};

export default withAuth(DashboardPage);
