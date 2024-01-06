import React, { useContext, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Api } from "../../../utils/Api";
import { FetchingStatus } from "../../../utils/context";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import "./Add_item.css";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import Select from "react-select";
export default function AddItem({
  setaddItemToggle,
  setItemIsUpdated,
  collReq,
}) {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const navigate = useNavigate();
  const productFormData = useRef();
  // eslint-disable-next-line
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemsValues, setItemsValues] = useState({
    number: "",
    name: "",
    mail: "",
    bankProps: "",
    quantity: "",
    tax: "",
    taxPercent: "",
    date: year + "-" + month + "-" + day,
    totalAmount: 0,
  });
  const sendPostRequest = async (token) => {
    const headers = {
      Authorization: token,
    };
    setFetchingStatus({ loading: true, error: false });
    switch (collReq) {
      case "/sleevesBids":
        await Api.post(
          collReq,
          {
            name: itemsValues.name,
            number: itemsValues.number,
            date: itemsValues.date,
            tax: itemsValues.tax,
            quantity: itemsValues.quantity,
            totalAmount: itemsValues.totalAmount,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/expenses":
        await Api.post(
          collReq,
          {
            name: itemsValues.name,
            number: itemsValues.number,
            date: itemsValues.date,
            taxPercent: itemsValues.taxPercent,
            totalAmount: itemsValues.totalAmount,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/contacts":
      default:
        await Api.post(
          collReq,
          { name: itemsValues.name, number: itemsValues.number },
          {
            headers: headers,
          }
        );
    }

    setItemIsUpdated((prev) => !prev);

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        error: false,
        message: "המוצר נוסף בהצלחה",
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

  const addItem = async () => {
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

  const confirmAddingItem = (e) => {
    e.preventDefault();

    setaddItemToggle({ btnVisible: true, formVisible: false });
    addItem();
  };
  const cancelAddingItem = (e) => {
    e.preventDefault();
    setaddItemToggle({ btnVisible: true, formVisible: false });
  };
  const allTaxSelect = [
    { value: true, label: "כן" },
    { value: false, label: "לא" },
  ].map((item) => {
    return { value: item.value, label: item.label };
  });
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
      backgroundColor: "rgb(248, 253, 174)",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
  };
  return (
    <form
      ref={productFormData}
      onSubmit={confirmAddingItem}
      className="addItem_form"
    >
      <div className="add-row">
        {(collReq === "/sleevesBids" || collReq === "/expenses") && (
          <input
            name="date"
            type="date"
            id="date"
            style={{ width: "25%" }}
            required
            className="add_item"
            placeholder="בחר תאריך"
            value={itemsValues.date}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, date: e.target.value };
              })
            }
          ></input>
        )}
        <input
          name="name"
          id="name"
          required
          autoFocus={true}
          className="add_item"
          style={{ width: "35%" }}
          placeholder={
            collReq === "/inventory" || collReq === "/expenses" ? "מוצר" : "שם"
          }
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, name: e.target.value };
            })
          }
          value={itemsValues.name}
        ></input>
        <input
          name="number"
          id="number"
          style={{ width: "15%" }}
          required
          className="add_item"
          placeholder={
            collReq === "/contact" || collReq === "/provider" ? "מספר" : "מחיר"
          }
          onChange={(e) =>
            setItemsValues((prev) => {
              return {
                ...prev,
                number: e.target.value,
                totalAmount: prev.quantity
                  ? e.target.value * prev.quantity
                  : (e.target.value * prev.taxPercent) / 100,
              };
            })
          }
          value={itemsValues.number}
        ></input>
        {collReq === "/contact" && (
          <input
            name="mail"
            id="mail"
            style={{ width: "25%" }}
            required
            className="add_item"
            placeholder="דואר אלקטרוני"
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, mail: e.target.value };
              })
            }
            value={itemsValues.mail}
          ></input>
        )}
        {collReq === "/contact" && (
          <input
            name="bankProps"
            id="bankProps"
            style={{ width: "25%" }}
            required
            className="add_item"
            placeholder="פרטי בנק"
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, bankProps: e.target.value };
              })
            }
            value={itemsValues.bankProps}
          ></input>
        )}
        {collReq === "/sleevesBids" && (
          <input
            name="quantity"
            id="quantity"
            style={{ width: "10%" }}
            required
            className="add_item"
            placeholder="כמות"
            onChange={(e) =>
              setItemsValues((prev) => {
                return {
                  ...prev,
                  quantity: e.target.value,
                  totalAmount: e.target.value * prev.number,
                };
              })
            }
            value={itemsValues.quantity}
          ></input>
        )}
        {collReq === "/sleevesBids" && (
          <Select
            id="tax"
            options={allTaxSelect}
            className="add_item select-category"
            placeholder='מע"ם'
            defaultValue={itemsValues.tax}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, tax: e.value };
              });
            }}
            styles={customStyles}
            menuPlacement="auto"
            required
          />
        )}
        {collReq === "/expenses" && (
          <input
            name="taxPercent"
            id="taxPercent"
            style={{ width: "10%" }}
            required
            className="add_item"
            placeholder="אחוז מעמ"
            onChange={(e) =>
              setItemsValues((prev) => {
                return {
                  ...prev,
                  taxPercent: e.target.value,
                  totalAmount:
                    +prev.number + +(e.target.value / 100) * prev.number,
                };
              })
            }
            value={itemsValues.taxPercent}
          ></input>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          marginTop: "1%",
        }}
      >
        <input className="confirm_addItem" type="submit" value="אישור"></input>
        <button className="remove_addItem" onClick={cancelAddingItem}>
          ביטול
        </button>
      </div>
    </form>
  );
}
