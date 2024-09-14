import React, { useState } from "react";
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
  selectData,
  report,
  companies,
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
    expenses: "",
    mail: "",
    bankProps: "",
    quantity: "",
    location: 0,
    equipment: "",
    colored: false,
    date: "",
    tax: false,
    taxNumber: "",
    paymentDate: "",
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
          expenses: thisItem.expenses ? thisItem.expenses : "",
          mail: thisItem.mail ? thisItem.mail : "",
          bankProps: thisItem.bankProps ? thisItem.bankProps : "",
          location: thisItem.location ? thisItem.location : "",
          quantity: thisItem.quantity ? thisItem.quantity : "",
          equipment: thisItem.equipment ? thisItem.equipment : "",
          colored: thisItem.colored ? thisItem.colored : false,
          date: thisItem.date ? thisItem.date : "",
          tax: thisItem.tax ? thisItem.tax : false,
          taxNumber: thisItem.taxNumber ? thisItem.taxNumber : "",
          paymentDate: thisItem.paymentDate ? thisItem.paymentDate : "",
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
    control: (base, state) => ({
      ...base,
      textAlign: "right",
      backgroundColor: "rgb(48, 45, 45)",
      border: "none",
      boxShadow: "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: report?.type !== undefined && "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      color:
        collReq === "/expenses" && itemsValues.colored
          ? "rgb(255, 71, 46)"
          : "whitesmoke",
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

    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
  };
  const allSelectData = selectData?.map((item) => {
    return { value: item._id, label: item.name };
  });

  const changeColorOfClientName = (e) => {
    setItemsValues((prev) => {
      return { ...prev, colored: !prev.colored };
    });
  };

  const getCompanyList = () => {
    return companies?.map((item) => {
      return { value: item._id, label: item.companyName };
    });
  };
  const getTasksFromCompanyList = () => {
    const companyNameObj = companies?.find(
      (company) => company.companyName === itemsValues?.clientName
    );

    return companyNameObj?.tasks?.map((item) => {
      return { value: item._id, label: item.taskName };
    });
  };
  return (
    <>
      <form
        className="Item_form"
        key={`form${item.id}`}
        style={{
          width:
            collReq === "/inventories" || collReq === "/providers"
              ? "60%"
              : "95%",
        }}
      >
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/salesToCompanies" ||
          collReq === "/workersExpenses" ||
          collReq === "/sales") && (
          <input
            id="date"
            type="date"
            className="input_show_item"
            style={{ width: report?.type ? "17%" : "11%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.date}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, date: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/workersExpenses" && (
          <input
            id="location"
            type="location"
            className="input_show_item"
            style={{ width: "23%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.location}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, location: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/salesToCompanies" && (
          <Select
            options={getCompanyList()}
            className="input_show_item select-product-head "
            placeholder={
              itemsValues?.clientName ? itemsValues.clientName : "בחר חברה"
            }
            isDisabled={changeStatus.disabled}
            styles={customStyles}
            menuPlacement="auto"
            required
            defaultValue={itemsValues.clientName}
            onChange={(e) => {
              const filteredItem = selectData.find(
                (item) => item._id === e.value
              );
              setItemsValues((prev) => {
                return {
                  ...prev,
                  clientName: e.label,
                  name: filteredItem?.name || "",
                };
              });
            }}
          ></Select>
        )}

        {(collReq === "/sales" ||
          collReq === "/workersExpenses" ||
          collReq === "/sleevesBids") && (
          <input
            id="clientName"
            className="input_show_item"
            style={{
              width: report?.type || collReq === "/sleevesBids" ? "23%" : "13%",
              color: itemsValues.colored ? "rgb(255, 71, 46)" : "whitesmoke",
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
        {collReq === "/workersExpenses" && (
          <input
            id="equipment"
            name="equipment"
            className="input_show_item"
            style={{ width: "15%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.equipment}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, equipment: e.target.value };
              });
            }}
          ></input>
        )}
        {(collReq === "/sales" ||
          collReq === "/expenses" ||
          collReq === "/salesToCompanies") && (
          <Select
            options={
              collReq === "/salesToCompanies"
                ? getTasksFromCompanyList()
                : allSelectData
            }
            className="input_show_item select-product-head "
            placeholder={itemsValues?.name ? itemsValues.name : "בחר מוצר"}
            isDisabled={changeStatus.disabled}
            styles={customStyles}
            menuPlacement="auto"
            required
            defaultValue={itemsValues.name}
            onChange={(e) => {
              const filteredItem = selectData.find(
                (item) => item._id === e.value
              );

              setItemsValues((prev) => {
                return {
                  ...prev,
                  name: e.label,
                  number:
                    collReq === "/expenses" || collReq === "/salesToCompanies"
                      ? prev.number
                      : filteredItem?.number,
                  sale:
                    +filteredItem?.number -
                    (+prev.discount * +filteredItem?.number) / 100,
                  totalAmount: !(collReq === "/salesToCompanies")
                    ? prev.number
                    : !(collReq === "/sales")
                    ? +prev.quantity
                      ? +filteredItem?.number * +prev.quantity
                      : collReq === "/inventories"
                      ? +filteredItem?.number
                      : prev.number
                    : (+filteredItem?.number -
                        (+filteredItem?.number * +prev.discount) / 100) *
                        +prev.quantity -
                      +prev.expenses,
                };
              });
            }}
          ></Select>
        )}
        {collReq !== "/sales" &&
          collReq !== "/workersExpenses" &&
          collReq !== "/salesToCompanies" &&
          collReq !== "/expenses" &&
          collReq !== "/sleevesBids" && (
            <input
              id="name"
              className="input_show_item"
              style={{
                width:
                  collReq === "/inventories" || collReq === "/providers"
                    ? "62%"
                    : collReq === "/sales" || collReq === "/contacts"
                    ? "18%"
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
          style={{
            width:
              collReq === "/sales" || collReq === "/workersExpenses"
                ? "5%"
                : collReq === "/contacts" || collReq === "/expenses"
                ? "8%"
                : "15%",
          }}
          onDoubleClick={changeColorOfClientName}
          disabled={changeStatus.disabled}
          value={
            collReq === "/contacts"
              ? "0" + itemsValues.number
              : itemsValues.number
          }
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
                    : +e.target.value
                  : (+e.target.value -
                      (+e.target.value * +prev.discount) / 100) *
                      +prev.quantity -
                    +prev.expenses,
              };
            });
          }}
        ></input>
        {collReq === "/sales" && (
          <input
            id="discount"
            className="input_show_item"
            style={{ width: "4%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.discount}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  discount: e.target.value,
                  sale: +prev.number - (+prev.number * +e.target.value) / 100,
                  totalAmount:
                    (+prev.number - (+prev.number * +e.target.value) / 100) *
                      +prev.quantity -
                    +prev.expenses,
                };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="sale"
            className="input_show_item"
            style={{ width: "4%" }}
            disabled
            value={(+itemsValues?.sale).toFixed(0)}
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
                          +e.target.value -
                        +prev.expenses
                      : e.target.value * prev.number,
                };
              });
            }}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="expenses"
            className="input_show_item"
            style={{ width: "5%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.expenses}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  expenses: e.target.value,
                  totalAmount:
                    (+prev.number - (+prev.number * +prev.discount) / 100) *
                      +prev.quantity -
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
            style={{ width: "25%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.bankProps}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, bankProps: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/expenses" && (
          <input
            id="taxNumber"
            className="input_show_item"
            style={{ width: "10%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.taxNumber}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, taxNumber: e.target.value };
              });
            }}
          ></input>
        )}

        {(collReq === "/sleevesBids" ||
          collReq === "/sales" ||
          collReq === "/expenses" ||
          collReq === "/workersExpenses") && (
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
            id="date"
            type="date"
            className="input_show_item"
            style={{ width: report?.type ? "15%" : "13%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.paymentDate}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, paymentDate: e.target.value };
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
              width: collReq === "/expenses" ? "10%" : "6%",
            }}
            disabled
            value={
              +itemsValues?.totalAmount == ""
                ? 0
                : +itemsValues?.totalAmount?.toFixed(2)
            }
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
    </>
  );
}
