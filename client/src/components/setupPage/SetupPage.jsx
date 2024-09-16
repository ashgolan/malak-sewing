import React from "react";
import { useState, useContext } from "react";
import AddItem from "./Add_Item/AddItem";
import AddItemBtn from "./Add_Item/AddItemBtn";
import ItemsTable from "./Items_Table/ItemsTable";
import { FetchingStatus } from "../../utils/context";
import "./SetupPage.css";
import { useEffect } from "react";
import Select from "react-select";

import Modal from "react-modal";
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
  const date = new Date();
  const year = date.getFullYear();

  const navigate = useNavigate();
  // eslint-disable-next-line
  const [fetchedData, setFetchingData] = useState([]);
  const [setupSelection, setSetupSelection] = useState({
    category: null,
    function: null,
    companyName: null,
    task: null,
  });
  const [pageUpdate, setPageUpdate] = useState(false);
  const [method, setMethod] = useState("get");
  const [endPoint, setEndPoint] = useState("/companies/");
  const [companyId, setCompanyId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [taskBody, setTaskBody] = useState({
    name: "",
  });
  const [companyBody, setCompanyBody] = useState({
    description: "",
  });

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

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      maxWidth: "90%",
      textAlign: "center",
    },
  };
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#0e6486";
  }
  const initialSetupSelection = {
    category: null,
    function: null,
    companyName: null,
    task: null,
  };

  const initialCompanyBody = {
    companyName: "",
  };

  const initialTaskBody = {
    taskName: "",
  };
  function closeModal() {
    setSetupSelection(initialSetupSelection);
    setCompanyBody(initialCompanyBody);
    setTaskBody(initialTaskBody);
    setEndPoint("");
    setMethod("");
    setCompanyId("");
    setTaskId("");
    setIsOpen(false);
  }

  const getTotals = () => {
    let total = 0;
    if (collReq === "/workersExpenses") {
      filterByReport(sortedInventory(kindOfSort)).forEach((element) => {
        total += element.number;
      });
    } else {
      filterByReport(sortedInventory(kindOfSort)).forEach((element) => {
        total += element.totalAmount;
      });
    }
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
      } else if (collReq === "/salesToCompanies") {
        setFetchingData(fetchingData.salesToCompaniesData);
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
      if (collReq === "/salesToCompanies") {
        const { data: companies } = await Api.get("/companies", {
          headers,
        });

        setCompanies(companies?.companies);
      }
      if (collReq === "/expenses") {
        const { data: providers } = await Api.get("/providers", { headers });
        setProviders(providers);
      }
      if (report === undefined) {
        if (
          collReq === "/sales" ||
          collReq === "/salesToCompanies" ||
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
      case "taxNumber":
        return fetchedData?.sort((a, b) =>
          a.taxNumber > b.taxNumber ? 1 : -1
        );
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
  const getCompanyList = () => {
    return companies?.map((item) => {
      return { value: item._id, label: item.name };
    });
  };
  const getTasksFromCompanyList = () => {
    if (!setupSelection?.companyName?.label) {
      return [];
    }

    const companyNameObj = companies?.find(
      (company) => company.name === setupSelection?.companyName.label
    );

    return companyNameObj?.tasks?.map((item) => {
      return { value: item._id, label: item.description };
    });
  };

  const applyCompaniesAndTaskRequest = async (e) => {
    e.preventDefault();
    const accessToken = getAccessToken(); // Get the token once and reuse it

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    const body =
      endPoint === "/companies/" && method === "put"
        ? { name: companyBody?.companyName }
        : endPoint === "/companies/"
        ? {
            name: companyBody?.companyName,
            taskDescription: taskBody?.taskName,
          }
        : { newDescription: taskBody?.taskName };

    try {
      setFetchingStatus((prev) => ({
        ...prev,
        status: true,
        loading: true,
        message: null,
      }));
      const headers = { Authorization: getAccessToken() };
      if (method === "post" || method === "put" || method === "patch") {
        await Api[method](
          `${endPoint}${companyId ?? ""}${taskId ?? ""}`,
          body,
          { headers }
        );
      } else {
        await Api[method](`${endPoint}${companyId ?? ""}${taskId ?? ""}`, {
          headers,
        });
      }

      setFetchingStatus((prev) => ({
        ...prev,
        status: false,
        loading: false,
        message: "הבקשה בוצעה בהצלחה",
      }));

      setTimeout(() => {
        setFetchingStatus((prev) => ({
          ...prev,
          status: false,
          loading: false,
          message: null,
        }));
      }, 1000);
      setPageUpdate((prev) => !prev);
    } catch (e) {
      console.error(e); // Log the error for debugging

      // Update fetching status on failure
      setFetchingStatus((prev) => ({
        ...prev,
        status: false,
        loading: false,
        message: ".. תקלה ביבוא הנתונים", // Error message in Hebrew
      }));

      // Clear the error message after a short delay
      setTimeout(() => {
        setFetchingStatus((prev) => ({
          ...prev,
          status: false,
          loading: false,
          message: null,
        }));
      }, 1000);
    }
  };

  return (
    <div className="inventory-container">
      {(getTotals() > 0 || collReq === "/salesToCompanies") && (
        <div
          style={{
            width: "60%",
            margin: "auto",
            textAlign: "center",
            borderBottom: "2px solid orange",
          }}
        >
          {collReq === "/salesToCompanies" && !report?.type && (
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
                {(getTotals() / (1 + 17 / 100)).toFixed(2)}
                {`  ש"ח  `}
                {` + מע"מ 17% ( `}
                {(getTotals() - getTotals() / (1 + 17 / 100)).toFixed(2)}{" "}
                {`  ש"ח )  `}
              </span>
            )}
            {report?.type === "/salesToCompanies" && `] `}
          </label>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="הגדרות חברות ועבודות"
      >
        <h2
          style={{ borderBottom: "1px solid rgb(60, 85, 60)" }}
          ref={(_subtitle) => (subtitle = _subtitle)}
        >
          הגדרות חברות ועבודות
        </h2>
        <form onSubmit={applyCompaniesAndTaskRequest}>
          <Select
            options={[
              { value: "01", label: "חברה" },
              { value: "02", label: "עבודה" },
            ]}
            className="setup-select select-product-in-add "
            placeholder={"בחר קטגוריה"}
            required
            onChange={(e) => {
              setSetupSelection((prev) => {
                return {
                  ...prev,
                  category: e || "",
                };
              });
              setEndPoint(
                e?.value === "01" ? "/companies/" : "/companies/task/"
              );
            }}
            value={setupSelection.category || null}
            styles={customStyles}
            isClearable
          ></Select>
          <Select
            options={[
              { value: "01", label: "הוספה" },
              { value: "02", label: "מחיקה" },
              { value: "03", label: "עדכון" },
            ]}
            className="setup-select select-product-in-add "
            placeholder={"בחר פעולה"}
            required
            styles={customStyles}
            onChange={(e) => {
              setSetupSelection((prev) => {
                return {
                  ...prev,
                  function: e,
                };
              });
              setMethod(
                e?.value === "01"
                  ? "post"
                  : e?.value === "02"
                  ? "delete"
                  : "put"
              );
            }}
            value={setupSelection.function || null}
            isClearable
          ></Select>
          {!(
            setupSelection?.function?.label === "הוספה" &&
            setupSelection?.category?.label === "חברה"
          ) && (
            <Select
              options={getCompanyList()}
              className="setup-select select-product-in-add "
              placeholder={"בחר חברה"}
              styles={customStyles}
              menuPlacement="auto"
              required
              defaultValue={setupSelection?.companyName}
              onChange={(e) => {
                setSetupSelection((prev) => {
                  return {
                    ...prev,
                    companyName: e,
                  };
                });
                setCompanyId(
                  endPoint === "/companies/" ||
                    (endPoint === "/companies/task/" && method === "post")
                    ? e?.value
                    : ""
                );
              }}
              value={setupSelection.companyName || null}
              isClearable
            ></Select>
          )}
          {setupSelection?.function?.label !== "הוספה" &&
            !(
              setupSelection?.function?.label === "מחיקה" &&
              setupSelection?.category?.label === "חברה"
            ) &&
            !(
              setupSelection?.function?.label === "עדכון" &&
              setupSelection?.category?.label === "חברה"
            ) && (
              <Select
                options={getTasksFromCompanyList()}
                className="setup-select select-product-in-add"
                placeholder={"בחר עבודה"}
                styles={customStyles}
                menuPlacement="auto"
                required
                onChange={(e) => {
                  setSetupSelection((prev) => ({
                    ...prev,
                    task: e,
                  }));
                  setTaskId(e?.value);
                  // setCompanyId(method === "post" ? "" : e?.value);
                }}
                value={setupSelection.task || null}
                isClearable
              />
            )}

          {setupSelection.category?.label === "חברה" &&
            (setupSelection.function?.label === "הוספה" ||
              setupSelection.function?.label === "עדכון") && (
              <input
                className="setupCompanies-input"
                type="text"
                required
                placeholder="חברה"
                value={companyBody?.companyName}
                onChange={(e) => {
                  setCompanyBody((prev) => {
                    return { ...prev, companyName: e.target.value };
                  });
                }}
              />
            )}
          <br></br>
          {(setupSelection.function?.label === "הוספה" ||
            (setupSelection.function?.label === "עדכון" &&
              setupSelection?.category?.label !== "חברה")) && (
            <input
              className="setupCompanies-input"
              type="text"
              required
              placeholder="עבודה"
              value={taskBody?.taskName}
              onChange={(e) =>
                setTaskBody((prev) => {
                  return { ...prev, taskName: e.target.value };
                })
              }
            />
          )}
          {fetchingStatus.message && (
            <h5
              className="message"
              style={{ borderRadius: 0, backgroundColor: "white" }}
            >
              {fetchingStatus.message}
            </h5>
          )}
          <div className="buttons-in-modal">
            <button
              type="button"
              onClick={() => closeModal()}
              style={{ backgroundColor: "rgb(180, 58, 58)" }}
            >
              ביטול
            </button>
            <button type="submit">אישור</button>
          </div>
        </form>
      </Modal>
      <form
        className="Item_form"
        style={{
          width:
            collReq === "/inventories" || collReq === "/providers"
              ? "60%"
              : "95%",
        }}
      >
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/salesToCompanies" ||
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
            collReq === "/salesToCompanies" ||
            collReq === "/sleevesBids") && (
            <button
              id="clientName"
              className="input_show_item head"
              style={{
                width:
                  report?.type || collReq === "/sleevesBids"
                    ? "23%"
                    : collReq === "/salesToCompanies"
                    ? "18%"
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
                  : collReq === "/sales" ||
                    collReq === "/expenses" ||
                    collReq === "/contacts" ||
                    collReq === "/salesToCompanies"
                  ? "18%"
                  : report?.type
                  ? "45%"
                  : "18%",
              minWidth:
                collReq === "/inventories" || collReq === "/providers"
                  ? "62%"
                  : collReq === "/sales" ||
                    collReq === "/expenses" ||
                    collReq === "/contacts" ||
                    collReq === "/salesToCompanies"
                  ? "18%"
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
              : collReq === "/salesToCompanies"
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

        {collReq === "/expenses" && (
          <button
            id="taxNumber"
            className="input_show_item head"
            style={{ width: "10%", textAlign: "center" }}
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
        {collReq === "/expenses" && (
          <button
            id="paymentDate"
            className="input_show_item head"
            style={{ width: report?.type ? "15%" : "13%" }}
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
          selectData={collReq === "/expenses" ? providers : inventories}
        ></AddItem>
      )}
    </div>
  );
}
