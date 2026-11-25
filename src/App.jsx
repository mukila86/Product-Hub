import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Products from "./Products";
import Login from "./Login";
import Admin from "./Admin";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="brand">🛍️ Product<span>Hub</span></div>
        <div className="nav-links">
          <NavLink to="/" end>Store</NavLink>
          {isAdmin ? (
            <NavLink to="/admin">Dashboard</NavLink>
          ) : (
            <NavLink to="/login">Admin Login</NavLink>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route
          path="/admin"
          element={isAdmin ? <Admin setIsAdmin={setIsAdmin} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;