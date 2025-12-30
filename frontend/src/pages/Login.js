import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "agent") navigate("/agent");
      else navigate("/dashboard");

    } catch (err) {
      alert("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h4 className="text-center mb-3">Complaint System Login</h4>

        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={login}>
          Login
        </button>

        <p className="text-center mt-3">
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
