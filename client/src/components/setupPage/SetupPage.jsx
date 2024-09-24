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
import SetupModal from "./SetupModal";
import { sortedInventory } from "../../utils/sortData";

export default function SetupPage({
  collReq,
  report,
  updatedReport,
  isFetching,
  fetchingData,
  taxValues,
}) {
  const date = new Date();
  const year = date.getFullYear();

  const navigate = useNavigate();
  // eslint-disable-next-line
  const [fetchedData, setFetchingData] = useState([]);

  const [pageUpdate, setPageUpdate] = useState(false);

  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemInChange, setItemInChange] = useState(false);
  const [itemIsUpdated, setItemIsUpdated] = useState(false);
  const [addItemToggle, setaddItemToggle] = useState({
    btnVisible: true,
    formVisible: false,
  });
  const [kindOfSort, setKindOfSort] = useState("date");
  const [inventories, setInventories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [providers, setProviders] = useState([]);

  const getTotals = () => {
    let total = 0;
    if (collReq === "/workersExpenses") {
      filterByReport(sortedInventory(fetchedData, kindOfSort)).forEach(
        (element) => {
          total += element.number;
        }
      );
    } else {
      filterByReport(sortedInventory(fetchedData, kindOfSort)).forEach(
        (element) => {
          total += element.totalAmount;
        }
      );
    }
    return total;
  };
  function openModal() {
    setIsOpen(true);
  }
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });

    if (isFetching) {
      if (collReq === "/sales") {
        setFetchingData(fetchingData.salesData);
      } else if (collReq === "/salesToCompanies") {
        setFetchingData(fetchingData.salesToCompaniesData);
      } else if (collReq === "/institutionTax") {
        setFetchingData(fetchingData.institutionTaxData);
      } else if (collReq === "/expenses") {
        setFetchingData(fetchingData.expensesData);
      } else if (collReq === "/workersExpenses") {
        setFetchingData(fetchingData.workersExpensesData);
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
      if (collReq === "/salesToCompanies" || collReq === "/institutionTax") {
        const { data: companies } = await Api.get("/companies", {
          headers,
        });

        setCompanies(companies?.companies);
      }
      if (collReq === "/expenses") {
        const { data: providers } = await Api.get("/providers", { headers });
        setProviders(providers);
      }
      if (collReq === "/institutionTax") {
        const { data: institutionTax } = await Api.get("/institutionTax", {
          headers,
        });
        setProviders(institutionTax);
      }
      if (report === undefined) {
        if (
          collReq === "/sales" ||
          collReq === "/salesToCompanies" ||
          collReq === "/institutionsTax" ||
          collReq === "/sleevesBids" ||
          collReq === "/workersExpenses" ||
          collReq === "/expenses"
        ) {
          setFetchingData(
            data.filter(
              (item) =>
                new Date(item.date).getFullYear() === year ||
                item.colored === true
            )
          );
        } else {
          setFetchingData(data);
        }
      } else {
        setFetchingData(data);
      }
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
  }, [itemIsUpdated, updatedReport, pageUpdate]);
  const filterByReport = (sortedData) => {
    let monthNames = report?.month?.map((month) => month.value);

    if (!report?.type) return sortedData;
    if (report?.month?.length > 0 && report.year) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        if (report?.clientName)
          return (
            monthNames.includes(month) &&
            new Date(item.date).getFullYear() === report?.year &&
            item.clientName === report.clientName
          );
        return (
          monthNames.includes(month) &&
          new Date(item.date).getFullYear() === report?.year
        );
      });
    } else if (report?.month?.length > 0) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        if (report?.clientName)
          return (
            monthNames.includes(month) && item.clientName === report.clientName
          );
        return monthNames.includes(month);
      });
    } else {
      if (report?.clientName)
        return sortedData.filter(
          (item) =>
            new Date(item.date).getFullYear() === report?.year &&
            report?.clientName === item.clientName
        );
      else
        return sortedData.filter(
          (item) => new Date(item.date).getFullYear() === report?.year
        );
    }
  };

  return (
    <div className="inventory-container">
      {(getTotals() > 0 ||
        collReq === "/salesToCompanies" ||
        collReq === "/institutionTax") && (
        <div
          style={{
            width: "60%",
            margin: "auto",
            textAlign: "center",
            borderBottom: "2px solid orange",
          }}
        >
          {(collReq === "/salesToCompanies" || collReq === "/institutionTax") &&
            !report?.type && (
              <img
                src="/setupIcon.png"
                onClick={() => openModal()}
                alt=""
                style={{ width: "4%", margin: "0 2%", cursor: "pointer" }}
              />
            )}
          <label
            htmlFor=""
            style={{
              fontWeight: "bold",
              color: "brown",
            }}
          >
            {"  "}
            {`סה"כ : `}
            {getTotals().toFixed(2)}
            {` ש"ח `}
            {report?.type === "/salesToCompanies" && `  ש"ח כולל מע"מ [ `}
            {report?.type === "/salesToCompanies" && (
              <span style={{ fontSize: "0.8rem", color: "darkblue" }}>
                {(getTotals() / (1 + taxValues?.maamValue / 100)).toFixed(2)}
                {`  ש"ח  `}
                {` + ${taxValues?.maamValue}% מע"מ  ( `}
                {(
                  getTotals() -
                  getTotals() / (1 + taxValues?.maamValue / 100)
                ).toFixed(2)}{" "}
                {`  ש"ח )  `}
              </span>
            )}
            {report?.type === "/salesToCompanies" && `] `}
          </label>
        </div>
      )}
      <SetupModal
        modalIsOpen={modalIsOpen}
        companies={companies}
        setPageUpdate={setPageUpdate}
        setIsOpen={setIsOpen}
      ></SetupModal>
      <form
        className="Item_form"
        style={{
          display: taxValues?.masValue ? "flex" : "none",
          width:
            collReq === "/inventories" || collReq === "/providers"
              ? "60%"
              : "95%",
        }}
      >
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/salesToCompanies" ||
          collReq === "/institutionTax" ||
          collReq === "/workersExpenses" ||
          collReq === "/sales") && (
          <button
            id="date"
            className="input_show_item head"
            style={{ width: report?.type ? "17%" : "11%" }}
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
            style={{ width: "23%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "location");
            }}
          >
            מיקום
          </button>
        )}
        {report?.type !== "/salesToCompanies" &&
          (collReq === "/sales" ||
            collReq === "/workersExpenses" ||
            collReq === "/institutionTax" ||
            collReq === "/salesToCompanies" ||
            collReq === "/sleevesBids") && (
            <button
              id="clientName"
              className="input_show_item head"
              style={{
                width:
                  report?.type || collReq === "/sleevesBids"
                    ? "23%"
                    : collReq === "/salesToCompanies" ||
                      collReq === "/institutionTax"
                    ? "14%"
                    : "13%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setKindOfSort(() => "clientName");
              }}
            >
              {collReq === "/workersExpenses"
                ? "עובד"
                : collReq === "/salesToCompanies"
                ? "חברה"
                : "קליינט"}
            </button>
          )}
        {(collReq === "/sales" || report?.type === "/sales") && (
          <button
            id="remark"
            className="input_show_item head"
            style={{
              width: report?.type ? "10%" : "7%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "remark");
            }}
          >
            {"הערה"}
          </button>
        )}
        {collReq !== "/workersExpenses" && collReq !== "/sleevesBids" && (
          <button
            id="name"
            className="input_show_item head"
            style={{
              maxWidth:
                collReq === "/inventories" || collReq === "/providers"
                  ? "62%"
                  : collReq === "/institutionTax"
                  ? "15%"
                  : report?.type
                  ? "45%"
                  : "18%",
              minWidth:
                collReq === "/inventories" || collReq === "/providers"
                  ? "62%"
                  : collReq === "/institutionTax"
                  ? "15%"
                  : report?.type
                  ? "45%"
                  : "18%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "name");
            }}
          >
            {collReq === "/providers" || collReq === "/expenses"
              ? "שם"
              : collReq === "/contacts"
              ? "שם חברה"
              : collReq === "/salesToCompanies" ||
                collReq === "/sales" ||
                collReq === "/institutionTax"
              ? "עבודה"
              : "מוצר"}
          </button>
        )}
        {collReq === "/workersExpenses" && (
          <button
            id="equipment"
            className="input_show_item head"
            style={{ width: "15%" }}
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
                ? "5%"
                : collReq === "/contacts" || collReq === "/expenses"
                ? "8%"
                : collReq === "/institutionTax"
                ? "5%"
                : "15%",
          }}
          onClick={(e) => {
            e.preventDefault();
            setKindOfSort(() => "number");
          }}
        >
          {collReq === "/inventories" ||
          collReq === "/sales" ||
          collReq === "/institutionTax" ||
          collReq === "/sleevesBids"
            ? "מחיר"
            : collReq === "/expenses" ||
              collReq === "/workersExpenses" ||
              collReq === "/salesToCompanies"
            ? "סכום"
            : "מספר / טלפון"}
        </button>
        {collReq === "/sales" && (
          <button
            id="discount"
            className="input_show_item head"
            style={{ width: "4%" }}
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
            style={{ width: "4%" }}
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
            style={{ width: "5%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "expenses");
            }}
          >
            {report?.type ? "הוצ." : "הוצאות"}
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
            style={{ width: "25%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "bankProps");
            }}
          >
            פרטי בנק
          </button>
        )}

        {(collReq === "/expenses" || collReq === "/institutionTax") && (
          <button
            id="taxNumber"
            className="input_show_item head"
            style={{ width: "7%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "taxNumber");
            }}
          >
            {`מס.חשב`}
          </button>
        )}
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/sales" ||
          collReq === "/workersExpenses") && (
          <button
            id="tax"
            className="input_show_item head"
            style={{ width: "4%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "tax");
            }}
          >
            {collReq === "/workersExpenses" || collReq === "/expenses"
              ? "שולם"
              : report?.type
              ? "חשב."
              : "חשב."}
          </button>
        )}
        {(collReq === "/expenses" || collReq === "/institutionTax") && (
          <button
            id="paymentDate"
            className="input_show_item head"
            style={{ width: report?.type ? "15%" : "12%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "paymentDate");
            }}
          >
            ת.תשלום{" "}
          </button>
        )}
        {collReq === "/institutionTax" && (
          <button
            id="withholdingTax"
            className="input_show_item head"
            style={{
              width: "8%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "withholdingTax");
            }}
          >
            נ.במקור{` %${taxValues?.masValue}`}
          </button>
        )}
        {(collReq === "/sleevesBids" ||
          collReq === "/institutionTax" ||
          collReq === "/expenses" ||
          collReq === "/institutionTax" ||
          collReq === "/sales") && (
          <button
            id="totalAmount"
            className="input_show_item head"
            style={{
              width: collReq === "/expenses" ? "10%" : "6%",
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
        filterByReport(sortedInventory(fetchedData, kindOfSort)).map((item) => {
          return (
            <ItemsTable
              taxValues={taxValues}
              key={`item${item._id}`}
              item={item}
              itemInChange={itemInChange}
              setItemInChange={setItemInChange}
              myData={fetchedData}
              setItemIsUpdated={setItemIsUpdated}
              collReq={collReq}
              companies={companies}
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
          companies={companies}
          taxValues={taxValues}
          selectData={collReq === "/expenses" ? providers : inventories}
          pageUpdate={pageUpdate}
        ></AddItem>
      )}
    </div>
  );
}
