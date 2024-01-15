import React, { useState, useRef, useMemo, useEffect, useContext } from "react";
import JoditEditor from "jodit-react";
import { FetchingStatus } from "../../utils/context";
import "./OrderPage.css";
import { Api } from "../../utils/Api";
import { exportToPdf } from "../../utils/export-to-pdf";
import BidRow from "../Bid_components/BidRow";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";
export default function OrderPage({ customOnChange, placeholder }) {
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
  const [showLogo, setShowLogo] = useState("none");
  const navigate = useNavigate();

  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = useMemo(
    () => ({
      readonly: selectedBid?.isApproved,
      placeholder: placeholder || " תחילת כתיבה כאן ...",
      direction: "rtl", // Set the text direction to right-to-left (you can use 'ltr' for left-to-right)
      style: {
        textAlign: "right", // Set the default text alignment to right (you can use 'left', 'center', 'justify', etc.)
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "ol",
        "ul",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "symbol",
        "|",
        "fullsize",
        "print",
        "about",
        "|",
        "fontcolor",
      ],
    }),

    [placeholder, selectedBid?.isApproved]
  );

  const sendApprovedRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const filteredDataByChecked = selectedBid.data
      .filter((item) => item.checked === true)
      .map((item, index) => ({ ...item, id: index }));
    await Api.patch(
      `/bids/`,
      {
        _id: selectedBid._id,
        isApproved: true,
        clientName: selectedBid.clientName,
        totalAmount: selectedBid.totalAmount,
        target: selectedBid.target,
        date: selectedBid.date,
        data: selectedBid.freeBid === true ? content : filteredDataByChecked,
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
    // exportToPdf("pdfOrder", selectedBid.clientName + "-" + selectedBid.date);
  };
  const sendDeleteRequest = async (token) => {
    const filteredBids = bids?.map((bid) => bid._id !== selectedBid._id);
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    await Api.delete(`/bids/${selectedBid._id}`, {
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
  const sendUpdateRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true, error: false };
    });
    const { data } = await Api.patch(
      `/bids/`,
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
    let { data: myBids } = await Api.get("/bids", { headers });
    let { data: myInventoryData } = await Api.get("/inventories", {
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
    myBid.freeBid && setContent(myBid.data[0]);
    setNumOfRows(myBid.data.length);
  };
  const customBid =
    selectedBid &&
    selectedBid.isApproved === isApproved &&
    !selectedBid.freeBid ? (
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
      })
    ) : selectedBid &&
      selectedBid.isApproved === isApproved &&
      selectedBid.freeBid ? (
      <JoditEditor
        ref={editor}
        value={selectedBid?.data && selectedBid?.data[0]}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => {
          setContent(newContent);
          customOnChange && customOnChange(newContent);
        }}
      />
    ) : null;

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
    if (
      foundItem ||
      (selectedBid.freeBid &&
        content !== "<p><br></p>" &&
        content !== undefined &&
        content !== "")
    )
      return false;
    return true;
  };
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "right",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
    option: (provided, state) => ({
      ...provided,
    }),
  };
  return (
    <div className="order-container">
      <div id="pdfOrder">
        <div className="header-logo-of-bid" style={{ display: showLogo }}>
          <img id="logo" src="./logo.jpg" alt="" />
        </div>
        <header className="orderheader" data-html2canvas-ignore="true">
          <div className="approve-cancel-bid">
            {selectedBid && !isApproved && (
              <button
                onClick={(e) => {
                  approveBid(e);
                }}
                className="approving"
                disabled={
                  selectedOption && !askToDeleteBid && !isAnEmptyData()
                    ? false
                    : true
                }
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
              onClick={async () => {
                await setShowLogo("flex");
                const resault = exportToPdf(
                  "pdfOrder",
                  `הצעת מחיר עבור - ${selectedBid.clientName} - ${selectedBid.date}`
                );
                if (resault) setShowLogo("none");
              }}
              src="/downloadPdf.png"
              alt=""
              style={{ width: "4%", cursor: "pointer" }}
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
              {selectedBid?.rarget}
              {" : "}
              <label htmlFor=""> עבור</label>
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
            styles={customStyles}
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
              placeholder="עבור"
              style={{ width: "13%" }}
              value={selectedBid.target}
              required
              onChange={(e) => {
                setSelectedBid((prev) => {
                  return { ...prev, target: e.target.value };
                });
              }}
              disabled={isApproved ? true : false}
            />
            <div className="totalAmount-container">
              {!selectedBid.freeBid && (
                <input
                  placeholder="סכום"
                  className="name"
                  required
                  value={
                    selectedBid.clientName ? selectedBid?.totalAmount : null
                  }
                  disabled
                />
              )}
              {selectedBid.freeBid && (
                <input
                  placeholder="סכום"
                  className="name"
                  required
                  value={selectedBid.clientName && selectedBid?.totalAmount}
                  onChange={(e) => {
                    setSelectedBid((prev) => {
                      return { ...prev, totalAmount: e.target.value };
                    });
                  }}
                />
              )}
              <input disabled value={'ש"ח'} className="currency" />
            </div>
          </form>
        )}
        {selectedOption && !selectedBid.freeBid && (
          <form
            className="row"
            style={{
              borderBottom: "2px solid rgb(96, 228, 124)",
              color: "rgb(30, 46, 75)",
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
              name="name"
              className="input_box"
              style={{
                width: "40%",
                backgroundColor: "transparent",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
                fontWeight: "bold",
              }}
              placeholder="מוצר"
            ></input>

            <input
              name="quantity"
              className="input_box"
              placeholder="כמות"
              disabled
              style={{
                backgroundColor: "transparent",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
                fontWeight: "bold",
              }}
            ></input>
            <input
              disabled
              name="number"
              className="input_box"
              placeholder="סכום"
              style={{
                backgroundColor: "transparent",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
                fontWeight: "bold",
              }}
            ></input>

            <input
              name="totalAmount"
              disabled
              placeholder={`סה"כ`}
              className="input_box total"
              style={{
                backgroundColor: "transparent",
                fontSize: "1rem",
                border: "none",
                textAlign: "center",
                fontWeight: "bold",
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
        !selectedBid.freeBid &&
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
