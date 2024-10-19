import withAuth from "@hoc/with-server-auth";

import ReportingDataList from "@/components/internal/reporting-data-list";
import PartnersList from "@/components/internal/partners-list";
import FacilitiesList from "@/components/internal/facilities-list";
import WasteTypesList from "@/components/internal/waste-types-list";
import PartnerFacilitiesList from "@/components/internal/partner-facilities-list";

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
