import React, { useState } from "react";
import "./chartHomepage.css";
import Select from "react-select";
import SetupPage from "../setupPage/SetupPage";
import ChartPage from "./ChartPage";

function ChartHomepage() {
  const [report, setReport] = useState({ type: "", month: "", year: "" });
  const [updatedReport, setUpdatedReport] = useState(false);
  const [updateChart, setUpdateChart] = useState(false);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const allMonths = months.map((item) => {
    return { value: item.value, label: item.label };
  });
  let yearArray = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    yearArray.push(i);
  }
  const allYears = yearArray.sort().map((year) => {
    return { value: year, label: year };
  });
  const allTypes = [
    { type: "/expenses", name: "דוח הוצאות" },
    { type: "/sales", name: "דוח הכנסות" },
    { type: "expensesCharts", name: "תרשים הוצאות" },
    { type: "salesCharts", name: "תרשים הכנסות" },
  ].map((item) => {
    return { value: item.type, label: item.name };
  });
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
    }),
    placeholder: (provided) => ({
      ...provided,
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused ? "gold" : "whitesmoke",
      color: state.isFocused ? "brown" : "black",
    }),
    singleValue: (styles, state) => {
      return {
        ...styles,
        color: state.isSelected ? "brown" : "black",
      };
    },
  };

  return (
    <div>
      <div className="charts-title">
        <Select
          options={allTypes}
          placeholder="בחר סוג דוח"
          onChange={(e) => {
            setUpdatedReport((prev) => !prev);
            setReport((prev) => {
              return { ...prev, type: e.value };
            });
            setUpdateChart((prev) => !prev);
          }}
          styles={customStyles}
        ></Select>{" "}
        <Select
          options={allYears}
          placeholder="בחר שנה"
          onChange={(e) => {
            setUpdatedReport((prev) => !prev);
            setReport((prev) => {
              return { ...prev, year: e.value };
            });
            setUpdateChart((prev) => !prev);
          }}
          styles={customStyles}
        ></Select>
        {report.year && (
          <Select
            options={allMonths}
            placeholder="בחר חודש"
            onChange={(e) => {
              setReport((prev) => {
                setUpdatedReport((prev) => !prev);
                return { ...prev, month: e.value };
              });
              setUpdateChart((prev) => !prev);
            }}
            styles={customStyles}
          ></Select>
        )}
      </div>
      {report.type &&
        (report.type === "/expenses" || report.type === "/sales") && (
          <SetupPage
            updatedReport={updatedReport}
            collReq={report.type}
            report={report}
          ></SetupPage>
        )}
      {report.type &&
        (report.type === "expensesCharts" || report.type === "salesCharts") && (
          <ChartPage updateChart={updateChart} report={report}></ChartPage>
        )}
    </div>
  );
}

export default ChartHomepage;
