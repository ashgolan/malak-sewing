import React, { useContext, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import Select from "react-select";
import { Api } from "../../../utils/Api";
import { FetchingStatus } from "../../../utils/context";
import { allCategoriesSelect } from "../../../utils/inventory_categories";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import "./Add_item.css";
export default function AddItem({ setaddItemToggle, setItemIsUpdated }) {
  const navigate = useNavigate();
  const fileInput = useRef();
  const productFormData = useRef();
  // eslint-disable-next-line
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemsValues, setItemsValues] = useState({
    number: "",
    desc: "",
    category: "",
    weight: "",
    length: "",
    image: null,
    imageData: null,
  });
  const sendPostRequest = async (token) => {
    const headers = {
      Authorization: token,
    };
    let formData = new FormData();
    formData.append("number", itemsValues.number);
    formData.append("desc", itemsValues.desc);
    formData.append("category", itemsValues.category);
    formData.append("weight", itemsValues.weight);
    formData.append("length", itemsValues.length);
    formData.append("image", itemsValues.image);

    setFetchingStatus({ loading: true, error: false });
    await Api.post("/Inventory", formData, {
      headers: { ...headers },
      "content-type": "multipart/form-data",
    });
    setItemIsUpdated((prev) => !prev);

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        error: false,
        message: "המוצר נוסף בהצלחה",
      };
    });
    setTimeout(() => {
      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: false,
          loading: false,
          error: false,
          message: null,
        };
      });
    }, 1000);
  };

  const addItem = async () => {
    try {
      await sendPostRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await sendPostRequest(newAccessToken);
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
            message: ".. תקלה בביטול ההזמנה",
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

  const confirmAddingItem = (e) => {
    e.preventDefault();

    setaddItemToggle({ btnVisible: true, formVisible: false });
    addItem();
  };
  const cancelAddingItem = (e) => {
    e.preventDefault();
    setaddItemToggle({ btnVisible: true, formVisible: false });
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
      backgroundColor: "rgb(248, 253, 174)",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
  };
  return (
    <form
      ref={productFormData}
      onSubmit={confirmAddingItem}
      className="addItem_form"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "1% 0",
        }}
      >
        <input
          type="file"
          name="name"
          id="image"
          style={{ display: "none" }}
          ref={fileInput}
          accept="image/png, image/jpeg"
          onInput={(e) => {
            setItemsValues((prev) => {
              // return { ...prev, image: "/images/" + e.target.files[0].name };
              return { ...prev, image: e.target.files[0] };
            });
          }}
        />
      </div>

      <img
        style={{ width: "5%", cursor: "pointer", margin: "1% auto" }}
        src="../uploadImage2.png"
        alt=""
        onClick={(e) => {
          e.preventDefault();
          fileInput.current.click();
        }}
      />
      <div className="add-row">
        <input
          name="number"
          id="number"
          style={{ width: "10%" }}
          required
          autoFocus={true}
          className="add_item"
          placeholder="מספר"
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, number: e.target.value };
            })
          }
          value={itemsValues.number}
        ></input>
        <input
          name="desc"
          id="desc"
          required
          className="add_item"
          style={{ width: "35%" }}
          placeholder="תאור"
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, desc: e.target.value };
            })
          }
          value={itemsValues.desc}
        ></input>
        <Select
          name="category"
          id="category"
          options={allCategoriesSelect}
          placeholder={"בחר קטגוריה"}
          className="add_item select-category"
          style={{ width: "30%" }}
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, category: e.value };
            })
          }
          menuPlacement="auto"
          defaultValue={itemsValues.category}
          styles={customStyles}
          required
        ></Select>
        <input
          name="length"
          id="length"
          required
          className="add_item"
          style={{ width: "15%" }}
          placeholder="אורך"
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, length: e.target.value };
            })
          }
          value={itemsValues.length}
        ></input>
        <input
          name="weight"
          id="weight"
          required
          className="add_item"
          style={{ width: "15%" }}
          placeholder="משקל"
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, weight: e.target.value };
            })
          }
          value={itemsValues.weight}
        ></input>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "1%" }}
      >
        <input className="confirm_addItem" type="submit" value="אישור"></input>
        <button className="remove_addItem" onClick={cancelAddingItem}>
          ביטול
        </button>
      </div>
    </form>
  );
}
