import React from "react";
import SetupPage from "../setupPage/SetupPage";

function InstitutionTaxes({ taxValues }) {
  return (
    <>
      <SetupPage taxValues={taxValues} collReq={"/institutionTax"}></SetupPage>
    </>
  );
}

export default InstitutionTaxes;
