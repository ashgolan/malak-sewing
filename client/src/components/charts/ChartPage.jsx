import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { chart as ChartJS } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { FetchingStatus } from "../../utils/context";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";
import { getDataByTotals } from "../../utils/getDataByTotals";
import ChartDataLabels from "chartjs-plugin-datalabels";

function ChartPage({ report, setShowChart, showChart }) {
  const navigate = useNavigate();
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [fetchingData, setFetchingData] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: report?.month && report?.year ? "סכום חודשי" : "סכום יומי",
        data: [],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FFC107",
          "#FF5722",
          "#E91E63",
          "#673AB7",
          "#00BCD4",
          "#FF9800",
          "#8BC34A",
          "#795548",
          "#9C27B0",
          "#607D8B",
        ],
        borderWidth: 1,
      },
    ],
  });
  const chartOptions = {
    plugins: {
      datalabels: {
        color: "#ffffff",
        formatter: function (value) {
          return Math.round(value);
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const { data: salesData } = await Api.get("/sales", { headers });
    const { data: expensesData } = await Api.get("/expenses", { headers });
    const { data: sleevesBidsData } = await Api.get("/sleevesBids", {
      headers,
    });

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
    setFetchingData({
      salesData: salesData,
      expensesData: expensesData,
      sleevesBidsData: sleevesBidsData,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await sendRequest(getAccessToken());
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshMyToken();
            try {
              await sendRequest(newAccessToken);
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
              message: ".. תקלה ביבוא הנתונים",
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
    fetchData();
  }, []);

  const getChart = (data) => {
    if (report?.month && report?.year) {
      setChartData({
        labels: Object?.keys(
          getDataByTotals(data)[report?.year]?.find(
            (item) => item.month === report?.month
          )?.dayInTheMonth || []
        ),
        datasets: [
          {
            ...chartData.datasets[0],
            data: Object?.values(
              getDataByTotals(data)[report?.year]?.find(
                (item) => item.month === report?.month
              )?.dayInTheMonth || []
            ),
          },
        ],
      });
    } else if (report?.year) {
      setChartData({
        labels: getDataByTotals(data)[report?.year]?.map((item) => item.month),
        datasets: [
          {
            ...chartData.datasets[0],
            data: getDataByTotals(data)[report?.year]?.map(
              (item) => item.totalAmount
            ),
          },
        ],
      });
    }
  };
  const showChartHandler = () => {
    report?.type === "expensesCharts" || report?.type === "/expenses"
      ? getChart(fetchingData?.expensesData)
      : report?.type === "sleevesBidsCharts" || report?.type === "/sleevesBids"
      ? getChart(fetchingData?.sleevesBidsData)
      : getChart(fetchingData?.salesData);
    setShowChart(true);
  };
  return (
    <div className="chart-container">
      {report?.year && <button onClick={showChartHandler}>הצג מידע</button>}
      {showChart && (
        <Bar
          data={chartData}
          options={chartOptions}
          plugins={[ChartDataLabels]}
        />
      )}
    </div>
  );
}

export default ChartPage;
