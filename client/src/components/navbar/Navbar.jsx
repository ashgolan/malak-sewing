import React, { useEffect, useState } from "react";
import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearTokens,
  getAccessToken,
  getUserId,
} from "../../utils/tokensStorage";
import { Api } from "../../utils/Api";
import TaxValuesModal from "./TaxValuesModal";
export default function Navbar() {
  const [taxValues, setTaxValues] = useState({});

  const openModal = async () => {
    setIsOpen(true);
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    try {
      const { data: taxValuesData } = await Api.get("/taxValues", {
        headers,
      });

      setTaxValues(taxValuesData[0]);
    } catch (e) {
      console.log(e);
    }
  };
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const navigate = useNavigate();
  const logout = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: getAccessToken() };
      await Api.post(
        "/users/logout",
        {
          _id: getUserId(),
          key: process.env.REACT_APP_ADMIN,
        },
        { headers }
      );
      clearTokens();
      navigate("/");
    } catch (e) {
      clearTokens();
      navigate("/");
    }
  };

  return (
    <nav style={{ pointerEvents: getAccessToken() ? "auto" : "none" }}>
      <div className="upper-nav">
        <div className="img-bottomNav-left">
          <img
            style={{
              cursor: "pointer",
              width: "5%",
              visibility: "hidden",
            }}
            alt={""}
            src="/draw.png"
          />
          <div className="createdBy">
            <img
              style={{
                cursor: "pointer",
                width: "100%",
              }}
              alt={""}
              src="/alaaLogo.png"
            />
          </div>
          <img
            className="logout-img"
            style={{
              visibility: "hidden",
              cursor: "pointer",
              width: "5%",
              padding: "1%",
            }}
            alt={""}
            src="/switch2.png"
          />
        </div>

        <div className="img-uppernav-logo">
          <img className="logo-img" src="./logo.jpg" alt="" />
        </div>
        <div className="img-bottomNav">
          <img
            style={{
              cursor: "pointer",
            }}
            alt={""}
            onClick={() => {
              navigate("/chartHomepage");
            }}
            src="/draw.png"
          />
          <img
            src="./calender.png"
            onClick={() => {
              navigate("/calender");
            }}
            alt=""
          />

          <img
            src="./bid.png"
            onClick={() => {
              navigate("/freeBidPage");
            }}
            alt=""
          />

          <img
            src="./pcbid.png"
            onClick={() => {
              navigate("/bids");
            }}
            alt=""
          />
          <img
            className="logout-img"
            style={{
              display: getAccessToken() ? "block" : "none",
              cursor: "pointer",
              padding: "1%",
            }}
            alt={""}
            src="/switch2.png"
            onClick={logout}
          />
        </div>
      </div>
      <div className="buttons-nav">
        <NavLink
          to={"/inventories"}
          style={{ backgroundColor: "lightblue" }}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <button name="inventories">מוצרים</button>
        </NavLink>
        <NavLink
          to={"/providers"}
          style={{ backgroundColor: "lightgreen" }}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <button name="providers">אנשי קשר</button>
        </NavLink>
        <NavLink to={"/contacts"} style={{ backgroundColor: "lightcoral" }}>
          <button name="contacts">ספקים</button>
        </NavLink>
        <NavLink to={"/workersExpenses"} style={{ backgroundColor: "orange" }}>
          <button name="workersExpenses">עובדים</button>
        </NavLink>
        <NavLink
          to={"/sleevesBids"}
          style={{ backgroundColor: "lightslategray" }}
        >
          <button name="sleevesBids">שרוולים</button>
        </NavLink>
        <NavLink to={"/expenses"} style={{ backgroundColor: "lightpink" }}>
          <button name="expenses">הוצאות</button>
        </NavLink>
        <NavLink to={"/sales"} style={{ backgroundColor: "lightsalmon" }}>
          <button name="sales">מכירות</button>
        </NavLink>
        <NavLink to={"/salesToCompanies"} style={{ backgroundColor: "orchid" }}>
          <button name="sales">מכירות לחברות</button>
        </NavLink>
        <NavLink to={"/bouncedChecks"} style={{ backgroundColor: "#FF7F50" }}>
          <button name="bouncedChecks">שיקים דחויים</button>
        </NavLink>
        <NavLink
          to={"/institutionTax"}
          style={{ backgroundColor: "rgb(0, 204, 255)" }}
        >
          <button name="institutionTaxes">חשב. למוסדות</button>
        </NavLink>
        <NavLink to={"/orders"} style={{ backgroundColor: "#9DBC98" }}>
          <button name="orders">הזמנוות</button>
        </NavLink>

        <NavLink to={"/"} style={{ backgroundColor: "gold" }}>
          <button name="taxValues" onClick={() => openModal()}>
            💰 ערכי חישוב
          </button>
        </NavLink>

        <TaxValuesModal
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          taxValues={taxValues}
          setTaxValues={setTaxValues}
        ></TaxValuesModal>
      </div>
    </nav>
  );
}
