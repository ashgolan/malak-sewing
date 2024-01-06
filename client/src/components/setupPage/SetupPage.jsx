import React from "react";
import { useState, useContext } from "react";
import AddItem from "./Add_Item/AddItem";
import AddItemBtn from "./Add_Item/AddItemBtn";
import ItemsTable from "./Items_Table/ItemsTable";
import { FetchingStatus } from "../../utils/context";
import "./SetupPage.css";
import { useEffect } from "react";

import { useNavigate } from "react-router";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";

export default function SetupPage({ collReq }) {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [inventoryData, setInventoryData] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemInChange, setItemInChange] = useState(false);
  const [itemIsUpdated, setItemIsUpdated] = useState(false);
  const [addItemToggle, setaddItemToggle] = useState({
    btnVisible: true,
    formVisible: false,
  });
  const [kindOfSort, setKindOfSort] = useState("name");
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const { data } = await Api.get(collReq, { headers });
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
        await sendRequest(getAccessToken());
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshMyToken();
            try {
              await sendRequest(newAccessToken);
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
  }, [itemIsUpdated]);
  const sortedInventory = (kindOfSort) => {
    switch (kindOfSort) {
      case "number":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.number) - parseFloat(b.number)
        );
      case "totalAmount":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
        );
      case "taxPercent":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.taxPercent) - parseFloat(b.taxPercent)
        );
      case "name":
        return inventoryData?.sort((a, b) => (a.name > b.name ? 1 : -1));
      case "date":
        return inventoryData?.sort((a, b) => (a.date > b.date ? 1 : -1));
      case "mail":
        return inventoryData?.sort((a, b) => (a.mail > b.mail ? 1 : -1));
      case "bankProps":
        return inventoryData?.sort((a, b) =>
          a.bankProps > b.bankProps ? 1 : -1
        );
      default:
        return inventoryData?.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  };
  return (
    <div className="inventory-container">
      <form className="Item_form">
        {(collReq === "/sleevesBids" || collReq === "/expenses") && (
          <button
            id="date"
            className="input_show_item head"
            style={{ width: "13%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "date");
            }}
          >
            תאריך
          </button>
        )}
        <button
          id="name"
          className="input_show_item head"
          style={{
            width:
              collReq === "/inventory" || collReq === "/provider"
                ? "63%"
                : "25%",
          }}
          onClick={(e) => {
            e.preventDefault();
            setKindOfSort(() => "name");
          }}
        >
          מוצר
        </button>
        <button
          id="number"
          className="input_show_item head"
          style={{ width: "15%" }}
          onClick={(e) => {
            e.preventDefault();
            setKindOfSort(() => "number");
          }}
        >
          {collReq === "/inventory" || collReq === "/expenses"
            ? "מחיר"
            : "מספר / טלפון"}
        </button>
        {collReq === "/contact" && (
          <button
            id="mail"
            className="input_show_item head"
            style={{
              width:
                collReq === "/inventory" || collReq === "/provider"
                  ? "15%"
                  : "23.5%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "mail");
            }}
          >
            דואר אלקטרוני
          </button>
        )}
        {collReq === "/contact" && (
          <button
            id="bankProps"
            className="input_show_item head"
            style={{ width: "15%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "bankProps");
            }}
          >
            פרטי בנק
          </button>
        )}
        {collReq === "/sleevesBids" && (
          <button
            id="quantity"
            className="input_show_item head"
            style={{ width: "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "quantity");
            }}
          >
            כמות
          </button>
        )}
        {collReq === "/sleevesBids" && (
          <button
            id="tax"
            className="input_show_item head"
            style={{ width: "10%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "tax");
            }}
          >
            מע"מ
          </button>
        )}
        {collReq === "/expenses" && (
          <button
            id="taxPercent"
            className="input_show_item head"
            style={{ width: "15%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "taxPercent");
            }}
          >
            אחוז מע"מ
          </button>
        )}
        {(collReq === "/sleevesBids" || collReq === "/expenses") && (
          <button
            id="totalAmount"
            className="input_show_item head"
            style={{ width: "9%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "totalAmount");
            }}
          >
            סה"כ
          </button>
        )}

        <button style={{ visibility: "hidden" }} className="edit_btn">
          edit
        </button>
        <button style={{ visibility: "hidden" }} className="delete_btn">
          delete
        </button>
      </form>

      {(!fetchingStatus.loading || inventoryData.length > 0) &&
        sortedInventory(kindOfSort).map((item) => {
          return (
            <ItemsTable
              key={`item${item._id}`}
              item={item}
              itemInChange={itemInChange}
              setItemInChange={setItemInChange}
              myData={inventoryData}
              setItemIsUpdated={setItemIsUpdated}
              collReq={collReq}
            />
          );
        })}
      {!addItemToggle.formVisible && !fetchingStatus.loading && (
        <AddItemBtn setaddItemToggle={setaddItemToggle}></AddItemBtn>
      )}
      {!addItemToggle.btnVisible && (
        <AddItem
          setaddItemToggle={setaddItemToggle}
          setInventoryData={setInventoryData}
          setItemIsUpdated={setItemIsUpdated}
          collReq={collReq}
        ></AddItem>
      )}
    </div>
  );
}
