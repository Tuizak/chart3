import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const ExchangeRateBarChart = () => {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const API_KEY = "ed13c16991d1e40afeeb1abf";

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
        );
        if (response.status === 200) {
          setExchangeRates(response.data.conversion_rates);
        } else {
          throw new Error("Failed to fetch exchange rates");
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        setError("Error fetching exchange rates. Please try again later.");
      }
    };

    fetchExchangeRates();
  }, [API_KEY]);

  useEffect(() => {
    if (exchangeRates) {
      const renderChart = () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["USD a MXN", "MXN a USD"],
            datasets: [
              {
                label: "Paridad de Peso y Dólar",
                data: [exchangeRates.MXN, 1 / exchangeRates.MXN],
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 25,
                  },
                },
              },
            },
          },
        });
      };

      renderChart();
    }
  }, [exchangeRates]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!exchangeRates) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      <canvas id="exchangeRateChart" ref={chartRef} width={400} height={400}></canvas>
    </div>
  );
};

export default ExchangeRateBarChart;
