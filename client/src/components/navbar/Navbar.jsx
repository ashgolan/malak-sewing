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
        <div className="img-uppernav-logout">
          <img
            className="logout-img"
            style={{ visibility: getAccessToken() ? "visible" : "hidden" }}
            alt={""}
            src="/switch.png"
            onClick={logout}
          />
        </div>
        <div className="img-uppernav-logo">
          <img className="logo-img" src="./logo.jpg" alt="" />
        </div>
        <div className="img-uppernav-bid">
          <img
            className="bid-img"
            src="./bid.png"
            onClick={() => {
              navigate("/freeBidPage");
            }}
            alt=""
          />
          <img
            className="bid-img"
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
          <button style={{ backgroundColor: "lightblue" }}>מוצרים</button>
        </Link>
        <Link to={"/providers"}>
          <button style={{ backgroundColor: "lightgreen" }}>ספקים</button>
        </Link>
        <Link to={"/contacts"}>
          <button style={{ backgroundColor: "lightcoral" }}>אנשי קשר</button>
        </Link>
        <Link to={"/workersExpenses"}>
          <button style={{ backgroundColor: "orange" }}>עובדים</button>
        </Link>
        <Link to={"/sleevesBids"}>
          <button style={{ backgroundColor: "lightslategray" }}>שרוולים</button>
        </Link>
        <Link to={"/expenses"}>
          <button style={{ backgroundColor: "lightpink" }}>הוצאות</button>
        </Link>
        <Link to={"/sales"}>
          <button style={{ backgroundColor: "lightsalmon" }}>מכירות</button>
        </Link>
        <Link to={"/orders"}>
          <button style={{ backgroundColor: "#9DBC98" }}>הזמנות</button>
        </Link>

        <div className="img-uppernav">
          <img
            className="logout-img"
            style={{
              width: "80%",
              cursor: "pointer",
            }}
            alt={""}
            onClick={() => {
              navigate("/chartHomepage");
            }}
            src="/draw.png"
          />
        </div>
      </div>
    </nav>
  );
}
