import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import "./BidRow.css";

export default function BidRow({ numOfRow, myData, itemInBid, setBid, bid }) {
  const [itemChanged, setItemChanged] = useState(false);
  const bidForm = useRef();
  const [itemInRow, setItemInRow] = useState({
    id: numOfRow,
    _id: "",
    name: "",
    quantity: "",
    number: "",
    totalAmount: 0,
    checked: false,
  });

  useEffect(() => {
    if (itemInBid && !itemChanged) {
      setItemInRow({
        id: numOfRow,
        _id: itemInBid._id,
        name: itemInBid.name,
        quantity: itemInBid.quantity,
        number: itemInBid.number,
        totalAmount: itemInBid.totalAmount,
        checked: itemInBid.checked,
      });
    }
  }, [itemInBid, itemChanged, numOfRow]);

  const allItems = myData?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

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
    setBid((prev) => ({
      ...prev,
      totalAmount: +sum,
      data: myFilteredData.sort((s1, s2) => s1.name - s2.name),
    }));
  };

  // const uncheckItem = () => {
  //   const myFilteredData = bid?.data?.map((item) => {
  //     if (item.id === numOfRow) {
  //       item.checked = false;
  //       item.totalAmount = 0;
  //     }
  //     return item;
  //   });
  //   const sum = myFilteredData.reduce(
  //     (accumulator, object) => accumulator + +object.totalAmount,
  //     0
  //   );
  //   setBid((prev) => ({
  //     ...prev,
  //     totalAmount: sum,
  //     data: myFilteredData.sort((s1, s2) => s1.name - s2.name),
  //   }));
  // };

  const setBySelectedValue = (e) => {
    const foundItem = myData.find((item) => item.name === e.label);
    setItemChanged(true);
    if (e.target?.name === "quantity" || e.target?.name === "number") {
      setItemInRow((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        totalAmount:
          e.target.name === "quantity"
            ? prev.number * e.target.value
            : e.target.value * prev.quantity,
        checked: false,
      }));
    } else {
      setItemInRow((prev) => ({
        ...prev,
        _id: foundItem._id,
        name: foundItem.name,
        quantity: "",
        totalAmount: 0,
        checked: false,
      }));
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
              totalAmount: +sum,
              data: [...prev.data, { ...itemInRow, checked: true }].sort(
                (s1, s2) => s1.name - s2.name
              ),
            };
          })
        : setBid((prev) => {
            const myFilteredData = bid?.data?.filter(
              (item) => item.id !== numOfRow
            );
            const sum = myFilteredData.reduce(
              (accumulator, object) => accumulator + +object.totalAmount,
              0
            );
            return {
              ...prev,
              totalAmount: +sum,
              data: myFilteredData.sort((s1, s2) => s1.name - s2.name),
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
              totalAmount: +sum,
              data: [...prev.data, { ...itemInRow, checked: true }],
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
    return Object.values(data).every((value) => value !== "");
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
    <>
      <form ref={bidForm} className="row">
        <input disabled className="row_number" value={numOfRow + 1} />
        <Select
          options={allItems}
          isDisabled={bid.isApproved}
          placeholder={!itemInBid ? `בחר מוצר` : itemInBid.name}
          className="select-item"
          defaultValue={!bid.isApproved ? itemInRow.name : ""}
          onChange={setBySelectedValue}
          menuPlacement="auto"
          styles={customStyles}
        />
        <input
          name="quantity"
          className="input_box"
          type="number"
          placeholder={!itemInBid?.quantity ? `כמות` : itemInBid?.quantity}
          value={!bid.isApproved ? itemInRow.quantity : ""}
          onChange={setBySelectedValue}
          disabled={bid.isApproved}
        />
        <input
          name="number"
          className="input_box"
          type="number"
          placeholder={!itemInBid ? `מחיר` : itemInBid.number}
          onChange={setBySelectedValue}
          value={!bid.isApproved ? itemInRow.number : ""}
        />
        <input
          name="totalAmount"
          disabled
          placeholder={!itemInBid ? `סה"כ` : itemInBid.totalAmount}
          className="input_box total"
          value={!bid.isApproved ? itemInRow.totalAmount : ""}
        />
        {!bid.isApproved && (
          <input
            className="checkBoxStyle"
            type="checkbox"
            checked={itemInRow.checked}
            onChange={(e) =>
              validation() &&
              setItemInRow((prev) => ({
                ...prev,
                checked: !prev.checked,
              }))
            }
            onClick={(e) => validation() && checkHandler(e)}
          />
        )}
      </form>
    </>
  );
}
