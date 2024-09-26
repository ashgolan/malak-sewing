import React, { useEffect, useState } from "react";

import Modal from "react-modal";
import { getAccessToken } from "../../utils/tokensStorage";
import { Api } from "../../utils/Api";

export default function TaxValuesModal({
  afterOpenModal,
  closeModal,
  setIsOpen,
  modalIsOpen,
  setPageUpdate,
}) {
  const [fetchingStatus, setFetchingStatus] = useState({
    loading: false,
    error: false,
    status: false,
    message: null,
  });
  const [taxValues, setTaxValues] = useState({});

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      maxWidth: "90%",
      textAlign: "center",
    },
  };
  useEffect(() => {
    const getTaxValues = async () => {
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      try {
        const { data: taxValuesData } = await Api.get("/taxValues", {
          headers,
        });
        setTaxValues(taxValuesData[0]);
      } catch (e) {
        console.log(e);
      }
    };
    getTaxValues();
  }, []);

  function afterOpenModal() {
    subtitle.style.color = "#0e6486";
  }

  let subtitle;

  function closeModal() {
    setIsOpen(false);
  }

  const applyCompaniesAndTaskRequest = async (e) => {
    e.preventDefault();
    const accessToken = getAccessToken();

    if (!accessToken) {
      console.error("No access token found");
      return;
    }
    const headers = { Authorization: getAccessToken() };

    try {
      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: true,
          loading: true,
        };
      });
      const { data } = await Api.patch(
        `/taxValues/${taxValues._id}`,
        {
          masValue: taxValues?.masValue,
          maamValue: taxValues?.maamValue,
        },
        {
          headers,
        }
      );

      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: true,
          loading: false,
          message: "העדכון בוצע בהצלחה",
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
      }, 1000);
    } catch (e) {
      console.log(e);

      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: true,
          loading: false,
          message: "תקלה בעידכון הנתונים",
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
      }, 1000);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      appElement={document.getElementById("root")}
      contentLabel="הגדרות חברות ועבודות"
    >
      <h2
        style={{ borderBottom: "1px solid rgb(60, 85, 60)" }}
        ref={(_subtitle) => (subtitle = _subtitle)}
      >
        הגדרות חברות ועבודות
      </h2>
      <form onSubmit={applyCompaniesAndTaskRequest}>
        <div className="taxValues-inputs">
          <label htmlFor="">ניקוי במקור</label>
          <input
            className="setupCompanies-input"
            type="text"
            required
            placeholder={` ${taxValues?.masValue}% ערך הניקוי במקור`}
            value={taxValues?.masValue ? `%${taxValues.masValue}` : ""}
            onChange={(e) => {
              const valueWithoutPercent = e.target.value.replace(/%/g, ""); // Remove '%' when updating state
              setTaxValues((prev) => ({
                ...prev,
                masValue: valueWithoutPercent,
              }));
            }}
          />
        </div>
        <div className="taxValues-inputs">
          <label htmlFor="">מע"מ</label>
          <input
            className="setupCompanies-input"
            type="text"
            required
            placeholder={` ${taxValues?.maamValue}% ערך המעמ`}
            value={taxValues?.maamValue ? `%${taxValues.maamValue}` : ""}
            onChange={(e) => {
              const valueWithoutPercent = e.target.value.replace(/%/g, ""); // Remove '%' when updating state
              setTaxValues((prev) => ({
                ...prev,
                maamValue: valueWithoutPercent,
              }));
            }}
          />
        </div>
        {fetchingStatus.message && (
          <h5
            className="message"
            style={{ borderRadius: 0, backgroundColor: "white" }}
          >
            {fetchingStatus.message}
          </h5>
        )}
        <div className="buttons-in-modal">
          <button
            type="button"
            onClick={() => closeModal()}
            style={{ backgroundColor: "rgb(180, 58, 58)" }}
          >
            ביטול
          </button>
          <button type="submit">עדכון</button>
        </div>
      </form>
    </Modal>
  );
}
