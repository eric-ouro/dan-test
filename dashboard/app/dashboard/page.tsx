import withAuth from "@hoc/with-server-auth";

import ReportingDataList from "@/components/reporting-data-list";
import PartnersList from "@/components/partners-list";
import FacilitiesList from "@/components/facilities-list";
import WasteTypesList from "@/components/waste-types-list";
import PartnerFacilitiesList from "@/components/partner-facilities-list";

const DashboardPage = () => {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full flex flex-row gap-4">
        <PartnerFacilitiesList />
        <PartnersList />
        <FacilitiesList />
        <WasteTypesList />
      </div>
      <div className="w-full">
        <ReportingDataList />
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
