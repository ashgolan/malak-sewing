import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Select from "react-select";
import { allCategoriesSelect } from "../../../utils/inventory_categories";
import DeleteItem from "../Delete_Item/DeleteItem";
import EditItem from "../Edit_Item/EditItem";
import "./Item_Table.css";
export default function ItemsTable({
  item,
  itemInChange,
  setItemInChange,
  myData,
  setItemIsUpdated,
}) {
  const [photoChanged, setPhotoChanged] = useState(false);
  const fileInput = useRef();
  const [changeStatus, setChangeStatus] = useState({
    editText: "עריכה",
    delete: "מחיקה",
    disabled: true,
    itemId: null,
  });
  const [itemsValues, setItemsValues] = useState({
    number: "",
    desc: "",
    category: "",
    weight: "",
    length: "",
    image: null,
  });
  useEffect(() => {
    const getData = async () => {
      const thisItem = myData?.find((t) => t._id === item._id);
      setItemsValues((prev) => {
        return {
          number: thisItem.number,
          desc: thisItem.desc,
          category: thisItem.category,
          weight: thisItem.weight,
          length: thisItem.length,
          image: thisItem.image,
        };
      });
    };
    getData();
  }, [item._id, myData]);
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
      backgroundColor: "rgb(48, 45, 45)",
      padding: "2.25% 0",
      border: "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "whitesmoke",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
      backgroundColor: "rgb(48, 45, 45)",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused ? "gold" : "rgb(48, 45, 45)",
      color: state.isFocused ? "rgb(48, 45, 45)" : "inherit",
    }),
    singleValue: (styles, state) => {
      return {
        ...styles,
        color: state.isSelected ? "red" : "whitesmoke",
      };
    },
  };
  return (
    <div>
      <form className="Item_form" key={`form${item.id}`}>
        <input
          type="file"
          name="name"
          id="image"
          style={{ display: "none" }}
          ref={fileInput}
          accept="image/png, image/jpeg"
          onInput={(e) => {
            e.preventDefault();
            setItemsValues((prev) => {
              return { ...prev, image: e.target.files[0] };
            });
            setPhotoChanged(true);
          }}
          disabled={changeStatus.disabled}
        />
        <div className="item_image">
          <img
            id="image"
            src={itemsValues.image}
            alt={`img${item.id}`}
            value={itemsValues.image}
            onClick={(e) => {
              e.preventDefault();
              fileInput.current.click();
            }}
          />
        </div>
        <input
          id="weight"
          className="input_show_item"
          style={{ padding: "1%", width: "10%" }}
          disabled={changeStatus.disabled}
          value={itemsValues.weight}
          onChange={(e) => {
            setItemsValues((prev) => {
              return { ...prev, weight: e.target.value };
            });
          }}
        ></input>
        <input
          id="length"
          className="input_show_item"
          style={{ padding: "1%", width: "10%" }}
          disabled={changeStatus.disabled}
          value={itemsValues.length}
          onChange={(e) => {
            setItemsValues((prev) => {
              return { ...prev, length: e.target.value };
            });
          }}
        ></input>
        <Select
          id="category"
          options={allCategoriesSelect}
          isDisabled={changeStatus.disabled}
          placeholder={itemsValues.category}
          className="input_show_item select-category"
          defaultValue={itemsValues.category}
          onChange={(e) =>
            setItemsValues((prev) => {
              return { ...prev, category: e.value };
            })
          }
          menuPlacement="auto"
          styles={customStyles}
          required
        ></Select>

        <input
          id="desc"
          className="input_show_item desc-style"
          style={{ padding: "1%" }}
          disabled={changeStatus.disabled}
          value={itemsValues.desc}
          onChange={(e) => {
            setItemsValues((prev) => {
              return { ...prev, desc: e.target.value };
            });
          }}
        ></input>
        <input
          id="number"
          className="input_show_item"
          style={{ padding: "1%", width: "10%" }}
          disabled={changeStatus.disabled}
          value={itemsValues.number}
          onChange={(e) => {
            setItemsValues((prev) => {
              return { ...prev, number: e.target.value };
            });
          }}
        ></input>
        <EditItem
          item={item}
          itemInChange={itemInChange}
          setItemInChange={setItemInChange}
          changeStatus={changeStatus}
          setChangeStatus={setChangeStatus}
          itemsValues={itemsValues}
          setItemIsUpdated={setItemIsUpdated}
          photoChanged={photoChanged}
          setPhotoChanged={setPhotoChanged}
        ></EditItem>
        <DeleteItem
          itemInChange={itemInChange}
          setItemInChange={setItemInChange}
          item={item}
          changeStatus={changeStatus}
          setChangeStatus={setChangeStatus}
          setItemsValues={setItemsValues}
          setItemIsUpdated={setItemIsUpdated}
          setPhotoChanged={setPhotoChanged}
        ></DeleteItem>
      </form>
    </div>
  );
}
