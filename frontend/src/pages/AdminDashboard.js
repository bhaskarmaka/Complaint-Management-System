import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import AdminAnalytics from "../components/AdminAnalytics";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);

  const fetchData = async () => {
    try {
      const c = await api.get("/complaints/admin/all");
      const a = await api.get("/users/agents");
      setComplaints(c.data);
      setAgents(a.data);
    } catch (err) {
      console.log("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignAgent = (complaintId, agentId) => {
    api
      .put(`/complaints/admin/assign-agent/${complaintId}`, { agentId })
      .then(fetchData)
      .catch(err => console.log(err));
  };

  return (
    <>
      <Navbar title="Admin Dashboard" />

      <div className="container mt-4">

        {/* 🔥 Analytics Section (Industrial Upgrade) */}
        <AdminAnalytics />

        <hr className="my-4" />

        <h4 className="mb-3">All Complaints</h4>

        {complaints.map(c => (
          <div key={c._id} className="card mb-3 p-3 shadow-sm">
            <h5>{c.title}</h5>
            <p>Status: <b>{c.status}</b></p>

            <select
              className="form-select"
              onChange={(e) => assignAgent(c._id, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Assign Agent</option>
              {agents.map(a => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        ))}

      </div>
    </>
  );
}

export default AdminDashboard;
