import React from "react";
import "./EditItem.css";
import { FetchingStatus } from "../../../utils/context";
import { useContext } from "react";
import { Api } from "../../../utils/Api";
import { useNavigate } from "react-router";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
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
  const checkInputsValues = () => {
    for (let i in itemsValues) {
      if (itemsValues[i] === "") return true;
    }
  };
  const isInputsChanged = () => {
    if (collReq === "/contact") {
      if (
        itemsValues.number !== item.number ||
        itemsValues.name !== item.name ||
        itemsValues.mail !== item.mail ||
        itemsValues.bankProps !== item.bankProps
      )
        return true;
    } else {
      if (itemsValues.number !== item.number || itemsValues.name !== item.name)
        return true;
    }
    return false;
  };
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    if (collReq === "/contact") {
      await Api.patch(`${collReq}/${item._id}`, itemsValues, {
        headers: headers,
      });
    } else {
      await Api.patch(
        `${collReq}/${item._id}`,
        { name: itemsValues.name, number: itemsValues.number },
        {
          headers: headers,
        }
      );
    }
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        message: "המוצר עודכן בהצלחה",
      };
    });
    setItemIsUpdated((prev) => !prev);
    setTimeout(() => {
      setFetchingStatus((prev) => {
        return { ...prev, status: false, loading: false, message: null };
      });
    }, 1000);
  };
  const updateData = async () => {
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
            message: ".. תקלה בעדכון המוצר",
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

  const editHandler = (e) => {
    e.preventDefault();

    if (changeStatus.editText === "אישור") {
      const haveAnEmptyValues = checkInputsValues();
      if (haveAnEmptyValues) {
        setFetchingStatus((prev) => {
          return {
            ...prev,
            status: true,
            error: true,
            message: "צריך למלא את כל הנתונים",
          };
        });
        return;
      }
      const isChanged = isInputsChanged();

      isChanged && updateData();
      setFetchingStatus((prev) => {
        return { ...prev, status: false, message: null };
      });
    }

    setItemInChange(!itemInChange);
    setChangeStatus((prev) => {
      return {
        editText: prev.editText === "עריכה" ? "אישור" : "עריכה",
        delete: prev.editText === "עריכה" ? "ביטול" : "מחיקה",
        disabled: prev.editText === "עריכה" ? false : true,
        itemId: prev.editText === "עריכה" ? item._id : null,
      };
    });
  };

  return (
    <button
      style={{
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
