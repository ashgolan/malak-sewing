import React, { useState } from "react";
import "./chartHomepage.css";
import Select from "react-select";
import SetupPage from "../setupPage/SetupPage";
import ChartPage from "./ChartPage";
import { exportToPdf } from "../../utils/export-to-pdf";

function ChartHomepage() {
  const [report, setReport] = useState({ type: "", month: "", year: "" });
  const [updatedReport, setUpdatedReport] = useState(false);
  const [updateChart, setUpdateChart] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const months = [
    { value: null, label: null },
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
    if (i === 2020) yearArray.push(null);
    yearArray.push(i);
  }
  const allYears = yearArray.sort().map((year) => {
    return {
      value: year === 2020 ? null : year,
      label: year === 2020 ? null : year,
    };
  });
  const allTypes = [
    { type: "/sleevesBids", name: "דוח שרוולים" },
    { type: "/expenses", name: "דוח הוצאות" },
    { type: "/sales", name: "דוח הכנסות" },
    { type: "sleevesBidsCharts", name: "תרשים שרוולים" },
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
  const downloadToPdf = () => {
    exportToPdf(
      "pdfOrder",
      report.type + "-" + report.month + "-" + report.year
    );
  };
  return (
    <div id={"pdfOrder"}>
      <div className="charts-title">
        <Select
          className="select-chart"
          options={allTypes}
          placeholder="בחר סוג דוח"
          onChange={(e) => {
            setUpdatedReport((prev) => !prev);
            setReport((prev) => {
              return { ...prev, type: e.value, month: null, year: null };
            });
            setUpdateChart((prev) => !prev);
            setShowChart(false);
          }}
          styles={customStyles}
        ></Select>{" "}
        {report.type && (
          <Select
            options={allYears.filter((option) => option.value !== null)}
            placeholder="בחר שנה"
            onChange={(selectedOption) => {
              setReport((prev) => {
                setUpdatedReport((prev) => !prev);
                return {
                  ...prev,
                  year: selectedOption ? selectedOption.value : null,
                };
              });
              setUpdateChart((prev) => !prev);
              setShowChart(false);
            }}
            value={
              report.year !== null
                ? allYears?.find((option) => option.value === report.year)
                : null
            }
            isClearable={true}
            styles={customStyles}
          ></Select>
        )}
        {report.type && report.year && (
          <Select
            options={allMonths.filter((option) => option.value !== null)}
            placeholder="בחר חודש"
            onChange={(selectedOption) => {
              setReport((prev) => {
                setUpdatedReport((prev) => !prev);
                return {
                  ...prev,
                  month: selectedOption ? selectedOption.value : null,
                };
              });
              setUpdateChart((prev) => !prev);
              setShowChart(false);
            }}
            styles={customStyles}
            value={
              report.month !== null
                ? allMonths?.find((option) => option.value === report.month)
                : null
            }
            isClearable={true}
          ></Select>
        )}
        {report.type && report.year && (
          <div className="downloadPdf">
            <img src="/downloadPdf.png" alt="" onClick={downloadToPdf} />
          </div>
        )}
      </div>
      {report.type &&
        (report.type === "/expenses" ||
          report.type === "/sales" ||
          report.type === "/sleevesBids") && (
          <SetupPage
            updatedReport={updatedReport}
            collReq={report.type}
            report={report}
          ></SetupPage>
        )}
      {report.type &&
        report.year &&
        (report.type === "expensesCharts" ||
          report.type === "salesCharts" ||
          report.type === "sleevesBidsCharts") && (
          <ChartPage
            showChart={showChart}
            setShowChart={setShowChart}
            updateChart={updateChart}
            report={report}
          ></ChartPage>
        )}
    </div>
  );
}

export default ChartHomepage;
