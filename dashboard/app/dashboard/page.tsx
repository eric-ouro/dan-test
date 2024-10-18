import withAuth from "@hoc/with-server-auth";

import FacilitiesList from "@/components/facilities-list";
import PartnerFacilitiesList from "@/components/partner-facilities-list";
import PartnersList from "@/components/partners-list";
import StoreViewer from "@/components/store-viewer";
import WasteTypesList from "@/components/waste-types-list";

const DashboardPage = () => {
  return (
    <div className="flex-1 w-full flex flex-row gap-12">
      <div className="flex-1 flex flex-col gap-12">
        <WasteTypesList />
        <FacilitiesList />
        <PartnerFacilitiesList />
        <PartnersList />
      </div>
      <div className="flex-1 flex flex-col gap-12">
        <StoreViewer />
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
