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
  inventories,
  report,
}) {
  const [changeStatus, setChangeStatus] = useState({
    editText: "עריכה",
    delete: "מחיקה",
    disabled: true,
    itemId: null,
  });
  const [itemsValues, setItemsValues] = useState({
    name: "",
    clientName: "",
    number: "",
    discount: "",
    sale: "",
    setupPrice: "",
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
          name: thisItem.name ? thisItem.name : "",
          clientName: thisItem.clientName ? thisItem.clientName : "",
          number: thisItem.number ? thisItem.number : "",
          discount: thisItem.discount ? thisItem.discount : "",
          sale: thisItem.sale ? thisItem.sale : "",
          setupPrice: thisItem.setupPrice ? thisItem.setupPrice : "",
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
      textAlign: "right",
      backgroundColor: "rgb(48, 45, 45)",
      border: "none",
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
  const allInventories = inventories?.map((item) => {
    return { value: item._id, label: item.name };
  });
  return (
    <div>
      <form className="Item_form" key={`form${item.id}`}>
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/sales") && (
          <input
            id="date"
            type="date"
            className="input_show_item"
            style={{ width: collReq === "/sales" ? "10%" : "13%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.date}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, date: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="clientName"
            className="input_show_item"
            style={{
              width: report?.type ? "25%" : "12%",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.clientName}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, clientName: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" && (
          <Select
            options={allInventories}
            className="input_show_item select-product-head "
            placeholder={itemsValues?.name ? itemsValues.name : "בחר מוצר"}
            isDisabled={changeStatus.disabled}
            styles={customStyles}
            menuPlacement="auto"
            required
            defaultValue={itemsValues.name}
            onChange={(e) => {
              const filteredItem = inventories.filter(
                (item) => item._id === e.value
              )[0];
              setItemsValues((prev) => {
                return {
                  ...prev,
                  name: e.label,
                  number: filteredItem.number,
                  sale:
                    +filteredItem.number -
                    (+prev.discount * +filteredItem.number) / 100,
                  totalAmount: !(collReq === "/sales")
                    ? +prev.quantity
                      ? +filteredItem.number * +prev.quantity
                      : +filteredItem.number +
                        +(+filteredItem.number * +prev.taxPercent) / 100
                    : (+filteredItem.number -
                        (+filteredItem.number * +prev.discount) / 100) *
                        +prev.quantity +
                      +prev.setupPrice,
                };
              });
            }}
          ></Select>
        )}
        {collReq !== "/sales" && (
          <input
            id="name"
            className="input_show_item"
            style={{
              width:
                collReq === "/inventories" || collReq === "/providers"
                  ? "62%"
                  : collReq === "/sales"
                  ? "15%"
                  : report?.type
                  ? "45%"
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
        )}
        <input
          id="number"
          className="input_show_item"
          style={{ width: collReq === "/sales" ? "7%" : "15%" }}
          disabled={changeStatus.disabled}
          value={itemsValues.number}
          onChange={(e) => {
            setItemsValues((prev) => {
              return {
                ...prev,
                number: e.target.value,
                sale:
                  +e.target.value - (+prev.discount * +e.target.value) / 100,
                totalAmount: !(collReq === "/sales")
                  ? +prev.quantity
                    ? +e.target.value * +prev.quantity
                    : +e.target.value +
                      +(+e.target.value * +prev.taxPercent) / 100
                  : (+e.target.value -
                      (+e.target.value * +prev.discount) / 100) *
                      +prev.quantity +
                    +prev.setupPrice,
              };
            });
          }}
        ></input>
        {collReq === "/sales" && (
          <input
            id="discount"
            className="input_show_item"
            style={{ width: "7%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.discount}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  discount: +e.target.value,
                  sale: +prev.number - (+prev.number * +e.target.value) / 100,
                  totalAmount:
                    (+prev.number - (+prev.number * +e.target.value) / 100) *
                      +prev.quantity +
                    +prev.setupPrice,
                };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="sale"
            className="input_show_item"
            style={{ width: "7%" }}
            disabled
            defaultValue={itemsValues.sale}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="setupPrice"
            className="input_show_item"
            style={{ width: "5%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.setupPrice}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  setupPrice: e.target.value,
                  totalAmount:
                    (+prev.number - (+prev.number * +prev.discount) / 100) *
                      +prev.quantity +
                    +e.target.value,
                };
              });
            }}
          ></input>
        )}
        {collReq === "/contacts" && (
          <input
            id="mail"
            className="input_show_item"
            style={{
              width: "20%",
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
        {collReq === "/contacts" && (
          <input
            id="bankProps"
            className="input_show_item"
            style={{ width: "17%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.bankProps}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, bankProps: e.target.value };
              });
            }}
          ></input>
        )}
        {(collReq === "/sleevesBids" || collReq === "/sales") && (
          <input
            id="quantity"
            className="input_show_item"
            style={{ width: collReq === "/sales" ? "5%" : "7%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.quantity}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  quantity: e.target.value,
                  totalAmount:
                    collReq === "/sales"
                      ? (+prev.number - (+prev.number * +prev.discount) / 100) *
                          +e.target.value +
                        +prev.setupPrice
                      : e.target.value * prev.number,
                };
              });
            }}
          ></input>
        )}
        {(collReq === "/sleevesBids" || collReq === "/sales") && (
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
            style={{ width: "7%" }}
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
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/sales") && (
          <input
            id="totalAmount"
            className="input_show_item"
            style={{
              width:
                collReq === "/expenses"
                  ? "17%"
                  : collReq === "/sales"
                  ? "7%"
                  : "6%",
            }}
            disabled
            value={+itemsValues.totalAmount.toFixed(2)}
          ></input>
        )}
        {!report?.type && (
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
        )}
        {!report?.type && (
          <DeleteItem
            itemInChange={itemInChange}
            setItemInChange={setItemInChange}
            item={item}
            changeStatus={changeStatus}
            setChangeStatus={setChangeStatus}
            setItemsValues={setItemsValues}
            setItemIsUpdated={setItemIsUpdated}
            collReq={collReq}
          ></DeleteItem>
        )}
      </form>
    </div>
  );
}
