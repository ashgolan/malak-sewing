import React, { useState } from "react";
import "./chartHomepage.css";
import Select from "react-select";
import SetupPage from "../setupPage/SetupPage";
function ChartHomepage() {
  const [report, setReport] = useState({ type: "", month: "", year: "" });
  const [updatedReport, setUpdatedReport] = useState(false);

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
    { type: "/expenses", name: "הוצאות" },
    { type: "/sales", name: "הכנסות" },
    { type: "charts", name: "תרשים" },
  ].map((item) => {
    return { value: item.type, label: item.name };
  });
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
          }}
        ></Select>{" "}
        <Select
          options={allYears}
          placeholder="בחר שנה"
          onChange={(e) => {
            setUpdatedReport((prev) => !prev);
            setReport((prev) => {
              return { ...prev, year: e.value };
            });
          }}
        ></Select>
        <Select
          options={allMonths}
          placeholder="בחר חודש"
          onChange={(e) => {
            setReport((prev) => {
              setUpdatedReport((prev) => !prev);
              return { ...prev, month: e.value };
            });
          }}
        ></Select>
      </div>
      {report.type && (
        <SetupPage
          updatedReport={updatedReport}
          collReq={report.type}
          report={report}
        ></SetupPage>
      )}
    </div>
  );
}

export default ChartHomepage;
