import { useEffect, useState } from "react";
import api from "../services/api";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";

function AgentDashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = () => {
    api.get("/complaints/agent/my")
      .then(res => setComplaints(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = (id, status) => {
    api.put(`/complaints/agent/update-status/${id}`, { status })
      .then(fetchComplaints)
      .catch(err => console.log(err));
  };

  return (
    <>
      <Navbar title="Agent Dashboard" />

      <div className="container mt-4">
        {complaints.length === 0 && (
          <p className="text-muted">No assigned complaints</p>
        )}

        {complaints.map(c => (
          <div key={c._id} className="card mb-3 p-3 shadow-sm">

            <h5>{c.title}</h5>
            <p>{c.description}</p>
            <p><b>User:</b> {c.userId?.name}</p>
            <p><b>Category:</b> {c.category}</p>
            <p><b>Priority:</b> {c.priority}</p>
            <p><b>Status:</b> {c.status}</p>

            <button
              className="btn btn-warning me-2"
              onClick={() => updateStatus(c._id, "In Progress")}
            >
              In Progress
            </button>

            <button
              className="btn btn-success"
              onClick={() => updateStatus(c._id, "Resolved")}
            >
              Resolve
            </button>

            <ChatBox
              complaintId={c._id}
              senderRole="agent"
              senderName="Agent"
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default AgentDashboard;
