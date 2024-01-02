import React from "react";
import InventoriesSetup from "./inventories/InventoriesSetup";
import ProvidersSetup from "./providers/ProvidersSetup";
import "./setupHomepage.css";
import SetupPage from "./SetupPage";
export default function SetupHomepage() {
  return (
    <div className="setupHomepage-container">
      <InventoriesSetup></InventoriesSetup>
      <ProvidersSetup></ProvidersSetup>
    </div>
  );
}
