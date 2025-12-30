import { useEffect, useState } from "react";
import api from "../services/api";
import ComplaintCard from "../components/ComplaintCard";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get("/complaints").then(res => setComplaints(res.data));
  }, []);

  return (
    <>
      <Navbar title="User Dashboard" />

      <div className="container mt-4">
        <h3 className="mb-4">My Complaints</h3>

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
