import React, { useContext, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Api } from "../../../utils/Api";
import { FetchingStatus } from "../../../utils/context";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import "./Add_item.css";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
export default function AddItem({
  setaddItemToggle,
  setItemIsUpdated,
  collReq,
}) {
  const navigate = useNavigate();
  const productFormData = useRef();
  // eslint-disable-next-line
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemsValues, setItemsValues] = useState({
    number: "",
    name: "",
    mail: "",
    bankProps: "",
  });
  const sendPostRequest = async (token) => {
    const headers = {
      Authorization: token,
    };
    setFetchingStatus({ loading: true, error: false });
    if (collReq === "/contact") {
      await Api.post(collReq, itemsValues, {
        headers: headers,
      });
    } else {
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

  return (
    <form
      ref={productFormData}
      onSubmit={confirmAddingItem}
      className="addItem_form"
    >
      <div className="add-row">
        <input
          name="name"
          id="name"
          required
          autoFocus={true}
          className="add_item"
          style={{ width: "35%" }}
          placeholder={collReq === "/inventory" ? "מוצר" : "שם"}
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
          placeholder={collReq === "/contact" ? "מספר" : "מחיר"}
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, number: e.target.value };
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
