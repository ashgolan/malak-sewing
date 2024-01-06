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
      case "clientName":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.clientName) - parseFloat(b.clientName)
        );
      case "totalAmount":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
        );
      case "discount":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.discount) - parseFloat(b.discount)
        );
      case "taxPercent":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.taxPercent) - parseFloat(b.taxPercent)
        );
      case "setupPrice":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.setupPrice) - parseFloat(b.setupPrice)
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
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/sales") && (
          <button
            id="date"
            className="input_show_item head"
            style={{ width: collReq === "/sales" ? "10%" : "13%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "date");
            }}
          >
            תאריך
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="clientName"
            className="input_show_item head"
            style={{ width: "12%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "clientName");
            }}
          >
            קליינט
          </button>
        )}
        <button
          id="name"
          className="input_show_item head"
          style={{
            width:
              collReq === "/inventories" || collReq === "/providers"
                ? "62%"
                : collReq === "/sales"
                ? "15%"
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
          style={{ width: collReq === "/sales" ? "7%" : "15%" }}
          onClick={(e) => {
            e.preventDefault();
            setKindOfSort(() => "number");
          }}
        >
          {collReq === "/inventories" ||
          collReq === "/expenses" ||
          collReq === "/sales"
            ? "מחיר"
            : "מספר / טלפון"}
        </button>
        {collReq === "/sales" && (
          <button
            id="discount"
            className="input_show_item head"
            style={{ width: "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "discount");
            }}
          >
            הנחה
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="sale"
            className="input_show_item head"
            style={{ width: "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "sale");
            }}
          >
            מ.נטו
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="setupPrice"
            className="input_show_item head"
            style={{ width: "5%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "setupPrice");
            }}
          >
            התקנה
          </button>
        )}
        {collReq === "/contacts" && (
          <button
            id="mail"
            className="input_show_item head"
            style={{
              width: "20%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "mail");
            }}
          >
            דואר אלקטרוני
          </button>
        )}
        {collReq === "/contacts" && (
          <button
            id="bankProps"
            className="input_show_item head"
            style={{ width: "17%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "bankProps");
            }}
          >
            פרטי בנק
          </button>
        )}
        {(collReq === "/sleevesBids" || collReq === "/sales") && (
          <button
            id="quantity"
            className="input_show_item head"
            style={{ width: collReq === "/sales" ? "5%" : "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "quantity");
            }}
          >
            כמות
          </button>
        )}
        {(collReq === "/sleevesBids" || collReq === "/sales") && (
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
            style={{ width: "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "taxPercent");
            }}
          >
            אחוז מע"מ
          </button>
        )}
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/sales") && (
          <button
            id="totalAmount"
            className="input_show_item head"
            style={{
              width:
                collReq === "/expenses"
                  ? "17%"
                  : collReq === "/sales"
                  ? "7%"
                  : "6%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "totalAmount");
            }}
          >
            סה"כ
          </button>
        )}

        <button
          style={{
            visibility: "hidden",
            width: collReq === "/sales" ? "7%" : "11%",
          }}
          className="edit_btn"
        >
          edit
        </button>
        <button
          style={{
            visibility: "hidden",
            width: collReq === "/sales" ? "7%" : "11%",
          }}
          className="delete_btn"
        >
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
