import React from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
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
        <div className="img-bottomNav">
          <img
            style={{
              cursor: "pointer",
              width: "35%",
            }}
            alt={""}
            onClick={() => {
              navigate("/chartHomepage");
            }}
            src="/draw.png"
          />
          <img
            className="logout-img"
            style={{
              display: getAccessToken() ? "block" : "none",
              cursor: "pointer",
              width: "20%",
              padding: "1%",
            }}
            alt={""}
            src="/switch.png"
            onClick={logout}
          />
        </div>

        <div className="img-uppernav-logo">
          <img className="logo-img" src="./logo.jpg" alt="" />
        </div>
        <div className="img-bottomNav">
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
        </div>
      </div>
      <div className="buttons-nav">
        <Link to={"/inventories"}>
          <button name="inventories" style={{ backgroundColor: "lightblue" }}>
            מוצרים
          </button>
        </Link>
        <Link to={"/providers"}>
          <button name="providers" style={{ backgroundColor: "lightgreen" }}>
            ספקים
          </button>
        </Link>
        <Link to={"/contacts"}>
          <button name="contacts" style={{ backgroundColor: "lightcoral" }}>
            אנשי קשר
          </button>
        </Link>
        <Link to={"/workersExpenses"}>
          <button name="workersExpenses" style={{ backgroundColor: "orange" }}>
            עובדים
          </button>
        </Link>
        <Link to={"/sleevesBids"}>
          <button
            name="sleevesBids"
            style={{ backgroundColor: "lightslategray" }}
          >
            שרוולים
          </button>
        </Link>
        <Link to={"/expenses"}>
          <button name="expenses" style={{ backgroundColor: "lightpink" }}>
            הוצאות
          </button>
        </Link>
        <Link to={"/sales"}>
          <button name="sales" style={{ backgroundColor: "lightsalmon" }}>
            מכירות
          </button>
        </Link>
        <Link to={"/orders"}>
          <button name="orders" style={{ backgroundColor: "#9DBC98" }}>
            הזמנות
          </button>
        </Link>
      </div>
    </nav>
  );
}
