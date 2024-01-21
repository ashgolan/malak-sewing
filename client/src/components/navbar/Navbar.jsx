import React from "react";
import "./navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  clearTokens,
  getAccessToken,
  getUserId,
} from "../../utils/tokensStorage";
import { Api } from "../../utils/Api";
export default function Navbar() {
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
              // width: "20%",
            }}
            alt={""}
            onClick={() => {
              navigate("/chartHomepage");
            }}
            src="/draw.png"
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
              // width: "20%",
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
          <button name="providers">ספקים</button>
        </NavLink>
        <NavLink to={"/contacts"} style={{ backgroundColor: "lightcoral" }}>
          <button name="contacts">אנשי קשר</button>
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
        <NavLink to={"/orders"} style={{ backgroundColor: "#9DBC98" }}>
          <button name="orders">הזמנוות</button>
        </NavLink>
      </div>
    </nav>
  );
}
