import React, { useState } from "react";
import { useRef } from "react";
import Select from "react-select";
import "./BidRow.css";
export default function BidRow({ numOfRow, myData, itemInBid, setBid, bid }) {
  const [itemChanged, setItemChanged] = useState(false);
  const bidForm = useRef();
  const [itemInRow, setItemInRow] = useState({
    id: numOfRow,
    _id: itemInBid && !itemChanged ? itemInBid._id : "",
    name: itemInBid && !itemChanged ? itemInBid.name : null,
    quantity: itemInBid && !itemChanged ? itemInBid.quantity : "",
    number: itemInBid && !itemChanged ? itemInBid.number : "",
    totalAmount: itemInBid && !itemChanged ? itemInBid.totalAmount : 0,
    checked: itemInBid && !itemChanged ? itemInBid.checked : false,
  });
  const allItems = myData?.map((item, index) => {
    return { value: item._id, label: item.name };
  });
  const uncheckItem = () => {
    const myFilteredData = bid?.data?.map((item) => {
      if (item.id === numOfRow) {
        item.checked = false;
        item.totalAmount = 0;
      }
      return item;
    });
    const sum = myFilteredData.reduce((accumulator, object) => {
      return +accumulator + +object.totalAmount;
    }, 0);
    setBid((prev) => {
      return {
        ...prev,
        totalAmount: +sum,
        data: myFilteredData.sort((s1, s2) => {
          return s1.name - s2.name;
        }),
      };
    });
  };
  const setBySelectedValue = (e) => {
    const foundItem = myData.find((item) => {
      return item.name === e.label;
    });
    setItemChanged(true);
    if (e.target?.name === "quantity") {
      if (!itemInRow.name) return;
      setItemInRow((prev) => {
        return {
          ...prev,
          totalAmount: prev.number
            ? (prev.number * e.target.value).toFixed(2)
            : e.target.value,
          quantity: e.target.value,
          checked: false,
        };
      });
    } else if (e.target?.name === "number") {
      if (!itemInRow.name) return;
      setItemInRow((prev) => {
        return {
          ...prev,
          number: e.target.value,
          totalAmount: prev.quantity
            ? (prev.quantity * e.target.value).toFixed(2)
            : e.target.value,
          checked: false,
        };
      });
    } else {
      setItemInRow((prev) => {
        return {
          ...prev,
          _id: foundItem && foundItem._id,
          number: foundItem && foundItem.number,
          name: foundItem && foundItem.name,
          quantity: foundItem && "",
          totalAmount: foundItem && 0,
          checked: false,
        };
      });
    }
    uncheckItem();
  };
  const checkHandler = (e) => {
    const isFilled = validation();

    if (isFilled && !itemInBid) {
      e.target.checked
        ? setBid((prev) => {
            const sum = [...prev.data, { ...itemInRow, checked: true }].reduce(
              (accumulator, object) => {
                return +accumulator + +object.totalAmount;
              },
              0
            );

            return {
              ...prev,
              totalAmount: sum,
              data: [...prev.data, { ...itemInRow, checked: true }].sort(
                (s1, s2) => {
                  return s1.name - s2.name;
                }
              ),
            };
          })
        : setBid((prev) => {
            const myFilteredData = bid?.data?.filter(
              (item) => item.id !== numOfRow
            );
            const sum = myFilteredData.reduce((accumulator, object) => {
              return +accumulator + +object.totalAmount;
            }, 0);
            return {
              ...prev,
              totalAmount: sum,
              data: myFilteredData.sort((s1, s2) => {
                return s1.name - s2.name;
              }),
            };
          });
    } else if (isFilled && itemInBid) {
      e.target.checked
        ? setBid((prev) => {
            const sum = [...prev.data, { ...itemInRow, checked: true }].reduce(
              (accumulator, object) => {
                return +accumulator + +object.totalAmount;
              },
              0
            );
            return {
              ...prev,
              totalAmount: sum,
              data: [
                ...prev.data,
                {
                  ...itemInRow,
                  checked: true,
                },
              ].sort((s1, s2) => {
                return s1.name - s2.name;
              }),
            };
          })
        : uncheckItem();
    } else {
      e.target.checked = false;
    }
  };

  const validation = () => {
    const form = new FormData(bidForm.current);
    const data = Object.fromEntries(form);
    const vals = Object.values(data);
    for (let prop in vals) {
      if (vals[prop] === "") return false;
    }
    return true;
  };
  const customStyles = {
    control: (base) => ({
      ...base,
      color: "black",
      textAlign: "right",
      padding: "1% 0",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
  };

  return (
    <form ref={bidForm} className="row">
      <input disabled className="row_number" value={numOfRow + 1} />
      <Select
        options={allItems}
        isDisabled={bid.isApproved}
        placeholder={!itemInBid ? `בחר מוצר` : itemInBid.name}
        className="select-item"
        defaultValue={!bid.isApproved ? itemInRow.name : ""}
        onChange={(e) => {
          setBySelectedValue(e);
        }}
        menuPlacement="auto"
        styles={customStyles}
      ></Select>
      <input
        name="quantity"
        className="input_box"
        placeholder="כמות"
        // placeholder={!itemInBid?.quantity ? `כמות` : itemInBid?.quantity}
        value={itemInRow?.quantity}
        onChange={(e) => {
          setBySelectedValue(e);
        }}
        disabled={bid.isApproved}
      ></input>
      <input
        name="number"
        className="input_box"
        placeholder={!itemInBid ? `מחיר` : itemInBid.number}
        onChange={(e) => {
          setBySelectedValue(e);
        }}
        value={!bid.isApproved ? itemInRow.number : ""}
      ></input>

      <input
        name="totalAmount"
        disabled
        placeholder={!itemInBid ? `סה"כ` : itemInBid.totalAmount}
        className="input_box total"
        value={!bid.isApproved ? itemInRow.totalAmount : ""}
      ></input>
      {!bid.isApproved && (
        <input
          className="checkBoxStyle"
          type="checkbox"
          checked={itemInRow.checked}
          onChange={(e) =>
            validation() &&
            setItemInRow((prev) => {
              return { ...prev, checked: !prev.checked };
            })
          }
          onClick={(e) => validation() && checkHandler(e)}
        />
      )}
    </form>
  );
}
