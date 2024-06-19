import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const StockComparisonChart = () => {
  const [bmvData, setBmvData] = useState(null);
  const [sp500Data, setSp500Data] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const corsProxy = "https://cors-anywhere.herokuapp.com/";
        const bmvUrl = `${corsProxy}https://query1.finance.yahoo.com/v8/finance/chart/^MXX?range=1mo&interval=1d`;
        const sp500Url = `${corsProxy}https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?range=1mo&interval=1d`;

        const [bmvResponse, sp500Response] = await Promise.all([
          axios.get(bmvUrl),
          axios.get(sp500Url),
        ]);

        if (bmvResponse.status === 200 && sp500Response.status === 200) {
          const bmvTimestamps = bmvResponse.data.chart.result[0].timestamp;
          const bmvClosingPrices = bmvResponse.data.chart.result[0].indicators.quote[0].close;

          const sp500Timestamps = sp500Response.data.chart.result[0].timestamp;
          const sp500ClosingPrices = sp500Response.data.chart.result[0].indicators.quote[0].close;

          const bmvDates = bmvTimestamps.map((timestamp) =>
            new Date(timestamp * 1000).toLocaleDateString()
          );
          const sp500Dates = sp500Timestamps.map((timestamp) =>
            new Date(timestamp * 1000).toLocaleDateString()
          );

          setBmvData({
            dates: bmvDates,
            closingPrices: bmvClosingPrices,
          });

          setSp500Data({
            dates: sp500Dates,
            closingPrices: sp500ClosingPrices,
          });

          setLoading(false);
        } else {
          throw new Error("Failed to fetch stock data");
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const renderChart = () => {
      if (bmvData && sp500Data) {
        const ctx = document.getElementById("stockComparisonChart");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: bmvData.dates,
            datasets: [
              {
                label: "BMV (IPC)",
                data: bmvData.closingPrices,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: false,
              },
              {
                label: "S&P 500",
                data: sp500Data.closingPrices,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: false,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
              },
            },
            plugins: {
              legend: {
                labels: {
                  fontSize: 16,
                },
              },
            },
          },
        });
      }
    };

    renderChart();
  }, [bmvData, sp500Data]);

  return (
    <div>
      <canvas id="stockComparisonChart" width={800} height={400}></canvas>
    </div>
  );
};

export default StockComparisonChart;
