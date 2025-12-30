import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const register = async () => {
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h4 className="text-center mb-3">User Registration</h4>

        <input className="form-control mb-3" placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input className="form-control mb-3" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <input type="password" className="form-control mb-3" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />

        <button className="btn btn-success w-100" onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
