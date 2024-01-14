import React, { useEffect } from "react";
import "./BidPage.css";
import { useState } from "react";
import BidRow from "./BidRow";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FetchingStatus } from "../../utils/context";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";

export default function BidPage({ freeBid, freeTextContent }) {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const navigate = useNavigate();
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [numOfRows, setNumOfRows] = useState(freeBid === true ? 0 : 5);
  const [inventoryData, setInventoryData] = useState([]);
  const [bid, setBid] = useState({
    clientName: "",
    date: year + "-" + month + "-" + day,
    target: "",
    isApproved: false,
    data: [],
    totalAmount: 0,
  });
  const sendPostRequest = async (token) => {
    const headers = { Authorization: token };

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: true,
        loading: true,
      };
    });
    const IndextheData = bid.data
      ?.filter((item) => item.checked === true)
      .map((item, index) => ({ ...item, id: index }));

    const { data } = await Api.post(
      "/bids",
      {
        ...bid,
        data: freeBid ? freeTextContent : IndextheData,
        freeBid: freeBid ? true : false,
      },
      { headers }
    );
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: true,
        loading: true,
        message: "ההצעה בוצעה בהצלחה",
      };
    });
    setTimeout(() => {
      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: false,
          loading: false,
          message: null,
        };
      });
    }, 1000);
    navigate("/orders");
  };

  const sendGetRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    let { data } = await Api.get("/inventories", { headers });
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
    setInventoryData(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await sendGetRequest(getAccessToken());
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshMyToken();
            try {
              await sendGetRequest(newAccessToken);
            } catch (e) {
              throw e;
            }
          } catch (refreshError) {
            setFetchingStatus((prev) => {
              return {
                ...prev,
                status: false,
                loading: false,
              };
            });
            clearTokens();

            navigate("/homepage");
          }
        } else {
          clearTokens();

          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
              message: ".. תקלה ביבוא הנתונים",
            };
          });
          setTimeout(() => {
            setFetchingStatus((prev) => {
              return {
                ...prev,
                status: false,
                loading: false,
                message: null,
              };
            });
            navigate("/homepage");
          }, 1000);
        }
      }
    };
    fetchData();
  }, []);

  const saveBidHandler = async (e) => {
    e.preventDefault();
    try {
      await sendPostRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await sendPostRequest(newAccessToken);
          } catch (e) {
            throw e;
          }
        } catch (refreshError) {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
            };
          });
          clearTokens();

          navigate("/homepage");
        }
      } else {
        clearTokens();

        setFetchingStatus((prev) => {
          return {
            ...prev,
            status: false,
            loading: false,
            message: ".. תקלה ביבוא הנתונים",
          };
        });
        setTimeout(() => {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
              message: null,
            };
          });
          navigate("/homepage");
        }, 1000);
      }
    }
  };

  return (
    <div className="bid_container">
      {!fetchingStatus.loading && (
        <form onSubmit={saveBidHandler} className="header_container">
          <input
            className="name"
            required
            type="text"
            placeholder="שם"
            value={bid.clientName}
            onChange={(e) => {
              setBid((prev) => {
                return { ...prev, clientName: e.target.value };
              });
            }}
          />

          <input
            required
            className="date"
            type="date"
            placeholder="בחר תאריך"
            value={bid.date !== "" ? bid.date : year + "-" + month + "-" + day}
            onChange={(e) => {
              setBid((prev) => {
                return { ...prev, date: e.target.value };
              });
            }}
          />

          <input
            className="name"
            placeholder="עבור"
            style={{ width: "20%" }}
            value={bid.target}
            required
            onChange={(e) => {
              setBid((prev) => {
                return { ...prev, target: e.target.value };
              });
            }}
          />
          <div className="totalAmount-container">
            {!freeBid && (
              <input
                placeholder="סכום"
                className="name"
                required
                disabled={freeBid ? false : true}
                defaultValue={bid.data.length > 0 ? bid?.totalAmount : null}
              />
            )}
            {freeBid && (
              <input
                placeholder="סכום"
                className="name"
                required
                value={bid?.totalAmount}
                onChange={(e) => {
                  setBid((prev) => {
                    return { ...prev, totalAmount: e.target.value };
                  });
                }}
              />
            )}
            <input disabled value={'ש"ח'} className="currency" />
          </div>
          <input
            type="submit"
            className="save"
            value={"שמירה"}
            disabled={!bid.data.length && !freeBid}
            style={{
              backgroundColor: bid.data.length || freeBid ? "brown" : "#cccccc",
              cursor: bid.data.length || freeBid ? "pointer" : "auto",
              color: bid.data.length || freeBid ? "white" : "#666666",
            }}
          />
        </form>
      )}
      {!fetchingStatus.loading &&
        [...new Array(numOfRows)].map((row, index) => {
          return (
            <BidRow
              key={`row${index}`}
              numOfRow={index}
              myData={inventoryData}
              setBid={setBid}
              bid={bid}
            ></BidRow>
          );
        })}

      {!fetchingStatus.loading && !freeBid && (
        <img
          src="/addItem.png"
          alt=""
          className="addWRow_btn"
          onClick={() => {
            setNumOfRows((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
