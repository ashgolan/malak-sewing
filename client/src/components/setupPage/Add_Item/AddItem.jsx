import React, { useContext, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Api } from "../../../utils/Api";
import { FetchingStatus } from "../../../utils/context";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import "./Add_item.css";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import Select from "react-select";
export default function AddItem({
  setaddItemToggle,
  setItemIsUpdated,
  collReq,
  inventories,
  selectData,
}) {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const navigate = useNavigate();
  const productFormData = useRef();
  // eslint-disable-next-line
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemsValues, setItemsValues] = useState({
    number: "",
    name: "",
    mail: "",
    bankProps: "",
    quantity: "",
    clientName: "",
    discount: 0,
    expenses: "",
    location: "",
    equipment: "",
    tax: "",
    sale: "",
    paymentDate: year + "-" + month + "-" + day,
    date: year + "-" + month + "-" + day,
    totalAmount: 0,
  });
  const sendPostRequest = async (token) => {
    const headers = {
      Authorization: token,
    };
    setFetchingStatus({ loading: true, error: false });
    switch (collReq) {
      case "/sleevesBids":
        await Api.post(
          collReq,
          {
            name: itemsValues.name,
            clientName: itemsValues.clientName,
            number: itemsValues.number,
            date: itemsValues.date,
            tax: itemsValues.tax,
            sale: itemsValues.tax,
            discount: itemsValues.discount,
            expenses: itemsValues.expenses,
            quantity: itemsValues.quantity,
            totalAmount: itemsValues.totalAmount,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/workersExpenses":
        await Api.post(
          collReq,
          {
            date: itemsValues.date,
            location: itemsValues.location,
            clientName: itemsValues.clientName,
            equipment: itemsValues.equipment,
            number: itemsValues.number,
            tax: itemsValues.tax,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/expenses":
        await Api.post(
          collReq,
          {
            name: itemsValues.name,
            number: itemsValues.number,
            discount: itemsValues.discount,
            date: itemsValues.date,
            paymentDate: itemsValues.paymentDate,
            totalAmount: itemsValues.totalAmount,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/sales":
        await Api.post(
          collReq,
          {
            date: itemsValues.date,
            clientName: itemsValues.clientName,
            name: itemsValues.name,
            number: itemsValues.number,
            discount: itemsValues.discount,
            sale: itemsValues.sale,
            expenses: itemsValues.expenses,
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
        await Api.post(
          collReq,
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
      default:
        await Api.post(
          collReq,
          { name: itemsValues.name, number: itemsValues.number },
          {
            headers: headers,
          }
        );
    }

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
      border: "none",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
  };
  const allSelectData = selectData?.map((item) => {
    return { value: item._id, label: item.name };
  });
  return (
    <form
      ref={productFormData}
      onSubmit={confirmAddingItem}
      className="addItem_form"
      style={{ width: collReq === "/sales" && "95%" }}
    >
      <div className="add-row">
        {(collReq === "/sleevesBids" ||
          collReq === "/expenses" ||
          collReq === "/workersExpenses" ||
          collReq === "/sales") && (
          <input
            name="date"
            type="date"
            id="date"
            style={{ width: collReq === "/sales" ? "11%" : "25%" }}
            required
            className="add_item"
            placeholder="בחר תאריך"
            value={itemsValues.date}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, date: e.target.value };
              })
            }
          ></input>
        )}
        {collReq === "/workersExpenses" && (
          <input
            name="location"
            id="location"
            required
            autoFocus={true}
            className="add_item"
            style={{ width: "15%" }}
            placeholder={"מיקום"}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, location: e.target.value };
              })
            }
            value={itemsValues.location}
          ></input>
        )}
        {(collReq === "/sales" || collReq === "/workersExpenses") && (
          <input
            name="clientName"
            id="clientName"
            required
            autoFocus={true}
            className="add_item"
            style={{ width: "15%" }}
            placeholder={collReq === "/workersExpenses" ? "עובד" : "קליינט"}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, clientName: e.target.value };
              })
            }
            value={itemsValues.clientName}
          ></input>
        )}
        {collReq === "/workersExpenses" && (
          <input
            name="equipment"
            id="equipment"
            required
            autoFocus={true}
            className="add_item"
            style={{ width: "15%" }}
            placeholder={"ציוד"}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, equipment: e.target.value };
              })
            }
            value={itemsValues.equipment}
          ></input>
        )}
        {(collReq === "/sales" || collReq === "/expenses") && (
          <Select
            options={allSelectData}
            className="add_item select-product "
            placeholder="בחר מוצר"
            styles={customStyles}
            menuPlacement="auto"
            required
            onChange={(e) => {
              const filteredItem = selectData.filter(
                (item) => item._id === e.value
              )[0];
              setItemsValues((prev) => {
                return {
                  ...prev,
                  name: e.label,
                  number:
                    collReq === "/sales" ? filteredItem.number : prev.number,
                };
              });
            }}
          ></Select>
        )}
        {collReq !== "/sales" &&
          collReq !== "/workersExpenses" &&
          collReq !== "/expenses" && (
            <input
              name="name"
              id="name"
              required
              autoFocus={true}
              className="add_item"
              style={{ width: "35%" }}
              placeholder={
                collReq === "/inventories" ||
                collReq === "/expenses" ||
                collReq === "/sales"
                  ? "מוצר"
                  : "שם"
              }
              onChange={(e) =>
                setItemsValues((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              value={itemsValues.name}
            ></input>
          )}
        <input
          name="number"
          id="number"
          type="number"
          min={0}
          style={{
            width: collReq === "/sales" ? "10%" : "15%",
          }}
          required
          className="add_item"
          placeholder={
            collReq === "/contacts" || collReq === "/providers"
              ? "מספר"
              : collReq === "/workersExpenses"
              ? "סכום"
              : "מחיר"
          }
          onChange={(e) =>
            setItemsValues((prev) => {
              return {
                ...prev,
                number: +e.target.value,
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
            })
          }
          value={itemsValues.number}
        ></input>
        {collReq === "/sales" && (
          <input
            name="discount"
            id="discount"
            type="number"
            min={0}
            style={{ width: "7%" }}
            required
            className="add_item"
            placeholder={itemsValues.discount === 0 && "הנחה"}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  discount: +e.target.value,
                  sale: +prev.number - (+prev.number * +e.target.value) / 100,
                  totalAmount:
                    (+prev.number - (+prev.number * +e.target.value) / 100) *
                      +prev.quantity -
                    +prev.expenses,
                };
              });
            }}
            value={itemsValues.discount}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            name="sale"
            id="sale"
            style={{ width: "7%" }}
            required
            className="add_item"
            placeholder={"נטו"}
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  discount: +e.target.value,
                  sale: +prev.number - (+prev.number * +e.target.value) / 100,
                  totalAmount:
                    (+prev.number - (+prev.number * +e.target.value) / 100) *
                      +prev.quantity -
                    +prev.expenses,
                };
              });
            }}
            disabled
            value={+itemsValues.sale}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            name="expenses"
            id="expenses"
            style={{ width: "7%" }}
            required
            type="number"
            min={0}
            className="add_item"
            placeholder={"הוצאות"}
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
            value={itemsValues.expenses}
          ></input>
        )}
        {collReq === "/contacts" && (
          <input
            name="mail"
            id="mail"
            type="email"
            style={{ width: "25%" }}
            required
            className="add_item"
            placeholder="דואר אלקטרוני"
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, mail: e.target.value };
              })
            }
            value={itemsValues.mail}
          ></input>
        )}
        {collReq === "/contacts" && (
          <input
            name="bankProps"
            id="bankProps"
            style={{ width: "25%" }}
            required
            className="add_item"
            placeholder="פרטי בנק"
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, bankProps: e.target.value };
              })
            }
            value={itemsValues.bankProps}
          ></input>
        )}
        {(collReq === "/sleevesBids" || collReq === "/sales") && (
          <input
            name="quantity"
            id="quantity"
            type="number"
            min={0}
            style={{ width: collReq === "/sales" ? "5%" : "10%" }}
            required
            className="add_item"
            placeholder="כמות"
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
            value={itemsValues.quantity}
          ></input>
        )}
        {(collReq === "/sleevesBids" ||
          collReq === "/sales" ||
          collReq === "/workersExpenses") && (
          <Select
            id="tax"
            options={allTaxSelect}
            className="add_item select-category"
            placeholder="חשבונית"
            defaultValue={itemsValues.tax}
            onChange={(e) => {
              setItemsValues((prev) => {
                return { ...prev, tax: e.value };
              });
            }}
            styles={customStyles}
            menuPlacement="auto"
            required
          />
        )}
        {collReq === "/expenses" && (
          <input
            name="paymentDate"
            type="date"
            id="paymentDate"
            style={{ width: collReq === "/sales" ? "11%" : "25%" }}
            required
            className="add_item"
            placeholder="בחר תאריך"
            value={itemsValues.paymentDate}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, paymentDate: e.target.value };
              })
            }
          ></input>
        )}{" "}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          marginTop: "1%",
        }}
      >
        <input className="confirm_addItem" type="submit" value="אישור"></input>
        <button className="remove_addItem" onClick={cancelAddingItem}>
          ביטול
        </button>
      </div>
    </form>
  );
}
