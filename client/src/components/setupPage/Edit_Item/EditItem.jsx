import React from "react";
import "./EditItem.css";
import { FetchingStatus } from "../../../utils/context";
import { useContext } from "react";
import { Api } from "../../../utils/Api";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import { useNavigate } from "react-router";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
export default function EditItem({
  item,
  itemInChange,
  setItemInChange,
  changeStatus,
  setChangeStatus,
  itemsValues,
  setItemIsUpdated,
  photoChanged,
  setPhotoChanged,
}) {
  const navigate = useNavigate();
  // const [accessToken, setAccessToken] = useState(getAccessToken());
  // eslint-disable-next-line
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const checkInputsValues = () => {
    for (let i in itemsValues) {
      if (itemsValues[i] === "") return true;
    }
  };
  const isInputsChanged = () => {
    if (
      itemsValues.number !== item.number ||
      itemsValues.desc !== item.desc ||
      itemsValues.category !== item.category ||
      itemsValues.weight !== item.weight ||
      itemsValues.length !== item.length ||
      photoChanged
    )
      return true;
  };
  const getFormData = () => {
    let formData = new FormData();
    formData.append("number", itemsValues.number);
    formData.append("desc", itemsValues.desc);
    formData.append("category", itemsValues.category);
    formData.append("weight", itemsValues.weight);
    formData.append("length", itemsValues.length);
    formData.append("image", itemsValues.image);
    formData.append("lastPath", item.imagePath);
    return formData;
  };
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    await Api.patch(`/Inventory/${item._id}`, getFormData(), {
      headers: headers,
      "content-type": "multipart/form-data",
    });
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        message: "המוצר עודכן בהצלחה",
      };
    });
    setPhotoChanged(false);
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
