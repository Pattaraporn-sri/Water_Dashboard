import "./App.css";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { getFilterData } from "./services/api";


function App() {

  useEffect(() => {

    async function loadFilter() {

      const data = await getFilterData();

      console.log(data);

    }

    loadFilter();

  }, []);
  
  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
