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
  taxValues,
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
    checkNumber: 0,
    bankNumber: 0,
    branchNumber: 0,
    accountNumber: 0,
    containersNumbers: "",
    kindOfWork: "",
    sending: "",
    remark: "",
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
    afterTax: "",
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
          remark: thisItem.remark ? thisItem.remark : "-",
          number: thisItem.number ? thisItem.number : "",
          checkNumber: thisItem.checkNumber ? thisItem.checkNumber : "",
          bankNumber: thisItem.bankNumber ? thisItem.bankNumber : "",
          branchNumber: thisItem.branchNumber ? thisItem.branchNumber : "",
          accountNumber: thisItem.accountNumber ? thisItem.accountNumber : "",
          containersNumbers: thisItem.containersNumbers
            ? thisItem.containersNumbers
            : "",
          kindOfWork: thisItem.kindOfWork ? thisItem.kindOfWork : "",
          sending: thisItem.sending ? thisItem.sending : "",
          discount: thisItem.discount ? thisItem.discount : "",
          sale: thisItem.sale ? thisItem.sale : "",
          afterTax: thisItem.afterTax ? thisItem.afterTax : "",
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
  const globalCustomStyles = {
    control: (base, state) => ({
      ...base,
      textAlign: "right",
      border: "none",
      backgroundColor: "white",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxHeight: changeStatus.disabled && "40px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      // display: report?.type !== undefined && "none",
      display: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px", // Adjust padding as needed
      background: state.isFocused ? "gold" : "rgb#ffd900",
      color: state.isFocused ? "rgb(48, 45, 45)" : "inherit",
    }),
    singleValue: (provided, styles, state) => ({
      ...provided,
      ...styles,
      color: state?.isSelected ? "red" : "black",

      margin: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: itemsValues.colored ? "rgb(255, 71, 46)" : "black",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
  };

  // const globalCustomStyles = {
  //   control: (base, state) => ({
  //     ...base,
  //     textAlign: "right",
  //     backgroundColor: "rgb(48, 45, 45)",
  //     border: "none",
  //     boxShadow: "none",
  //     whiteSpace: "nowrap",
  //     overflow: "hidden",
  //     textOverflow: "ellipsis",
  //   }),
  //   dropdownIndicator: (base) => ({
  //     ...base,
  //     display: report?.type !== undefined && "none",
  //   }),
  //   placeholder: (provided) => ({
  //     ...provided,
  //     color:
  //       (collReq === "/expenses" || collReq === "/salesToCompanies") && itemsValues.colored
  //         ? "rgb(255, 71, 46)"
  //         : "whitesmoke",
  //   }),
  //   menu: (base) => ({
  //     ...base,
  //     textAlign: "center",
  //     backgroundColor: "rgb(48, 45, 45)",
  //   }),
  //   option: (provided, state) => ({
  //     ...provided,
  //     background: state.isFocused ? "gold" : "rgb(48, 45, 45)",
  //     color: state.isFocused ? "rgb(48, 45, 45)" : "inherit",
  //   }),
  //   singleValue: (styles, state) => {
  //     return {
  //       ...styles,
  //       color: state.isSelected ? "red" : "whitesmoke",
  //     };
  //   },

  //   indicatorSeparator: (provided) => ({
  //     ...provided,
  //     display: "none",
  //   }),
  // };
  // const salesToCompaniesStyles = {

  //   ...globalCustomStyles,
  //   placeholder: (provided) => ({
  //     ...provided,
  //     color: "whitesmoke", // Set the color to whitesmoke
  //   }),

  // }
  const specificCustomStyles = {
    ...globalCustomStyles,
    dropdownIndicator: (provided) => ({
      ...provided,
      display: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "whitesmoke", // Set the color to whitesmoke
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
    return companies
      ?.filter((item) => !item.isInstitution)
      .map((item) => ({ value: item._id, label: item.name }));
  };
  const getInstitutionsList = () => {
    return companies
      ?.filter((item) => item.isInstitution)
      .map((item) => ({ value: item._id, label: item.name }));
  };
  const getTasksFromCompanyList = () => {
    const companyNameObj = companies?.find(
      (company) => company.name === itemsValues?.clientName
    );

    return companyNameObj?.tasks?.map((item) => {
      return { value: item._id, label: item.description };
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
              ? "80%"
              : "95%",
        }}
      >
        <input
          id="colored"
          className=itemsValues={?.colored ? "inner " : ""}
          disabled={changeStatus.disabled}
          onDoubleClick={changeColorOfClientName}
        />

        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/salesToCompanies" ||
          collReq === "/bouncedChecks" ||
          collReq === "/institutionTax" ||
          collReq === "/workersExpenses" ||
          collReq === "/sales") && (
          <input
            id="date"
            type="date"
            className="input_show_item"
            style={{ width: report?.type ? "14%" : "10%" }}
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
        {(collReq === "/institutionTax" || collReq === "/salesToCompanies") &&
          report?.type !== "/salesToCompanies" && (
            <Select
              options={
                collReq === "/institutionTax"
                  ? getInstitutionsList()
                  : getCompanyList()
              }
              className="input_show_item select-product-head"
              placeholder={
                itemsValues?.clientName ? itemsValues.clientName : "בחר חברה"
              }
              isDisabled={changeStatus.disabled}
              styles={globalCustomStyles}
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
          collReq === "/bouncedChecks" ||
          collReq === "/sleevesBids") && (
          <input
            id="clientName"
            className="input_show_item"
            style={{
              width:
                report?.type || collReq === "/sleevesBids"
                  ? "23%"
                  : collReq === "/bouncedChecks"
                  ? "10%"
                  : "15%",
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

        {collReq === "/bouncedChecks" && (
          <input
            id="checkNumber"
            className="input_show_item"
            style={{
              width: report?.type ? "10%" : "7%",
              color: itemsValues.colored ? "rgb(255, 71, 46)" : "whitesmoke",
              textAlign: "center",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.checkNumber}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, checkNumber: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/bouncedChecks" && (
          <input
            id="bankNumber"
            className="input_show_item"
            style={{
              width: report?.type ? "10%" : "7%",
              textAlign: "center",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.bankNumber}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, bankNumber: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/bouncedChecks" && (
          <input
            id="branchNumber"
            className="input_show_item"
            style={{
              width: report?.type ? "10%" : "5%",
              textAlign: "center",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.branchNumber}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, branchNumber: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/bouncedChecks" && (
          <input
            id="accountNumber"
            className="input_show_item"
            style={{
              width: report?.type ? "10%" : "7%",
              textAlign: "center",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.accountNumber}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, accountNumber: e.target.value };
              });
            }}
          ></input>
        )}
        {(collReq === "/sales" || collReq === "/bouncedChecks") && (
          <input
            id="remark"
            className="input_show_item"
            style={{
              width: report?.type ? "10%" : "6%",
              textAlign: "center",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.remark}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, remark: e.target.value };
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
                : collReq === "/institutionTax"
                ? getInstitutionsList()
                : allSelectData
            }
            className="input_show_item select-product-head-salesToCompanies-work "
            placeholder={itemsValues?.name ? itemsValues.name : "עבודה מוצר"}
            isDisabled={changeStatus.disabled}
            styles={globalCustomStyles}
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
                  containersNumbers:
                    e?.label === "משלוח" ? "-" : prev.containersNumbers,
                  kindOfWork: e?.label === "משלוח" ? "-" : prev.kindOfWork,
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
          collReq !== "/bouncedChecks" &&
          collReq !== "/expenses" &&
          collReq !== "/sleevesBids" && (
            <input
              id="name"
              className="input_show_item"
              style={{
                maxWidth:
                  collReq === "/inventories" || collReq === "/providers"
                    ? "62%"
                    : "15%",
                minWidth:
                  collReq === "/inventories" || collReq === "/providers"
                    ? "62%"
                    : "15%",
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
        {collReq === "/salesToCompanies" && (
          <input
            id="containersNumbers"
            className="input_show_item"
            style={{
              width: report?.type ? "15%" : "10%",
              textAlign: "center",
            }}
            disabled={changeStatus.disabled}
            value={itemsValues.containersNumbers}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, containersNumbers: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/salesToCompanies" && (
          <Select
            options={[
              { value: "tur", label: "טורקית" },
              { value: "hud", label: "הודית" },
              { value: "null", label: "-" },
            ]}
            className="input_show_item select-product-head-salesToCompanies "
            placeholder={
              itemsValues?.kindOfWork ? itemsValues.kindOfWork : "סוג הובלה"
            }
            isDisabled={changeStatus.disabled}
            styles={globalCustomStyles}
            menuPlacement="auto"
            required
            defaultValue={itemsValues.kindOfWork}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  kindOfWork: e.label,
                };
              });
            }}
          ></Select>
        )}
        {collReq === "/salesToCompanies" && (
          <Select
            options={[
              { value: "01", label: "צפון" },
              { value: "02", label: "מרכז" },
              { value: "03", label: "דרום" },
              { value: "04", label: "-" },
            ]}
            className="input_show_item select-product-head-salesToCompanies"
            placeholder={itemsValues?.sending ? itemsValues.sending : "משלוח"}
            isDisabled={changeStatus.disabled}
            styles={globalCustomStyles}
            menuPlacement="auto"
            required
            defaultValue={itemsValues.sending}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  sending: e.label,
                };
              });
            }}
          ></Select>
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
                : collReq === "/institutionTax" || collReq === "/bouncedChecks"
                ? "5%"
                : collReq === "/salesToCompanies"
                ? "6%"
                : "15%",
          }}
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
                afterTax: (+e.target.value * +taxValues?.maamValue) / 100,
                sale:
                  +e.target.value - (+prev.discount * +e.target.value) / 100,
                totalAmount:
                  collReq === "/salesToCompanies"
                    ? +e.target.value +
                      +e.target.value * (taxValues?.maamValue / 100)
                    : collReq === "/institutionTax"
                    ? +e.target.value -
                      +e.target.value * (+taxValues?.masValue / 100)
                    : !(collReq === "/sales")
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
        {(collReq === "/expenses" ||
          collReq === "/institutionTax" ||
          collReq === "/bouncedChecks") && (
          <input
            id="taxNumber"
            className="input_show_item"
            style={{ width: collReq === "/bouncedChecks" ? "6%" : "7%" }}
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
            styles={specificCustomStyles}
            required
          />
        )}
        {(collReq === "/expenses" ||
          collReq === "/institutionTax" ||
          collReq === "/bouncedChecks") && (
          <input
            id="paymentDate"
            type="date"
            className="input_show_item"
            style={{ width: report?.type ? "12%" : "10%" }}
            disabled={changeStatus.disabled}
            value={itemsValues.paymentDate}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, paymentDate: e.target.value };
              });
            }}
          ></input>
        )}
        {collReq === "/institutionTax" && (
          <input
            id="withholdingTax"
            className="input_show_item"
            style={{ width: "8%" }}
            disabled
            value={+itemsValues?.number * (+taxValues?.masValue / 100)}
          />
        )}
        {collReq === "/salesToCompanies" && (
          <input
            id="afterTax"
            className="input_show_item"
            style={{ width: "8%" }}
            disabled
            value={+itemsValues?.afterTax}
          />
        )}
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/institutionTax" ||
          collReq === "/salesToCompanies" ||
          collReq === "/bouncedChecks" ||
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
