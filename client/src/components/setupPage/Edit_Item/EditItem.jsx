import React from "react";
import "./EditItem.css";
import { FetchingStatus } from "../../../utils/context";
import { useContext } from "react";
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
  const checkInputsValues = () => {
    const thisProps = getCollectionProps(collReq);
    for (let i in itemsValues) {
      if (itemsValues[i] === "" && thisProps.includes(i)) return true;
    }
  };
  const isInputsChanged = () => {
    switch (collReq) {
      case "/contacts":
        return (
          itemsValues.number !== item.number ||
          itemsValues.name !== item.name ||
          itemsValues.mail !== item.mail ||
          itemsValues.bankProps !== item.bankProps
        );
      case "/sleevesBids":
        return (
          itemsValues.number !== item.number ||
          itemsValues.name !== item.name ||
          itemsValues.date !== item.date ||
          itemsValues.tax !== item.tax ||
          itemsValues.quantity !== item.quantity ||
          itemsValues.totalAmount !== item.totalAmount
        );
      case "/expenses":
        return (
          itemsValues.number !== item.number ||
          itemsValues.name !== item.name ||
          itemsValues.date !== item.date ||
          itemsValues.taxPercent !== item.taxPercent ||
          itemsValues.totalAmount !== item.totalAmount
        );

      case "/inventories":
        return (
          itemsValues.number !== item.number || itemsValues.name !== item.name
        );

      default:
        return (
          itemsValues.number !== item.number || itemsValues.name !== item.name
        );
    }
  };
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });

    switch (collReq) {
      case "/sleevesBids":
        await Api.patch(
          `${collReq}/${item._id}`,
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
      case "/contacts":
        await Api.patch(
          `${collReq}/${item._id}`,
          {
            name: itemsValues.name,
            number: itemsValues.number,
            mail: itemsValues.mail,
            bankProps: itemsValues.bankProps,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/inventories":
        await Api.patch(
          `${collReq}/${item._id}`,
          { name: itemsValues.name, number: itemsValues.number },
          {
            headers: headers,
          }
        );
        break;
      case "/expenses":
        await Api.patch(
          `${collReq}/${item._id}`,
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
      default:
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
        width: collReq === "/sales" ? "7%" : "11%",
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
