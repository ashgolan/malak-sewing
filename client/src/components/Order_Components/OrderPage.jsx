import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { FetchingStatus } from "../../utils/context";
import "./OrderPage.css";
import { Api } from "../../utils/Api";
import { exportToPdf } from "../../utils/export-to-pdf";
import { useRef } from "react";
import BidRow from "../Bid_components/BidRow";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";
export default function OrderPage() {
  const selectOptionRef = useRef();
  const [isApproved, setIsApproved] = useState(false);
  const [numOfRows, setNumOfRows] = useState(null);
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState({});
  const [inventoryData, setInventoryData] = useState([]);
  const [askToDeleteBid, setAskToDeleteBid] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [bidIsDeleted, setBidIsDeleted] = useState(false);
  const [bidIsUpdated, setBidIsUpdated] = useState(false);

  const navigate = useNavigate();

  const sendApprovedRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const filteredDataByChecked = selectedBid.data
      .filter((item) => item.checked === true)
      .map((item, index) => ({ ...item, id: index }));
    await Api.patch(
      `/Bids/`,
      {
        _id: selectedBid._id,
        isApproved: true,
        clientName: selectedBid.clientName,
        totalAmount: selectedBid.totalAmount,
        color: selectedBid.color,
        date: selectedBid.date,
        data: filteredDataByChecked,
      },
      { headers }
    );
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        message: "ההצעה הועברה להזמנה בהצלחה",
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
    setIsApproved(true);
    setSelectedBid({});
    setSelectedOption(null);
    setBidIsUpdated((prev) => !prev);
    exportToPdf("pdfOrder", selectedBid.clientName + "-" + selectedBid.date);
  };
  const sendDeleteRequest = async (token) => {
    const filteredBids = bids?.map((bid) => bid._id !== selectedBid._id);
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    await Api.delete(`/Bids/${selectedBid._id}`, {
      data: selectedBid,
      headers: headers,
    });
    setBids(filteredBids);
    setSelectedBid({});
    setSelectedOption(null);
    setBidIsDeleted((prev) => !prev);
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        error: false,
        message: "ההצעה נמחקה בהצלחה",
      };
    });
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        error: false,
        message: null,
      };
    });
  };
  const sendUpdateRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true, error: false };
    });
    const { data } = await Api.patch(
      `/Bids/`,
      {
        _id: selectedBid._id,
        isApproved: false,
      },
      { headers }
    );
    setSelectedBid({});
    setIsApproved(false);
    setSelectedOption(null);
    setBidIsUpdated((prev) => !prev);
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        message: "ההצעה הועברה להזמנה בהצלחה",
      };
    });
    setTimeout(() => {
      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: false,
          loading: false,
          error: false,
          message: null,
        };
      });
    }, 1000);
  };

  const sendGetRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    let { data: myBids } = await Api.get("/Bids", { headers });
    let { data: myInventoryData } = await Api.get("/Inventory", {
      headers,
    });
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });

    setInventoryData(myInventoryData);
    setBids(myBids);
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
  }, [bidIsUpdated, bidIsDeleted]);

  const filterTheData = () => {
    return bids.filter((bid) => bid.isApproved === isApproved);
  };
  const filteredBids = filterTheData()?.map((bid, index) => {
    return {
      value: bid._id,
      label: bid.clientName + " " + bid.date,
    };
  });

  const findBid = (e) => {
    const myBid = bids?.find((bid) => bid._id === e);
    setSelectedBid(myBid);
    setNumOfRows(myBid.data.length);
  };
  const customBid =
    selectedBid &&
    selectedBid.isApproved === isApproved &&
    [...new Array(numOfRows)].map((bidRow, index) => {
      return (
        <>
          <BidRow
            id={index}
            key={`bidRow${index}`}
            numOfRow={index}
            bid={selectedBid}
            setBid={setSelectedBid}
            myData={inventoryData}
            itemInBid={selectedBid.data[index]}
          ></BidRow>
        </>
      );
    });

  const convertToNotApproved = async () => {
    try {
      await sendUpdateRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await sendUpdateRequest(newAccessToken);
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
            message: ".. תקלה בביטול ההזמנה",
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

  const deleteTheBid = async () => {
    try {
      await sendDeleteRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await sendDeleteRequest(newAccessToken);
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
            message: ".. תקלה במחיקת ההצעה",
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

  const approveBid = async () => {
    try {
      await sendApprovedRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await sendApprovedRequest(newAccessToken);
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
            message: ".. תקלה באישור ההצעה",
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
  const isAnEmptyData = () => {
    const foundItem = selectedBid.data.find((item) => item.checked === true);
    if (foundItem) return false;
    return true;
  };
  return (
    <div className="order-container">
      <div id="pdfOrder">
        <header className="orderheader">
          <div className="approve-cancel-bid">
            {selectedBid && !isApproved && (
              <button
                onClick={(e) => {
                  approveBid(e);
                }}
                className="approving"
                disabled={selectedOption && !askToDeleteBid ? false : true}
                style={{
                  backgroundColor:
                    selectedOption && !askToDeleteBid && !isAnEmptyData()
                      ? "brown"
                      : "#cccccc",
                  cursor:
                    selectedOption && !askToDeleteBid && !isAnEmptyData()
                      ? "pointer"
                      : "auto",
                  color:
                    selectedOption && !askToDeleteBid && !isAnEmptyData()
                      ? "white"
                      : "#666666",
                }}
              >
                שלח להזמנה
              </button>
            )}
            {selectedBid && isApproved && (
              <button
                disabled={selectedOption ? false : true}
                style={{
                  backgroundColor:
                    selectedOption && !isAnEmptyData() ? "brown" : "#cccccc",
                  cursor:
                    selectedOption && !isAnEmptyData() ? "pointer" : "auto",
                  color:
                    selectedOption && !isAnEmptyData() ? "white" : "#666666",
                }}
                onClick={(e) => {
                  convertToNotApproved();
                }}
                className="approving"
              >
                ביטול הזמנה{" "}
              </button>
            )}
          </div>
          {selectedBid && (
            <img
              onClick={() =>
                exportToPdf(
                  "pdfOrder",
                  selectedBid.clientName + "-" + selectedBid.date
                )
              }
              src="/savePdf.png"
              alt=""
              style={{ width: "5%", cursor: "pointer" }}
            />
          )}
          <img
            onClick={() => {
              setIsApproved((prev) => !prev);
              setSelectedBid({});
              setSelectedOption(null);
            }}
            src="/move.png"
            style={{ width: "4%" }}
            alt=""
          />
          {selectedBid && (
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              {selectedBid?.color}
              {" : "}
              <label htmlFor=""> צבע</label>
            </div>
          )}

          <Select
            ref={selectOptionRef}
            options={filteredBids}
            value={selectedOption}
            placeholder={isApproved ? "בחר הזמנה" : "בחר הצעה"}
            className="select-item-in-Order"
            onChange={(e) => {
              setSelectedOption(e);
              setAskToDeleteBid(false);
              findBid(e.value);
            }}
          ></Select>
          {!askToDeleteBid && !isApproved && selectedBid?._id && (
            <i
              onClick={() => setAskToDeleteBid((prev) => !prev)}
              className="fa-solid fa-trash-can"
              style={{
                color: "brown",
                margin: "0 1% ",
                cursor: "pointer",
                fontSize: "2rem",
              }}
            ></i>
          )}
          {askToDeleteBid && selectedOption && (
            <div
              style={{
                display: "flex",
                width: "10%",
                justifyContent: "space-between",
                fontSize: "1.5rem",
              }}
            >
              <i
                className="fa-solid fa-check"
                onClick={(e) => deleteTheBid(e)}
                style={{
                  color: "green",
                  margin: "0 1% ",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              ></i>

              <i
                onClick={() => setAskToDeleteBid((prev) => !prev)}
                className="fa-solid fa-xmark"
                style={{ color: "brown", margin: "0 1% ", cursor: "pointer" }}
              ></i>
            </div>
          )}
        </header>
        {selectedOption && (
          <form className="header_container">
            <input
              className="name"
              required
              type="text"
              placeholder="שם"
              value={selectedBid.clientName}
              onChange={(e) => {
                setSelectedBid((prev) => {
                  return { ...prev, clientName: e.target.value };
                });
              }}
              disabled={isApproved ? true : false}
            />
            <input
              required
              className="date"
              type="date"
              placeholder="תאריך"
              value={selectedBid.date}
              onChange={(e) => {
                setSelectedBid((prev) => {
                  return { ...prev, date: e.target.value };
                });
              }}
              disabled={isApproved ? true : false}
            />{" "}
            <input
              className="name"
              placeholder="צבע"
              style={{ width: "13%" }}
              value={selectedBid.color}
              required
              onChange={(e) => {
                setSelectedBid((prev) => {
                  return { ...prev, color: e.target.value };
                });
              }}
              disabled={isApproved ? true : false}
            />
            <div className="totalAmount-container">
              <input
                placeholder="סכום"
                className="name"
                required
                value={selectedBid ? +selectedBid?.totalAmount : ""}
                onChange={(e) => {
                  setSelectedBid((prev) => {
                    return { ...prev, totalAmount: e.target.value };
                  });
                }}
                disabled={isApproved ? true : false}
              />
              <input disabled value={'ש"ח'} className="currency" />
            </div>
          </form>
        )}
        {selectedOption && (
          <form
            className="row"
            style={{
              borderBottom: "1px solid #55555533",
              backgroundColor: "rgb(255, 253, 126)",
            }}
          >
            <input
              style={{ visibility: "hidden" }}
              disabled
              className="row_number"
              value={9}
            />
            <input
              disabled
              name="number"
              className="input_box"
              placeholder="מספר"
              style={{
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
              }}
            ></input>
            <input
              disabled
              name="desc"
              className="input_box"
              style={{
                width: "25%",
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
              }}
              placeholder="מוצר"
            ></input>
            <input
              disabled
              name="category"
              className="input_box"
              placeholder="סוג"
              style={{
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
              }}
            ></input>

            <img
              className="imgOfItem"
              style={{
                width: "8%",
                padding: "0.5% 2.5%",
                backgroundColor: "transparent",
                border: "none",
                textAlign: "center",
              }}
              alt=""
              src="/jpgImage.png"
            ></img>

            <input
              disabled
              name="length"
              className="input_box"
              placeholder="אורך"
              style={{
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
              }}
            ></input>

            <input
              name="quantity"
              className="input_box"
              placeholder="כמות"
              disabled
              style={{
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
              }}
            ></input>
            <input
              disabled
              name="weight"
              className="input_box"
              placeholder="משקל"
              style={{
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
              }}
            ></input>

            <input
              name="totalWeight"
              disabled
              placeholder="משקל טוטלי"
              className="input_box total"
              style={{
                backgroundColor: "transparent",
                textDecoration: "underline",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
              }}
            ></input>
            {!selectedBid.isApproved && (
              <input
                className="checkBoxStyle"
                type="checkbox"
                style={{ visibility: "hidden" }}
              />
            )}
          </form>
        )}
        {customBid}
      </div>
      {!fetchingStatus.loading &&
        !selectedBid?.isApproved &&
        selectedOption && (
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
