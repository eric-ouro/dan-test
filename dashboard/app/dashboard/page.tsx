import { useState } from "react";
import withAuth from "@hoc/with-server-auth";


import DashboardContent from "./content";

const DashboardPage = () => {

  return (
    <>
      <DashboardContent />
    </>
  );
};

export default withAuth(DashboardPage);
