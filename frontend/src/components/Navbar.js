import { useNavigate } from "react-router-dom";

function Navbar({ title }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <span className="navbar-brand mb-0 h5">{title}</span>

      <button className="btn btn-outline-light btn-sm" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
