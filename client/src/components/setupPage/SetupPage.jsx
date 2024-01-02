import React from "react";
import { useState, useContext } from "react";
import AddItem from "./Add_Item/AddItem";
import AddItemBtn from "./Add_Item/AddItemBtn";
import ItemsTable from "./Items_Table/ItemsTable";
import { FetchingStatus } from "../../utils/context";
import "./SetupPage.css";
import { useEffect } from "react";

import { useNavigate } from "react-router";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";
import e from "cors";
import { Api } from "../../utils/Api";

export default function SetupPage() {
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
  const [kindOfSort, setKindOfSort] = useState("category");
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const { data } = await Api.get("/Inventory", { headers });
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
      case "desc":
        return inventoryData?.sort((a, b) => (a.desc > b.desc ? 1 : -1));
      case "category":
        return inventoryData?.sort((a, b) =>
          a.category > b.category ? 1 : -1
        );
      case "length":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.length) - parseFloat(b.length)
        );

      case "weight":
        return inventoryData?.sort(
          (a, b) => parseFloat(a.weight) - parseFloat(b.weight)
        );
      default:
        return inventoryData?.sort((a, b) =>
          a.category > b.category ? 1 : -1
        );
    }
  };
  return (
    <div>
      <div>
        <form className="Item_form">
          <div className="item_image">
            <img className="imageHead" src="/jpgImage.png" alt="" />
          </div>
          <button
            id="weight"
            className="input_show_item head"
            style={{ width: "10%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "weight");
            }}
          >
            משקל
          </button>
          <button
            id="length"
            className="input_show_item head"
            style={{ width: "10%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "length");
            }}
          >
            אורך
          </button>
          <button
            id="kind"
            className="input_show_item head select-category"
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "cetegory");
            }}
          >
            סוג
          </button>
          <button
            id="desc"
            className="input_show_item head desc-style"
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "desc");
            }}
          >
            תאור
          </button>
          <button
            id="number"
            className="input_show_item head"
            style={{ width: "10%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "number");
            }}
          >
            מספר
          </button>
          <button style={{ visibility: "hidden" }} className="edit_btn">
            edit
          </button>
          <button style={{ visibility: "hidden" }} className="delete_btn">
            delete
          </button>
        </form>
      </div>

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
            />
          );
        })}
      {!addItemToggle.formVisible &&
        !fetchingStatus.error &&
        !fetchingStatus.loading && (
          <AddItemBtn setaddItemToggle={setaddItemToggle}></AddItemBtn>
        )}
      {!addItemToggle.btnVisible && (
        <AddItem
          setaddItemToggle={setaddItemToggle}
          setInventoryData={setInventoryData}
          setItemIsUpdated={setItemIsUpdated}
        ></AddItem>
      )}
    </div>
  );
}
