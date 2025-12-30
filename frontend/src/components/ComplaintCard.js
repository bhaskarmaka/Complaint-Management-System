function ComplaintCard({ title, description, category, priority, status, children }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>

        <span className="badge bg-info me-2">{category}</span>
<span className="badge bg-warning me-2 text-dark">{priority}</span>
<span className={`badge ${status === "Resolved" ? "bg-success" : status === "In Progress" ? "bg-primary" : "bg-secondary"}`}>
  {status}
</span>


        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

export default ComplaintCard;
