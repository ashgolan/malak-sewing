import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { FetchingStatus } from "./utils/context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/login/Login";
import HomePage from "./components/homepage/HomePage";
import IdleTimer from "./utils/IdleTimer";
import { clearTokens } from "./utils/tokensStorage";
import Providers from "./components/providers/Providers";
import Inventories from "./components/inventories/Inventories";
import Contacts from "./components/contacts/Contacts";
import SleevesBids from "./components/SleevesBids/SleevesBids";
import Expenses from "./components/expenses/Expenses";
import Sales from "./components/sales/Sales";
import ChartHomepage from "./components/charts/ChartHomepage";
import WorkersExpenses from "./components/workersExpenses/WorkersExpenses";
import BidPage from "./components/Bid_components/BidPage";
import OrderPage from "./components/Order_Components/OrderPage";
import FreeBidPage from "./components/Bid_components/FreeBidPage";
import Calender from "./components/calender/Calender";
import SalesToCompanies from "./components/SalesToCompanies/SalesToCompanies";
import InstitutionTaxes from "./components/institutionTaxes/InstitutionTaxes";
import BouncedChecks from "./components/bouncedChecks/BouncedChecks";

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState({
    loading: false,
    error: false,
    status: false,
    message: null,
  });
  const handleIdle = () => {
    if (!loggedIn) return;
    clearTokens();
    setLoggedIn(false);
    navigate("/homepage");
  };

  return (
    <div>
      <IdleTimer timeout={1000 * 60 * 5} onIdle={handleIdle} /> 
      <Navbar></Navbar>
      {fetchingStatus.message && (
        <h5 className="message">{fetchingStatus.message}</h5>
      )}
      {fetchingStatus.loading && (
        <div className="loading">
          <span className="loader"></span>
        </div>
      )}
      <FetchingStatus.Provider value={[fetchingStatus, setFetchingStatus]}>
        <Routes>
          <Route
            exact
            path="/"
            element={<Login setLoggedIn={setLoggedIn}></Login>}
          ></Route>
          <Route
            exact
            path="/inventories"
            element={<Inventories></Inventories>}
          ></Route>
          <Route path="/providers" element={<Providers></Providers>}></Route>

          <Route path="/contacts" element={<Contacts></Contacts>}></Route>
          <Route
            path="/sleevesBids"
            element={<SleevesBids></SleevesBids>}
          ></Route>
          <Route path="/expenses" element={<Expenses></Expenses>}></Route>
          <Route
            path="/workersExpenses"
            element={<WorkersExpenses></WorkersExpenses>}
          ></Route>
          <Route path="/sales" element={<Sales></Sales>}></Route>
          <Route
            path="/salesToCompanies"
            element={<SalesToCompanies></SalesToCompanies>}
          ></Route>
          <Route
            path="/institutionTax"
            element={<InstitutionTaxes></InstitutionTaxes>}
          ></Route>
          <Route
            path="/bouncedChecks"
            element={<BouncedChecks></BouncedChecks>}
          ></Route>
          <Route path="/bids" element={<BidPage></BidPage>}></Route>

          <Route
            path="/freeBidPage"
            element={<FreeBidPage></FreeBidPage>}
          ></Route>
          <Route path="/orders" element={<OrderPage></OrderPage>}></Route>
          <Route
            path="/chartHomepage"
            element={<ChartHomepage></ChartHomepage>}
          ></Route>
          <Route path="/homePage" element={<HomePage></HomePage>}></Route>
          <Route path="/calender" element={<Calender></Calender>}></Route>
        </Routes>
      </FetchingStatus.Provider>
    </div>
  );
}

export default App;
