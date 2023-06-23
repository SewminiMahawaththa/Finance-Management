import {Routes,Route, Navigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
   <>
   <Routes>
    <Route path="/dashboard" element={
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    } 
  />
  <Route path="/" element={<HomePage />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/report" element={<Report />} />
   </Routes>
   </>
  );
}

export function ProtectedRoutes(props){
  if(localStorage.getItem("user")){
    return props.children;
  }else{
    return <Navigate to="/login" />;
  }
}

export default App;
