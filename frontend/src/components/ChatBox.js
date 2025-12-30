import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../socket";

function ChatBox({ complaintId, senderRole, senderName }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // 🔹 Join room for this complaint
    socket.emit("joinComplaint", complaintId);

    // 🔹 Load old messages from DB
    api.get(`/messages/${complaintId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.log(err));

    // 🔹 Listen for new messages (real-time)
    const handleReceive = (msg) => {
      if (msg.complaintId === complaintId) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [complaintId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const msg = {
      complaintId,
      text,
      senderRole,
      senderName
    };

    // 🔹 Emit real-time message
    socket.emit("sendMessage", msg);

    // 🔹 Persist message in DB
    await api.post("/messages", msg);

    setText("");
  };

  return (
    <div className="border rounded p-2 mt-3 bg-white">
      <h6 className="mb-2">Chat</h6>

      {/* 🔹 Messages */}
      <div style={{ height: 180, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.senderRole === senderRole ? "text-end" : "text-start"
            }`}
          >
            <small className="text-muted">
              {(m.senderRole || "user").toUpperCase()} ({m.senderName || "Unknown"})
            </small>

            <div
              className={`d-inline-block px-3 py-2 rounded ${
                (m.senderRole || "user") === "agent"
                  ? "bg-success text-white"
                  : m.senderRole === "user"
                  ? "bg-light"
                  : "bg-warning text-dark"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Input */}
      <div className="d-flex mt-2">
        <input
          className="form-control me-2"
          placeholder="Type message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
