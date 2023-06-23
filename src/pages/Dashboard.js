//import layout from "antd/es/layout/layout";
import "../styles/Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom"; //use to create dynamic application
import Layout from "../components/Layout/Layout";

function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation()


  return (
    
    
    <Layout>
    <div className="App">
      <div className="container mt-5 d-flex justify-content-center">
      <button className="btn-func" onClick={() => navigate("")}>
        Package Management
      </button>

      <button className="btn-func" onClick={() => navigate("")}>
      Service Management
      </button>

      <button className="btn-func" onClick={() => navigate("")}>
      Schedule Management
      </button>

      <button className="btn-func" onClick={() => navigate("/login")}>
      Finance Management
      </button>

      </div>

      <br />

      <div className="container mt-5 d-flex justify-content-center">
      <button className="btn-func" onClick={() => navigate("")}>
      Appointment Management
      </button>

      <button className="btn-func" onClick={() => navigate("")}>
      Inventory Management
      </button>

      <button className="btn-func" onClick={() => navigate("")}>
      Supplier Management
      </button>

      <button className="btn-func" onClick={() => navigate("")}>
      Employee Management
      </button>
      
      </div>
    </div>
    </Layout>
  );
}

export default Dashboard;