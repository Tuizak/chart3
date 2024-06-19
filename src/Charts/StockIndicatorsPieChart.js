import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import Chart from "chart.js/auto";

const StockIndicatorsPieChart = () => {
  const [indicators, setIndicators] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const apiKey = "ed13c16991d1e40afeeb1abf";

  useEffect(() => {
    const fetchStockIndicators = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=${apiKey}`
        );
        if (response.status === 200) {
          const { MarketCapitalization, PERatio, DividendYield } = response.data;

          const data = {
            MarketCapitalization,
            PERatio,
            DividendYield,
          };

          setIndicators(data);
        } else {
          throw new Error("Failed to fetch stock indicators");
        }
      } catch (error) {
        console.error("Error fetching stock indicators:", error);
      }
    };

    fetchStockIndicators();
  }, [apiKey]);

  useEffect(() => {
    if (indicators && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      const labels = Object.keys(indicators);
      const data = Object.values(indicators);

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "Indicadores de Bolsa de Valores",
            data: data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#2ECC71",
              "#9B59B6",
              "#FFA726",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#2ECC71",
              "#9B59B6",
              "#FFA726",
            ],
          },
        ],
      };

      const options = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              fontSize: 16,
            },
          },
        },
      };

      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: options,
      });
    }
  }, [indicators]);

  if (!indicators) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      <h2>Indicadores de Bolsa de Valores</h2>
      <div style={{ position: "relative", height: "400px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default StockIndicatorsPieChart;
