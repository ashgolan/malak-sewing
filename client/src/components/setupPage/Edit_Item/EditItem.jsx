// import React from "react";
// import "./EditItem.css";
// import { FetchingStatus } from "../../../utils/context";
// import { useContext } from "react";
// import { Api } from "../../../utils/Api";
// import { useNavigate } from "react-router";
// import { refreshMyToken } from "../../../utils/setNewAccessToken";
// import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
// // import { getCollectionProps } from "../../../utils/collectionProps";
// export default function EditItem({
//   item,
//   itemInChange,
//   setItemInChange,
//   changeStatus,
//   setChangeStatus,
//   itemsValues,
//   setItemIsUpdated,
//   collReq,
// }) {
//   const navigate = useNavigate();
//   const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
//   const checkInputsValues = () => {
//     const thisProps = isInputsChanged(collReq);
//     if (!thisProps) return;
//     for (let i in itemsValues) {
//       console.log(itemsValues[i]);

//       if (itemsValues[i] === "" && thisProps.includes(i)) return true;
//     }
//   };
//   const isInputsChanged = () => {
//     switch (collReq) {
//       case "/contacts":
//         return (
//           itemsValues.number !== item.number ||
//           itemsValues.name.trim() !== item.name.trim() ||
//           itemsValues.mail !== item.mail ||
//           itemsValues.bankProps !== item.bankProps
//         );
//       case "/sleevesBids":
//         return (
//           itemsValues.number !== item.number ||
//           itemsValues.clientName.trim() !== item.clientName.trim() ||
//           itemsValues.date !== item.date ||
//           itemsValues.tax !== item.tax ||
//           itemsValues.quantity !== item.quantity ||
//           itemsValues.totalAmount !== item.totalAmount
//         );
//       case "/workersExpenses":
//         return (
//           itemsValues.date !== item.date ||
//           itemsValues.location !== item.location ||
//           itemsValues.clientName.trim() !== item.clientName.trim() ||
//           itemsValues.colored !== item.colored ||
//           itemsValues.equipment !== item.equipment ||
//           itemsValues.number !== item.number ||
//           +itemsValues.totalAmount !== item.number ||
//           itemsValues.tax !== item.tax
//         );
//       case "/sales":
//         return (
//           itemsValues.number !== item.number ||
//           itemsValues.name.trim() !== item.name.trim() ||
//           itemsValues.clientName.trim() !== item.clientName.trim() ||
//           itemsValues.remark !== item.remark ||
//           itemsValues.sale !== item.sale ||
//           itemsValues.discount !== item.discount ||
//           itemsValues.expenses !== item.expenses ||
//           itemsValues.date !== item.date ||
//           itemsValues.tax !== item.tax ||
//           itemsValues.colored !== item.colored ||
//           itemsValues.quantity !== item.quantity ||
//           itemsValues.totalAmount !== item.totalAmount
//         );
//       case "/institutionTax":
//         return (
//           itemsValues.date !== item.date ||
//           itemsValues.clientName.trim() !== item.clientName.trim() ||
//           itemsValues.name.trim() !== item.name.trim() ||
//           itemsValues.number !== item.number ||
//           itemsValues.taxNumber !== item.taxNumber ||
//           itemsValues.withholdingTax !== item.withholdingTax ||
//           itemsValues.paymentDate !== item.paymentDate ||
//           itemsValues.colored !== item.colored ||
//           itemsValues.totalAmount !== item.totalAmount
//         );
//       case "/salesToCompanies":
//         return (
//           itemsValues.date !== item.date ||
//           itemsValues.clientName.trim() !== item.clientName.trim() ||
//           itemsValues.name.trim() !== item.name.trim() ||
//           itemsValues.number !== item.number ||
//           itemsValues.colored !== item.colored ||
//           itemsValues.totalAmount !== item.totalAmount
//         );
//       case "/expenses":
//         return (
//           itemsValues.number !== item.number ||
//           itemsValues.name.trim() !== item.name.trim() ||
//           itemsValues.tax !== item.tax ||
//           itemsValues.taxNumber !== item.taxNumber ||
//           itemsValues.date !== item.date ||
//           itemsValues.colored !== item.colored ||
//           itemsValues.paymentDate !== item.paymentDate ||
//           itemsValues.totalAmount !== item.totalAmount
//         );

//       case "/inventories":
//         return (
//           itemsValues.number !== item.number ||
//           itemsValues.name.trim() !== item.name.trim()
//         );

//       default:
//         return (
//           itemsValues.number !== item.number ||
//           itemsValues.name.trim() !== item.name.trim()
//         );
//     }
//   };
//   const sendRequest = async (token) => {
//     const headers = { Authorization: token };
//     setFetchingStatus((prev) => {
//       return { ...prev, status: true, loading: true };
//     });

