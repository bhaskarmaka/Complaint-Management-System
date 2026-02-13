import { useEffect, useState } from "react";
import api from "../services/api";
import ComplaintCard from "../components/ComplaintCard";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const fetchComplaints = () => {
    api.get("/complaints")
      .then(res => setComplaints(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createComplaint = async () => {
    if (!form.title || !form.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/complaints/create", form);
      setForm({ title: "", description: "" });
      setShowForm(false);
      fetchComplaints(); // refresh list
    } catch (err) {
      console.log(err);
      alert("Failed to create complaint");
    }
  };

  return (
    <>
      <Navbar title="User Dashboard" />

      <div className="container mt-4">

        {/* Header + Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>My Complaints</h3>

          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "New Complaint"}
          </button>
        </div>

        {/* Complaint Form */}
        {showForm && (
          <div className="card p-3 mb-4 shadow-sm">
            <h5 className="mb-3">Create Complaint</h5>

            <input
              className="form-control mb-3"
              placeholder="Complaint Title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Describe your issue..."
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />

            <button
              className="btn btn-success"
              onClick={createComplaint}
            >
              Submit Complaint
            </button>
          </div>
        )}

        {/* Complaint List */}
        {complaints.length === 0 && (
          <p className="text-muted">No complaints found</p>
        )}

        {complaints.map(c => (
          <ComplaintCard key={c._id} {...c}>
            <ChatBox
              complaintId={c._id}
              senderRole="user"
              senderName="User"
            />
          </ComplaintCard>
        ))}

      </div>
    </>
  );
}

export default Dashboard;
