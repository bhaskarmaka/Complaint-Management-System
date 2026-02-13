import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
  Legend
} from "recharts";

function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/admin")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="container mt-4">

      {/* ================= KPI SECTION ================= */}
      <div className="row text-center mb-4">

        {/* Total Complaints */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 border-0">
            <h6 className="text-muted">Total Complaints</h6>
            <h3 className="text-primary">
              {data.totalComplaints}
            </h3>
          </div>
        </div>

        {/* Resolved */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 border-0">
            <h6 className="text-muted">Resolved</h6>
            <h3 className="text-success">
              {data.byStatus?.find(s => s._id === "Resolved")?.count || 0}
            </h3>
          </div>
        </div>

        {/* Open */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 border-0">
            <h6 className="text-muted">Open</h6>
            <h3 className="text-warning">
              {data.byStatus?.find(s => s._id === "Open")?.count || 0}
            </h3>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3 border-0">
            <h6 className="text-muted">⭐ Avg Resolution Time</h6>

            <h4 className="text-success fw-bold">
              {data.avgResolutionTime
                ? data.avgResolutionTime < 1
                ? `${(data.avgResolutionTime * 60).toFixed(0)} Minutes`
                : `${data.avgResolutionTime.toFixed(2)} Hours`
                : "No Data"}
            </h4>
          </div>
        </div>
      </div>

      {/* ================= END KPI SECTION ================= */}


      {/* ================= CHARTS SECTION ================= */}
      
      <div className="row">

        {/* Category Chart */}
        <div className="col-md-6 mb-4">
          <h5>Complaints by Category</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byCategory}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Chart */}
        <div className="col-md-6 mb-4">
          <h5>Complaints by Priority</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.byPriority}
                dataKey="count"
                nameKey="_id"
                outerRadius={100}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Agent Performance Chart */}
      {data.agentPerformance && (
        <div className="mt-5">
          <h5>Agent Performance</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.agentPerformance}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAssigned" fill="#0d6efd" name="Total Assigned" />
              <Bar dataKey="resolved" fill="#198754" name="Resolved" />

            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}

export default AdminAnalytics;
