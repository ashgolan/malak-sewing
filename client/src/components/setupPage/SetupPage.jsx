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
import Select from "react-select";

export default function SetupPage({ collReq, report, updatedReport }) {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [fetchedData, setFetchingData] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemInChange, setItemInChange] = useState(false);
  const [itemIsUpdated, setItemIsUpdated] = useState(false);
  const [addItemToggle, setaddItemToggle] = useState({
    btnVisible: true,
    formVisible: false,
  });
  const [kindOfSort, setKindOfSort] = useState("name");
  const [inventories, setInventories] = useState([]);
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const { data } = await Api.get(collReq, { headers });
    if (collReq === "/sales") {
      const { data: inventories } = await Api.get("/inventories", { headers });
      setInventories(inventories);
    }
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
    setFetchingData(data);
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
  }, [itemIsUpdated, updatedReport]);
  const filterByReport = (sortedData) => {
    if (!report?.type) return sortedData;
    if (report?.month && report.year) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;

        return (
          month == report?.month &&
          new Date(item.date).getFullYear() === report?.year
        );
      });
    } else if (report?.month) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        return month == report?.month;
      });
    } else {
      return sortedData.filter(
        (item) => new Date(item.date).getFullYear() === report?.year
      );
    }
  };
  const sortedInventory = (kindOfSort) => {
    switch (kindOfSort) {
      case "number":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.number) - parseFloat(b.number)
        );
      case "clientName":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.clientName) - parseFloat(b.clientName)
        );
      case "totalAmount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
        );
      case "discount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.discount) - parseFloat(b.discount)
        );
      case "taxPercent":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.taxPercent) - parseFloat(b.taxPercent)
        );
      case "setupPrice":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.setupPrice) - parseFloat(b.setupPrice)
        );
      case "quantity":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
        );
      case "name":
        return fetchedData?.sort((a, b) => (a.name > b.name ? 1 : -1));
      case "date":
        return fetchedData?.sort((a, b) => (a.date > b.date ? 1 : -1));
      case "mail":
        return fetchedData?.sort((a, b) => (a.mail > b.mail ? 1 : -1));
      case "bankProps":
        return fetchedData?.sort((a, b) =>
          a.bankProps > b.bankProps ? 1 : -1
        );
      default:
        return fetchedData?.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  };
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "right",
      backgroundColor: "rgb(255, 245, 112)",
      border: "none",
      boxShadow: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
      backgroundColor: "rgb(255, 245, 112)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(255, 245, 112)",
      // color: state.isFocused ? "rgb(48, 45, 45)" : "inherit",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: "none", // Hide the default dropdown indicator arrow
    }),
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
            style={{ width: report?.type ? "20%" : "12%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "clientName");
            }}
          >
            קליינט
          </button>
        )}
        {collReq !== "/sales" && (
          <button
            id="name"
            className="input_show_item head"
            style={{
              width:
                collReq === "/inventories" || collReq === "/providers"
                  ? "62%"
                  : report?.type
                  ? "45%"
                  : "25%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "name");
            }}
          >
            מוצר
          </button>
        )}
        {collReq === "/sales" && (
          <Select
            className="input_show_item select-product-head head"
            // style={{ width: "15%" }}
            placeholder="בחר מוצר"
            styles={customStyles}
            menuPlacement="auto"
            required
            isDisabled={true}
          ></Select>
        )}
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
            style={{ width: "10%", textAlign: "center" }}
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

        {!report?.type && (
          <button
            style={{
              visibility: "hidden",
              width: collReq === "/sales" ? "7%" : "11%",
            }}
            className="edit_btn"
          >
            edit
          </button>
        )}
        {!report?.type && (
          <button
            style={{
              visibility: "hidden",
              width: collReq === "/sales" ? "7%" : "11%",
            }}
            className="delete_btn"
          >
            delete
          </button>
        )}
      </form>

      {(!fetchingStatus.loading || fetchedData.length > 0) &&
        filterByReport(sortedInventory(kindOfSort)).map((item) => {
          return (
            <ItemsTable
              key={`item${item._id}`}
              item={item}
              itemInChange={itemInChange}
              setItemInChange={setItemInChange}
              myData={fetchedData}
              setItemIsUpdated={setItemIsUpdated}
              collReq={collReq}
              inventories={inventories}
              report={report}
            />
          );
        })}
      {!addItemToggle.formVisible &&
        !report?.type &&
        !fetchingStatus.loading && (
          <AddItemBtn setaddItemToggle={setaddItemToggle}></AddItemBtn>
        )}
      {!addItemToggle.btnVisible && !report?.type && (
        <AddItem
          setaddItemToggle={setaddItemToggle}
          setInventoryData={setFetchingData}
          setItemIsUpdated={setItemIsUpdated}
          collReq={collReq}
          inventories={inventories}
        ></AddItem>
      )}
    </div>
  );
}
