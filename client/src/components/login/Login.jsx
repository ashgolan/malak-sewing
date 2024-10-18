import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { Api } from "../../utils/Api";
import { FetchingStatus } from "../../utils/context";
import "./login.css";
import {
  setTokens,
  getAccessToken,
  setUserId,
} from "../../utils/tokensStorage";
export default function Login({ setLoggedIn }) {
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const navigate = useNavigate();
  useEffect(() => {
    if (getAccessToken()) navigate("/homepage");
    return () => {};
  }, []);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const checklogin = async (e) => {
    e.preventDefault();
    try {
      if (!validator.isEmail(login.email))
        throw new Error("כתובת המייל או הסיסמא שהזנת אינן חוקיות");

      setFetchingStatus({ status: true, loading: true });

      const { data } = await Api.post("/users/login", login);

      if (data === "user not found!!")
        throw new Error("שם המשתמש או הסיסמא לא נכונים");

      if (data?.adminUser?.isBlocked)
        throw new Error("תקופת הניסיון החינמית עבור משתמש זה הסתיימה");

      setUserId(data?.adminUser?._id);
      setTokens(data.accessToken, data.refreshToken);
      setLoggedIn(true);
      navigate("homepage/");
      setTimeout(() => {
        setFetchingStatus({ status: false, loading: false, message: null });
      }, 1000);
    } catch (e) {
      setFetchingStatus({
        status: true,
        loading: false,
        error: true,
        message: e.message,
      });
      setTimeout(() => {
        setFetchingStatus({ status: false, loading: false, message: null });
      }, 1000);
    }
  };
  return (
    <form onSubmit={checklogin} className="vh-50">
      {!fetchingStatus.loading && (
        <div className="container py-5 h-50">
          <div className="row d-flex justify-content-center align-items-center h-50">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card shadow-2-strong"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-3 text-center">
                  <h3 className="mb-3">כניסה</h3>

                  <div className="form-outline mb-1">
                    <input
                      type="email"
                      value={login.email}
                      required
                      id="typeEmailX-2"
                      onChange={(e) => {
                        setLogin((prev) => {
                          return { ...prev, email: e.target.value };
                        });
                      }}
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="typeEmailX-2">
                      דואר אלקטרוני
                    </label>
                  </div>

                  <div className="form-outline mb-1">
                    <input
                      type="password"
                      required
                      value={login.password}
                      onChange={(e) =>
                        setLogin((prev) => {
                          return { ...prev, password: e.target.value };
                        })
                      }
                      id="typePasswordX-2"
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="typePasswordX-1">
                      סיסמא
                    </label>
                  </div>
                  <div>
                    <button
                      type="submit"
                      style={{
                        padding: "1.5% 40%",
                        border: "none",
                        borderRadius: "1rem",
                        backgroundColor: "gold",
                      }}
                    >
                      כניסה
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
