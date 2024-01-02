import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import SetupHomepage from "./components/setupPage/SetupHomepage";
import { FetchingStatus } from "./utils/context";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
  const [fetchingStatus, setFetchingStatus] = useState({
    loading: false,
    error: false,
    status: false,
    message: null,
  });
  return (
    <div>
      <Navbar></Navbar>
      <FetchingStatus.Provider value={[fetchingStatus, setFetchingStatus]}>
        <Routes>
          <Route
            path="/setupPage"
            element={<SetupHomepage></SetupHomepage>}
          ></Route>
        </Routes>
      </FetchingStatus.Provider>
    </div>
  );
}

export default App;
