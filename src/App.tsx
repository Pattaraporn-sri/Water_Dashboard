// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   BrowserRouter,
// } from "react-router-dom";
import { useEffect } from "react";
import { getFilterData } from "./services/api";
import "./App.css";
import Dashboard from "./pages/Dashboard";
// import WaterManagement from "./pages/WaterManagement";

function App() {
  useEffect(() => {
    async function loadFilter() {
      const data = await getFilterData();

      console.log(data);
    }

    loadFilter();
  }, []);

  return (
    <div>
      <Dashboard/>
    </div>
  );
}

export default App;
