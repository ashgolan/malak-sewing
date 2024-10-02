import React, { useContext } from "react";
import "./EditItem.css";
import { FetchingStatus } from "../../../utils/context";
import { Api } from "../../../utils/Api";
import { useNavigate } from "react-router";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import { getCollectionProps } from "../../../utils/collectionProps";

export default function EditItem({
  item,
  itemInChange,
  setItemInChange,
  changeStatus,
  setChangeStatus,
  itemsValues,
  setItemIsUpdated,
  collReq,
}) {
  const navigate = useNavigate();
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);

  // Check if inputs are empty based on collection properties
  const checkInputsValues = () => {
    const thisProps = getCollectionProps(collReq);
    if (!thisProps) return;
    return Object.keys(itemsValues).some(
      (key) => thisProps.includes(key) && itemsValues[key] === ""
    );
  };

  // Generalized function to check if inputs have changed
  const isInputsChanged = () => {
    const relevantProps = {
      "/contacts": ["number", "name", "mail", "bankProps"],
      "/sleevesBids": [
        "number",
        "clientName",
        "date",
        "tax",
        "quantity",
        "colored",
        "totalAmount",
      ],

      "/bouncedChecks": [
        "clientName",
        "number",
        "date",
        "bankNumber",
        "checkNumber",
        "branchNumber",
        "accountNumber",
        "taxNumber",
        "paymentDate",
        "remark",
        "colored",
        "totalAmount",
      ],
      "/workersExpenses": [
        "date",
        "location",
        "clientName",
        "colored",
        "equipment",
        "number",
        "totalAmount",
        "colored",
        "tax",
      ],
      "/sales": [
        "number",
        "name",
        "clientName",
        "remark",
        "sale",
        "discount",
        "expenses",
        "date",
        "tax",
        "colored",
        "quantity",
        "totalAmount",
      ],
      "/institutionTax": [
        "date",
        "clientName",
        "name",
        "number",
        "taxNumber",
        "withholdingTax",
        "paymentDate",
        "colored",
        "totalAmount",
      ],
      "/salesToCompanies": [
        "date",
        "clientName",
        "name",
        "containersNumbers",
        "kindOfWork",
        "afterTax",
        "sending",
        "number",
        "colored",
        "totalAmount",
      ],
      "/expenses": [
        "number",
        "name",
        "tax",
        "taxNumber",
        "date",
        "colored",
        "paymentDate",
        "totalAmount",
      ],
      "/inventories": ["number", "name"],
    }[collReq] || ["number", "name"];

    return relevantProps.some((key) => itemsValues[key] !== item[key]);
  };

  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    const patchData = Object.keys(itemsValues).reduce((acc, key) => {
      if (key === "clientName" && itemsValues[key] !== undefined) {
        acc[key] = itemsValues[key].trim();
      } else if (itemsValues[key] !== undefined) {
        acc[key] = itemsValues[key];
      }
      return acc;
    }, {});

    setFetchingStatus({ status: true, loading: true });

    try {
      await Api.patch(`${collReq}/${item._id}`, patchData, { headers });
      setFetchingStatus({
        status: false,
        loading: false,
        message: "העידכון בוצע בהצלחה",
      });
      setTimeout(() => {
        setFetchingStatus({ status: false, loading: false, message: null });
      }, 1000);
      setItemIsUpdated((prev) => !prev);
    } catch (error) {
      setFetchingStatus({
        status: false,
        loading: false,
        message: "תקלה בעדכון המוצר. אנא נסה שוב",
      });
      setTimeout(() => {
        setFetchingStatus({
          status: false,
          loading: false,
          message: null,
        });
      }, 1000);
      console.error("Error during the update:", error);
    }
  };

  // Update data with error handling and token refresh
  const updateData = async () => {
    try {
      await sendRequest(getAccessToken());
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          await sendRequest(newAccessToken);
        } catch (refreshError) {
          clearTokens();
          navigate("/homepage");
        }
      } else {
        clearTokens();
        setFetchingStatus({
          status: false,
          loading: false,
          message: ".. תקלה בעדכון המוצר",
        });
        setTimeout(() => navigate("/homepage"), 1000);
      }
    }
  };

  // Edit handler
  const editHandler = (e) => {
    e.preventDefault();
    if (changeStatus.editText === "אישור") {
      if (checkInputsValues()) {
        setFetchingStatus({
          status: true,
          error: true,
          message: "צריך למלא את כל הנתונים",
        });

        return;
      }

      if (isInputsChanged()) updateData();
    }
    setItemInChange(!itemInChange);
    setChangeStatus((prev) => ({
      editText: prev.editText === "עריכה" ? "אישור" : "עריכה",
      delete: prev.editText === "עריכה" ? "ביטול" : "מחיקה",
      disabled: prev.editText === "עריכה" ? false : true,
      itemId: prev.editText === "עריכה" ? item._id : null,
    }));
  };

  return (
    <button
      style={{
        width:  "6%" ,
        visibility:
          !itemInChange || changeStatus.itemId === item._id
            ? "visible"
            : "hidden",
      }}
      className="edit_btn"
      onClick={editHandler}
    >
      {changeStatus.editText}
    </button>
  );
}