//     switch (collReq) {
//       case "/sleevesBids":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             clientName: itemsValues.clientName.trim(),
//             number: itemsValues.number,
//             date: itemsValues.date,
//             tax: itemsValues.tax,
//             quantity: itemsValues.quantity,
//             totalAmount: itemsValues.totalAmount,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/workersExpenses":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             date: itemsValues.date,
//             location: itemsValues.location,
//             clientName: itemsValues.clientName.trim(),
//             equipment: itemsValues.equipment,
//             number: itemsValues.number,
//             colored: itemsValues.colored,
//             totalAmount: itemsValues.number,
//             tax: itemsValues.tax,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/sales":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             date: itemsValues.date,
//             name: itemsValues.name.trim(),
//             clientName: itemsValues.clientName.trim(),
//             remark: itemsValues.remark,
//             number: itemsValues.number,
//             discount: itemsValues.discount,
//             sale: itemsValues.sale,
//             expenses: itemsValues.expenses,
//             colored: itemsValues.colored,
//             tax: itemsValues.tax,
//             quantity: itemsValues.quantity,
//             totalAmount: itemsValues.totalAmount,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/institutionTax":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             date: itemsValues.date,
//             clientName: itemsValues.clientName.trim(),
//             name: itemsValues.name.trim(),
//             number: itemsValues.number,
//             taxNumber: itemsValues.taxNumber,
//             withholdingTax: itemsValues.withholdingTax,
//             paymentDate: itemsValues.paymentDate,
//             colored: itemsValues.colored,
//             totalAmount: itemsValues.totalAmount,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/salesToCompanies":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             date: itemsValues.date,
//             name: itemsValues.name.trim(),
//             clientName: itemsValues.clientName.trim(),
//             number: itemsValues.number,
//             colored: itemsValues.colored,
//             totalAmount: itemsValues.totalAmount,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/contacts":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             name: itemsValues.name.trim(),
//             number: itemsValues.number,
//             mail: itemsValues.mail,
//             bankProps: itemsValues.bankProps,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/inventories":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           { name: itemsValues.name.trim(), number: itemsValues.number },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/expenses":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             name: itemsValues.name.trim(),
//             number: itemsValues.number,
//             date: itemsValues.date,
//             tax: itemsValues.tax,
//             taxNumber: itemsValues.taxNumber,
//             colored: itemsValues.colored,
//             paymentDate: itemsValues.paymentDate,
//             totalAmount: itemsValues.totalAmount,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       default:
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           { name: itemsValues.name.trim(), number: itemsValues.number },
//           {
//             headers: headers,
//           }
//         );
//     }
//     setFetchingStatus((prev) => {
//       return {
//         ...prev,
//         status: false,
//         loading: false,
//         message: "העידכון בוצע בהצלחה",
//       };
//     });
//     setItemIsUpdated((prev) => !prev);
//     setTimeout(() => {
//       setFetchingStatus((prev) => {
//         return { ...prev, status: false, loading: false, message: null };
//       });
//     }, 1000);
//   };
//   const updateData = async () => {
//     try {
//       await sendRequest(getAccessToken());
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         try {
//           const newAccessToken = await refreshMyToken();
//           try {
//             await sendRequest(newAccessToken);
//           } catch (e) {
//             throw e;
//           }
//         } catch (refreshError) {
//           setFetchingStatus((prev) => {
//             return {
//               ...prev,
//               status: false,
//               loading: false,
//             };
//           });
//           clearTokens();

//           navigate("/homepage");
//         }
//       } else {
//         clearTokens();

//         setFetchingStatus((prev) => {
//           return {
//             ...prev,
//             status: false,
//             loading: false,
//             message: ".. תקלה בעדכון המוצר",
//           };
//         });
//         setTimeout(() => {
//           setFetchingStatus((prev) => {
//             return {
//               ...prev,
//               status: false,
//               loading: false,
//               message: null,
//             };
//           });
//           navigate("/homepage");
//         }, 1000);
//       }
//     }
//   };

//   const editHandler = (e) => {
//     e.preventDefault();

//     if (changeStatus.editText === "אישור") {
//       const haveAnEmptyValues = checkInputsValues();
//       if (haveAnEmptyValues) {
//         setFetchingStatus((prev) => {
//           return {
//             ...prev,
//             status: true,
//             error: true,
//             message: "צריך למלא את כל הנתונים",
//           };
//         });
//         return;
//       }
//       const isChanged = isInputsChanged();

//       isChanged && updateData();
//       setFetchingStatus((prev) => {
//         return { ...prev, status: false, message: null };
//       });
//     }

//     setItemInChange(!itemInChange);
//     setChangeStatus((prev) => {
//       return {
//         editText: prev.editText === "עריכה" ? "אישור" : "עריכה",
//         delete: prev.editText === "עריכה" ? "ביטול" : "מחיקה",
//         disabled: prev.editText === "עריכה" ? false : true,
//         itemId: prev.editText === "עריכה" ? item._id : null,
//       };
//     });
//   };

//   return (
//     <button
//       style={{
//         width: collReq === "/sales" ? "7%" : "11%",
//         visibility:
//           !itemInChange || changeStatus.itemId === item._id
//             ? "visible"
//             : "hidden",
//       }}
//       className="edit_btn"
//       onClick={editHandler}
//     >
//       {changeStatus.editText}
//     </button>
//   );
// }
import React, { useContext } from "react";
import "./EditItem.css";
import { FetchingStatus } from "../../../utils/context";
import { Api } from "../../../utils/Api";
import { useNavigate } from "react-router";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import { getCollectionProps } from "../../../utils/collectionProps";

export default function EditItem({
  item,
  itemInChange,
  setItemInChange,
  changeStatus,
  setChangeStatus,
  itemsValues,
  setItemIsUpdated,
  collReq,
}) {
  const navigate = useNavigate();
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);

  // Check if inputs are empty based on collection properties
  const checkInputsValues = () => {
    const thisProps = getCollectionProps(collReq);
    if (!thisProps) return;
    return Object.keys(itemsValues).some(
      (key) => thisProps.includes(key) && itemsValues[key] === ""
    );
  };

  // Generalized function to check if inputs have changed
  const isInputsChanged = () => {
    const relevantProps = {
      "/contacts": ["number", "name", "mail", "bankProps"],
      "/sleevesBids": [
        "number",
        "clientName",
        "date",
        "tax",
        "quantity",
        "totalAmount",
      ],
      "/workersExpenses": [
        "date",
        "location",
        "clientName",
        "colored",
        "equipment",
        "number",
        "totalAmount",
        "tax",
      ],
      "/sales": [
        "number",
        "name",
        "clientName",
        "remark",
        "sale",
        "discount",
        "expenses",
        "date",
        "tax",
        "colored",
        "quantity",
        "totalAmount",
      ],
      "/institutionTax": [
        "date",
        "clientName",
        "name",
        "number",
        "taxNumber",
        "withholdingTax",
        "paymentDate",
        "colored",
        "totalAmount",
      ],
      "/salesToCompanies": [
        "date",
        "clientName",
        "name",
        "number",
        "colored",
        "totalAmount",
      ],
      "/expenses": [
        "number",
        "name",
        "tax",
        "taxNumber",
        "date",
        "colored",
        "paymentDate",
        "totalAmount",
      ],
      "/inventories": ["number", "name"],
    }[collReq] || ["number", "name"];

    return relevantProps.some((key) => itemsValues[key] !== item[key]);
  };

  // Function to send the API request
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    const patchData = Object.keys(itemsValues).reduce((acc, key) => {
      if (itemsValues[key] !== undefined) acc[key] = itemsValues[key];
      return acc;
    }, {});

    setFetchingStatus({ status: true, loading: true });

    try {
      await Api.patch(`${collReq}/${item._id}`, patchData, { headers });
      setFetchingStatus({
        status: false,
        loading: false,
        message: "העידכון בוצע בהצלחה",
      });
      setTimeout(() => {
        setFetchingStatus({ status: false, loading: false, message: null });
      }, 1000);
      setItemIsUpdated((prev) => !prev);
    } catch (error) {
      setFetchingStatus({
        status: false,
        loading: false,
        message: "תקלה בעדכון המוצר. אנא נסה שוב",
      });
      console.error("Error during the update:", error);
    }
  };

  // Update data with error handling and token refresh
  const updateData = async () => {
    try {
      await sendRequest(getAccessToken());
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          await sendRequest(newAccessToken);
        } catch (refreshError) {
          clearTokens();
          navigate("/homepage");
        }
      } else {
        clearTokens();
        setFetchingStatus({
          status: false,
          loading: false,
          message: ".. תקלה בעדכון המוצר",
        });
        setTimeout(() => navigate("/homepage"), 1000);
      }
    }
  };

  // Edit handler
  const editHandler = (e) => {
    e.preventDefault();
    if (changeStatus.editText === "אישור") {
      if (checkInputsValues()) {
        setFetchingStatus({
          status: true,
          error: true,
          message: "צריך למלא את כל הנתונים",
        });

        return;
      }

      if (isInputsChanged()) updateData();
    }
    setItemInChange(!itemInChange);
    setChangeStatus((prev) => ({
      editText: prev.editText === "עריכה" ? "אישור" : "עריכה",
      delete: prev.editText === "עריכה" ? "ביטול" : "מחיקה",
      disabled: prev.editText === "עריכה" ? false : true,
      itemId: prev.editText === "עריכה" ? item._id : null,
    }));
  };

  return (
    <button
      style={{
        width: collReq === "/sales" ? "7%" : "11%",
        visibility:
          !itemInChange || changeStatus.itemId === item._id
            ? "visible"
            : "hidden",
      }}
      className="edit_btn"
      onClick={editHandler}
    >
      {changeStatus.editText}
    </button>
  );
}
