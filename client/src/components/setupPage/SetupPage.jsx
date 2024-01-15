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

export default function SetupPage({
  collReq,
  report,
  updatedReport,
  isFetching,
  fetchingData,
}) {
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
  const [kindOfSort, setKindOfSort] = useState("date");
  const [inventories, setInventories] = useState([]);
  const [providers, setProviders] = useState([]);
  const getTotals = () => {
    let total = 0;
    filterByReport(sortedInventory(kindOfSort)).forEach((element) => {
      total += element.totalAmount;
    });
    return total;
  };
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });

    if (isFetching) {
      if (collReq === "/sales") {
        setFetchingData(fetchingData.salesData);
      } else if (collReq === "/expenses") {
        setFetchingData(fetchingData.expensesData);
      } else {
        setFetchingData(fetchingData.sleevesBidsData);
      }
    } else {
      const { data } = await Api.get(collReq, { headers });
      if (collReq === "/sales") {
        const { data: inventories } = await Api.get("/inventories", {
          headers,
        });
        setInventories(inventories);
      }
      if (collReq === "/expenses") {
        const { data: providers } = await Api.get("/providers", { headers });
        setProviders(providers);
      }
      setFetchingData(data);
    }
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
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
        return fetchedData?.sort((a, b) =>
          a.clientName > b.clientName ? 1 : -1
        );
      case "totalAmount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
        );
      case "discount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.discount) - parseFloat(b.discount)
        );
      case "sale":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.sale) - parseFloat(b.sale)
        );
      case "expenses":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.expenses) - parseFloat(b.expenses)
        );
      case "quantity":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
        );
      case "name":
        return fetchedData?.sort((a, b) => (a.name > b.name ? 1 : -1));
      case "tax":
        return fetchedData?.sort((a, b) => (a.tax > b.tax ? 1 : -1));
      case "location":
        return fetchedData?.sort((a, b) => (a.location > b.location ? 1 : -1));
      case "equipment":
        return fetchedData?.sort((a, b) =>
          a.equipment > b.equipment ? 1 : -1
        );
      case "date":
        return fetchedData?.sort((a, b) => (a.date > b.date ? 1 : -1));
      case "paymentDate":
        return fetchedData?.sort((a, b) =>
          a.paymentDate > b.paymentDate ? 1 : -1
        );
      case "mail":
        return fetchedData?.sort((a, b) => (a.mail > b.mail ? 1 : -1));
      case "bankProps":
        return fetchedData?.sort((a, b) =>
          a.bankProps > b.bankProps ? 1 : -1
        );
      default:
        return fetchedData?.sort((a, b) => (a.date > b.date ? 1 : -1));
    }
  };

  return (
    <div className="inventory-container">
      {getTotals() > 0 && (
        <label
          htmlFor=""
          style={{
            width: "30%",
            margin: "auto",
            textAlign: "center",
            fontWeight: "bold",
            color: "brown",
            borderBottom: "2px solid orange",
          }}
        >
          {"  "}
          {`סכום כל התנועות : `}
          {getTotals()}
          {` ש"ח `}
        </label>
      )}
      <form
        className="Item_form"
        style={{
          width:
            collReq === "/inventories" || collReq === "/providers"
              ? "60%"
              : "90%",
        }}
      >
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/workersExpenses" ||
          collReq === "/sales") && (
          <button
            id="date"
            className="input_show_item head"
            style={{ width: collReq === "/sales" ? "11%" : "13%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "date");
            }}
          >
            תאריך
          </button>
        )}
        {collReq === "/workersExpenses" && (
          <button
            id="location"
            className="input_show_item head"
            style={{ width: "12%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "location");
            }}
          >
            מיקום
          </button>
        )}
        {(collReq === "/sales" || collReq === "/workersExpenses") && (
          <button
            id="clientName"
            className="input_show_item head"
            style={{ width: report?.type ? "25%" : "12%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "clientName");
            }}
          >
            קליינט
          </button>
        )}
        {collReq !== "/workersExpenses" && (
          <button
            id="name"
            className="input_show_item head"
            style={{
              width:
                collReq === "/inventories" || collReq === "/providers"
                  ? "62%"
                  : collReq === "/sales" || collReq === "/expenses"
                  ? "22%"
                  : report?.type
                  ? "45%"
                  : "25%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "name");
            }}
          >
            {collReq === "/providers" ||
            collReq === "/contacts" ||
            collReq === "/expenses"
              ? "שם"
              : "מוצר"}
          </button>
        )}
        {collReq === "/workersExpenses" && (
          <button
            id="equipment"
            className="input_show_item head"
            style={{ width: "22%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "equipment");
            }}
          >
            ציוד
          </button>
        )}
        <button
          id="number"
          className="input_show_item head"
          style={{
            width:
              collReq === "/sales" || collReq === "/workersExpenses"
                ? "7%"
                : "15%",
          }}
          onClick={(e) => {
            e.preventDefault();
            setKindOfSort(() => "number");
          }}
        >
          {collReq === "/inventories" ||
          collReq === "/sales" ||
          collReq === "/sleevesBids"
            ? "מחיר"
            : collReq === "/expenses" || collReq === "/workersExpenses"
            ? "סכום"
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
            {collReq === "/sales" ? 'כ.מ"ר' : "כמות"}
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="expenses"
            className="input_show_item head"
            style={{ width: "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "expenses");
            }}
          >
            הוצאות
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

        {(collReq === "/sleevesBids" ||
          collReq === "/sales" ||
          collReq === "/workersExpenses") && (
          <button
            id="tax"
            className="input_show_item head"
            style={{ width: "9%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "tax");
            }}
          >
            {collReq === "/workersExpenses" ? "שולם" : "חשבונית"}
          </button>
        )}
        {collReq === "/expenses" && (
          <button
            id="paymentDate"
            className="input_show_item head"
            style={{ width: collReq === "/sales" ? "10%" : "13%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "paymentDate");
            }}
          >
            ת.תשלום{" "}
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
                  ? "10%"
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
              selectData={collReq === "/expenses" ? providers : inventories}
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
          selectData={collReq === "/expenses" ? providers : inventories}
        ></AddItem>
      )}
    </div>
  );
}
