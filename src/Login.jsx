import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      navigate("/admin");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-left">
        <h1>🛍️ ProductHub</h1>
        <p>Manage your products, track your stock and grow your business.</p>
      </div>

      <form className="login-right" onSubmit={handleLogin}>
        <h2>Welcome Back 👋</h2>
        <p className="sub">Login to your admin dashboard</p>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn-primary full">Login</button>
      </form>
    </div>
  );
}

export default Login;