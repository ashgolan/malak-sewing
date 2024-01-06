import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import DeleteItem from "../Delete_Item/DeleteItem";
import EditItem from "../Edit_Item/EditItem";
import "./Item_Table.css";
import Select from "react-select";

export default function ItemsTable({
  item,
  itemInChange,
  setItemInChange,
  myData,
  setItemIsUpdated,
  collReq,
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
    name: "",
    number: "",
    mail: "",
    bankProps: "",
    quantity: 0,
    date: "",
    tax: false,
    taxPercent: 0,
    totalAmount: 0,
  });
  useEffect(() => {
    const getData = async () => {
      const thisItem = myData?.find((t) => t._id === item._id);
      setItemsValues((prev) => {
        return {
          name: thisItem.name,
          number: thisItem.number,
          mail: thisItem.mail ? thisItem.mail : "",
          bankProps: thisItem.bankProps ? thisItem.bankProps : "",
          quantity: thisItem.quantity ? thisItem.quantity : "",
          date: thisItem.date ? thisItem.date : "",
          tax: thisItem.tax ? thisItem.tax : false,
          taxPercent: thisItem.taxPercent ? thisItem.taxPercent : 0.17,
          totalAmount: thisItem.totalAmount ? thisItem.totalAmount : "",
        };
      });
    };
    getData();
  }, [item._id, myData]);

  const allTaxSelect = [
    { value: true, label: "כן" },
    { value: false, label: "לא" },
  ].map((item) => {
    return { value: item.value, label: item.label };
  });
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
      backgroundColor: "rgb(48, 45, 45)",
      border: "none",
      // whiteSpace: "nowrap",
      // overflow: "hidden",
      // textOverflow: "ellipsis",
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
        {(collReq === "/sleevesBids" || collReq === "/expenses") && (
          <input
            id="date"
            type="date"
            className="input_show_item"
            style={{ width: "13%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.date}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, date: e.target.value };
              });
            }}
          ></input>
        )}
        <input
          id="name"
          className="input_show_item"
          style={{
            width:
              collReq === "/inventory" || collReq === "/provider"
                ? "63%"
                : "25%",
          }}
          disabled={changeStatus.disabled}
          value={itemsValues.name}
          onChange={(e) => {
            setItemsValues((prev) => {
              return { ...prev, name: e.target.value };
            });
          }}
        ></input>
        <input
          id="number"
          className="input_show_item"
          style={{ width: "15%" }}
          disabled={changeStatus.disabled}
          value={itemsValues.number}
          onChange={(e) => {
            setItemsValues((prev) => {
              return {
                ...prev,
                number: e.target.value,
                totalAmount: prev.quantity
                  ? e.target.value * prev.quantity
                  : +e.target.value + +(e.target.value * prev.taxPercent) / 100,
              };
            });
          }}
        ></input>
        {collReq === "/contact" && (
          <input
            id="mail"
            className="input_show_item"
            style={{
              width:
                collReq === "/inventory" || collReq === "/provider"
                  ? "15%"
                  : "23.5%",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.mail}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, mail: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/contact" && (
          <input
            id="bankProps"
            className="input_show_item"
            style={{ width: "15%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.bankProps}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, bankProps: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/sleevesBids" && (
          <input
            id="quantity"
            className="input_show_item"
            style={{ width: "7%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.quantity}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  quantity: e.target.value,
                  totalAmount: e.target.value * prev.number,
                };
              });
            }}
          ></input>
        )}
        {collReq === "/sleevesBids" && (
          <Select
            id="tax"
            options={allTaxSelect}
            className="input_show_item select-category"
            isDisabled={changeStatus.disabled}
            placeholder={itemsValues?.tax === true ? "כן" : "לא"}
            defaultValue={itemsValues.tax}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, tax: e.value };
              });
            }}
            menuPlacement="auto"
            styles={customStyles}
            required
          />
        )}
        {collReq === "/expenses" && (
          <input
            id="taxPercent"
            className="input_show_item"
            style={{ width: "15%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.taxPercent}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  taxPercent: e.target.value,
                  totalAmount:
                    +prev.number + +(+e.target.value / 100) * prev.number,
                };
              });
            }}
          ></input>
        )}
        {(collReq === "/sleevesBids" || collReq === "/expenses") && (
          <input
            id="totalAmount"
            className="input_show_item"
            style={{ width: "9%" }}
            disabled
            value={itemsValues.totalAmount.toFixed(2)}
          ></input>
        )}

        <EditItem
          item={item}
          itemInChange={itemInChange}
          setItemInChange={setItemInChange}
          changeStatus={changeStatus}
          setChangeStatus={setChangeStatus}
          itemsValues={itemsValues}
          setItemIsUpdated={setItemIsUpdated}
          collReq={collReq}
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
          collReq={collReq}
        ></DeleteItem>
      </form>
    </div>
  );
}
