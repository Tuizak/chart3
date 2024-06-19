
import "./App.css";
import StockComparisonChart from "./Charts/StockComparisonChart";
import StockIndicatorsPieChart from "./Charts/StockIndicatorsPieChart";
import ExchangeRateBarChart from "./Charts/ExchangeRateBarChart";


function App() {
  return (
    <div className="App">
      <h1>
        Peso / Dolar
      </h1>
      <ExchangeRateBarChart />
      <h1>Indicadores mas importantes de la bolsa de valores</h1>
      <StockIndicatorsPieChart />
      <h1>Bolsa de valores mexicana y la bolsa de valores estadounidense</h1>
      <StockComparisonChart />
  
    </div>
  );
}

export default App;
