import React, { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { chart as ChartJS } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { FetchingStatus } from "../../utils/context";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";

function ChartPage({ report, updateChart }) {
  const navigate = useNavigate();
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [fetchingData, setFetchingData] = useState([]);
  const [valuesAndLabels, setValuesAndLabels] = useState({
    labels: [],
    values: [],
  });

  const [chartData, setChartData] = useState({
    labels: valuesAndLabels.labels,
    datasets: [
      {
        label: "Monthly Sales",
        data: valuesAndLabels.values,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const collReq =
      report?.type === "expensesChart" || report?.type === "/expenses"
        ? "/expenses"
        : "/sales";
    const { data } = await Api.get(collReq, { headers });

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
    setFetchingData(data);
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
    if (report?.month && report.year) {
      setChartData({
        labels: data
          .filter((item) => {
            const month =
              new Date(item.date).getMonth() + 1 < 10
                ? `0${new Date(item.date).getMonth() + 1}`
                : new Date(item.date).getMonth() + 1;

            return (
              month == report?.month &&
              new Date(item.date).getFullYear() === report?.year
            );
          })
          .map((item) => new Date(item.date).getDate().toString()),
        datasets: [
          {
            ...chartData.datasets[0], // Preserve other dataset properties
            data: data
              .filter((item) => {
                const month =
                  new Date(item.date).getMonth() + 1 < 10
                    ? `0${new Date(item.date).getMonth() + 1}`
                    : new Date(item.date).getMonth() + 1;

                return (
                  month == report?.month &&
                  new Date(item.date).getFullYear() === report?.year
                );
              })
              .map((item) => item.totalAmount),
          },
        ],
      });
    } else if (report?.month) {
      setChartData({
        labels: data
          .filter((item) => {
            const month =
              new Date(item.date).getMonth() + 1 < 10
                ? `0${new Date(item.date).getMonth() + 1}`
                : new Date(item.date).getMonth() + 1;
            return month == report?.month;
          })
          .map((item) => new Date(item.date).getDate()),
        datasets: [
          {
            ...chartData.datasets[0], // Preserve other dataset properties
            data: data
              .filter((item) => {
                const month =
                  new Date(item.date).getMonth() + 1 < 10
                    ? `0${new Date(item.date).getMonth() + 1}`
                    : new Date(item.date).getMonth() + 1;
                return month == report?.month;
              })
              .map((item) => item.totalAmount),
          },
        ],
      });
    } else {
      setChartData({
        labels: data
          .filter((item) => {
            const month =
              new Date(item.date).getMonth() + 1 < 10
                ? `0${new Date(item.date).getMonth() + 1}`
                : new Date(item.date).getMonth() + 1;
            return month == report?.month;
          })
          .map((item) => new Date(item.date).getMonth()),
        datasets: [
          {
            ...chartData.datasets[0], // Preserve other dataset properties
            data: data
              .filter((item) => {
                const month =
                  new Date(item.date).getMonth() + 1 < 10
                    ? `0${new Date(item.date).getMonth() + 1}`
                    : new Date(item.date).getMonth() + 1;
                return month == report?.month;
              })
              .map((item) => item.totalAmount),
          },
        ],
      });
    }
  };

  return (
    <div className="chart-container">
      <button
        onClick={() => {
          getChart(fetchingData);
        }}
      >
        chart
      </button>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}

export default ChartPage;
