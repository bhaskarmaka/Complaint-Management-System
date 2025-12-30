import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function ComplaintForm() {
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState({
    title: "",
    description: ""
  });

  const handleChange = (e) => {
    setComplaint({ ...complaint, [e.target.name]: e.target.value });
  };

  const submitComplaint = async () => {
    try {
      await api.post("/complaints/create", complaint);
      alert("Complaint submitted successfully");
      navigate("/dashboard");
    } catch (error) {
      alert("Error submitting complaint");
    }
  };

  return (
    <div>
      <h2>Submit Complaint</h2>

      <input
        type="text"
        name="title"
        placeholder="Complaint Title"
        onChange={handleChange}
      />
      <br /><br />

      <textarea
        name="description"
        placeholder="Describe your issue"
        rows="5"
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={submitComplaint}>Submit Complaint</button>
    </div>
  );
}

export default ComplaintForm;
