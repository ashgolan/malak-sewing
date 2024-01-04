import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import DeleteItem from "../Delete_Item/DeleteItem";
import EditItem from "../Edit_Item/EditItem";
import "./Item_Table.css";
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
        };
      });
    };
    getData();
  }, [item._id, myData]);

  return (
    <div>
      <form className="Item_form" key={`form${item.id}`}>
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
              return { ...prev, number: e.target.value };
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
