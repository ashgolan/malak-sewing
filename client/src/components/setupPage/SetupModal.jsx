import React, { useContext, useState } from "react";
import Select from "react-select";

import Modal from "react-modal";
import { getAccessToken } from "../../utils/tokensStorage";
import { FetchingStatus } from "../../utils/context";
import { Api } from "../../utils/Api";

export default function SetupModal({
  afterOpenModal,
  closeModal,
  companies,
  setIsOpen,
  modalIsOpen,
  setPageUpdate,
}) {
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);

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
  const [method, setMethod] = useState("get");
  const [endPoint, setEndPoint] = useState("/companies/");
  const [companyId, setCompanyId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [taskBody, setTaskBody] = useState({});
  const [companyBody, setCompanyBody] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(!isChecked);
  };

  function afterOpenModal() {
    subtitle.style.color = "#0e6486";
  }
  const initialSetupSelection = {
    category: null,
    function: null,
    companyName: null,
    task: null,
  };

  const initialCompanyBody = {
    companyName: "",
  };

  const initialTaskBody = {
    taskName: "",
  };
  let subtitle;
  const [setupSelection, setSetupSelection] = useState({
    category: null,
    function: null,
    companyName: null,
    task: null,
  });
  const getCompanyList = () => {
    return companies?.map((item) => {
      return { value: item._id, label: item.name };
    });
  };
  const getChekedCompanies = () => {
    return companies
      ?.filter((item) => item.isInstitution)
      .map((company) => company.name);
  };
  const getTasksFromCompanyList = () => {
    if (!setupSelection?.companyName?.label) {
      return [];
    }

    const companyNameObj = companies?.find(
      (company) => company.name === setupSelection?.companyName.label
    );

    return companyNameObj?.tasks?.map((item) => {
      return { value: item._id, label: item.description };
    });
  };

  function closeModal() {
    setSetupSelection(initialSetupSelection);
    setCompanyBody(initialCompanyBody);
    setTaskBody(initialTaskBody);
    setEndPoint("");
    setMethod("");
    setCompanyId("");
    setIsChecked(false);
    setTaskId("");
    setIsOpen(false);
  }

  const applyCompaniesAndTaskRequest = async (e) => {
    e.preventDefault();
    const accessToken = getAccessToken(); // Get the token once and reuse it

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    const body =
      endPoint === "/companies/" && method === "put"
        ? { name: companyBody?.companyName, isInstitution: isChecked }
        : endPoint === "/companies/"
        ? {
            name: companyBody?.companyName,
            isInstitution: isChecked,
            taskDescription: taskBody?.taskName || "ללא עבודה",
          }
        : { newDescription: taskBody?.taskName };
    console.log(body);

    try {
      setFetchingStatus((prev) => ({
        ...prev,
        status: true,
        loading: true,
        message: null,
      }));
      const headers = { Authorization: getAccessToken() };
      console.log(endPoint, body, method);

      if (method === "post" || method === "put" || method === "patch") {
        const { data } = await Api[method](
          `${endPoint}${companyId ?? ""}${taskId ?? ""}`,
          body,
          { headers }
        );
      } else {
        await Api[method](`${endPoint}${companyId ?? ""}${taskId ?? ""}`, {
          headers,
        });
      }

      setFetchingStatus((prev) => ({
        ...prev,
        status: false,
        loading: false,
        message: "הבקשה בוצעה בהצלחה",
      }));

      setTimeout(() => {
        setFetchingStatus((prev) => ({
          ...prev,
          status: false,
          loading: false,
          message: null,
        }));
      }, 1000);
      setPageUpdate((prev) => !prev);
    } catch (e) {
      console.error(e); // Log the error for debugging

      // Update fetching status on failure
      setFetchingStatus((prev) => ({
        ...prev,
        status: false,
        loading: false,
        message: ".. תקלה ביבוא הנתונים", // Error message in Hebrew
      }));

      // Clear the error message after a short delay
      setTimeout(() => {
        setFetchingStatus((prev) => ({
          ...prev,
          status: false,
          loading: false,
          message: null,
        }));
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
        <Select
          options={[
            { value: "01", label: "חברה" },
            { value: "02", label: "עבודה" },
          ]}
          className="setup-select select-product-in-add "
          placeholder={"בחר קטגוריה"}
          required
          onChange={(e) => {
            setSetupSelection((prev) => {
              return {
                ...prev,
                category: e || "",
              };
            });
            setEndPoint(e?.value === "01" ? "/companies/" : "/companies/task/");
          }}
          value={setupSelection.category || null}
          styles={customStyles}
          isClearable
        ></Select>
        {setupSelection?.category?.label === "חברה" && (
          <div class="checkbox-container">
            <label class="checkbox-label" for="cbx-51">
              ? האם זה מוסד
            </label>
            <div class="checkbox-wrapper-51">
              <input
                type="checkbox"
                id="cbx-51"
                checked={isChecked} // Bind the state to the checkbox
                onChange={handleCheckboxChange} // Handle the change event
              />{" "}
              <label for="cbx-51" class="toggle">
                <span>
                  <svg width="10px" height="10px" viewBox="0 0 10 10">
                    <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
                  </svg>
                </span>
              </label>
            </div>
          </div>
        )}

        <Select
          options={[
            { value: "01", label: "הוספה" },
            { value: "02", label: "מחיקה" },
            { value: "03", label: "עדכון" },
          ]}
          className="setup-select select-product-in-add "
          placeholder={"בחר פעולה"}
          required
          styles={customStyles}
          onChange={(e) => {
            setSetupSelection((prev) => {
              return {
                ...prev,
                function: e,
              };
            });
            setMethod(
              e?.value === "01" ? "post" : e?.value === "02" ? "delete" : "put"
            );
          }}
          value={setupSelection.function || null}
          isClearable
        ></Select>
        {!(
          setupSelection?.function?.label === "הוספה" &&
          setupSelection?.category?.label === "חברה"
        ) && (
          <Select
            options={getCompanyList()}
            className="setup-select select-product-in-add "
            placeholder={"בחר חברה"}
            styles={customStyles}
            menuPlacement="auto"
            required
            defaultValue={setupSelection?.companyName}
            onChange={(e) => {
              const isInsTitutionComp = getChekedCompanies()?.includes(
                e?.label
              );
              setSetupSelection((prev) => {
                return {
                  ...prev,
                  companyName: e,
                };
              });
              setIsChecked(e?.label ? isInsTitutionComp : false);
              setCompanyId(
                endPoint === "/companies/" ||
                  (endPoint === "/companies/task/" && method === "post")
                  ? e?.value
                  : ""
              );
            }}
            value={setupSelection.companyName || null}
            isClearable
          ></Select>
        )}
        {setupSelection?.function?.label !== "הוספה" &&
          !(
            setupSelection?.function?.label === "מחיקה" &&
            setupSelection?.category?.label === "חברה"
          ) &&
          !(
            setupSelection?.function?.label === "עדכון" &&
            setupSelection?.category?.label === "חברה"
          ) && (
            <Select
              options={getTasksFromCompanyList()}
              className="setup-select select-product-in-add"
              placeholder={"בחר עבודה"}
              styles={customStyles}
              menuPlacement="auto"
              required
              onChange={(e) => {
                setSetupSelection((prev) => ({
                  ...prev,
                  task: e,
                }));
                setTaskId(e?.value);
              }}
              value={setupSelection.task || null}
              isClearable
            />
          )}

        {setupSelection.category?.label === "חברה" &&
          (setupSelection.function?.label === "הוספה" ||
            setupSelection.function?.label === "עדכון") && (
            <input
              className="setupCompanies-input"
              type="text"
              required
              placeholder="חברה"
              value={companyBody?.companyName}
              onChange={(e) => {
                setCompanyBody((prev) => {
                  return { ...prev, companyName: e.target.value };
                });
              }}
            />
          )}
        <br></br>
        {((setupSelection.function?.label === "הוספה" && !isChecked) ||
          (setupSelection.function?.label === "עדכון" &&
            setupSelection?.category?.label !== "חברה")) && (
          <input
            className="setupCompanies-input"
            type="text"
            required
            placeholder="עבודה"
            value={taskBody?.taskName}
            onChange={(e) =>
              setTaskBody((prev) => {
                return { ...prev, taskName: e.target.value };
              })
            }
          />
        )}
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
          <button type="submit">אישור</button>
        </div>
      </form>
    </Modal>
  );
}
