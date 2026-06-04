import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { Users, TrendingUp, CreditCard, CheckCircle, AlertCircle, Shield } from "lucide-react";

function ChangePasswordModal({ onClose, onChangePassword }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setSuccess("");
      return;
    }
    if (!onChangePassword(currentPassword, newPassword)) {
      setError("Current password is incorrect.");
      setSuccess("");
      return;
    }
    setError("");
    setSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Change Admin Password</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>
            ×
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Current Password</label>
            <input className="input" type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setError(""); setSuccess(""); }} />
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>New Password</label>
            <input className="input" type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(""); setSuccess(""); }} />
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Confirm New Password</label>
            <input className="input" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); setSuccess(""); }} />
          </div>
          {error && <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>}
          {success && <p style={{ color: "#34d399", fontSize: "0.85rem" }}>{success}</p>}
          <button className="btn-gold" style={{ width: "100%" }} onClick={handleSubmit}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ onAdminLogin }) {
  const { totalMembers, paidThisMonth, total20kLifts, total50kLifts, members, lifts, isAdmin, currentMonth, finesThisMonth, collectedThisMonth, changeAdminPassword } = useApp();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const unpaidThisMonth = totalMembers - paidThisMonth;

  const recentLifts = [...lifts].reverse().slice(0, 5);

  const paymentPercent = totalMembers > 0 ? Math.round((paidThisMonth / totalMembers) * 100) : 0;

  return (
    <div style={{ padding: "1.25rem", paddingBottom: "6rem" }}>

      {/* Welcome Banner */}
      <div style={{ background: "linear-gradient(135deg, rgba(217,119,6,0.15), rgba(180,83,9,0.1))", border: "1px solid rgba(217,119,6,0.25)", borderRadius: 14, padding: "1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "var(--gold)", marginBottom: 4 }}>
              Gouds Chitti
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isAdmin ? (
            <button
              className="btn-outline"
              onClick={onAdminLogin}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}
            >
              <Shield size={14} /> Admin
            </button>
            ) : (
              <button
                className="btn-outline"
                onClick={() => setShowChangePassword(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}
              >
                <Shield size={14} /> Change Password
              </button>
            )}
          </div>
        </div>
      </div>

        {showChangePassword && (
          <ChangePasswordModal
            onClose={() => setShowChangePassword(false)}
            onChangePassword={changeAdminPassword}
          />
        )}

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1.25rem" }}>
        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ background: "rgba(217,119,6,0.15)", borderRadius: 8, padding: 6 }}>
              <Users size={18} color="var(--gold)" />
            </div>
            <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Total Members</span>
          </div>
          <div style={{ fontSize: "2rem", fontFamily: "'Playfair Display', serif", color: "var(--text)", lineHeight: 1 }}>
            {totalMembers}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ background: "rgba(52,211,153,0.15)", borderRadius: 8, padding: 6 }}>
              <CheckCircle size={18} color="#34d399" />
            </div>
            <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Paid This Month</span>
          </div>
          <div style={{ fontSize: "2rem", fontFamily: "'Playfair Display', serif", color: "#34d399", lineHeight: 1 }}>
            {paidThisMonth}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ background: "rgba(239,68,68,0.15)", borderRadius: 8, padding: 6 }}>
              <AlertCircle size={18} color="#f87171" />
            </div>
            <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Pending</span>
          </div>
          <div style={{ fontSize: "2rem", fontFamily: "'Playfair Display', serif", color: "#f87171", lineHeight: 1 }}>
            {unpaidThisMonth}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ background: "rgba(217,119,6,0.15)", borderRadius: 8, padding: 6 }}>
              <CreditCard size={18} color="var(--gold)" />
            </div>
            <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Collected</span>
          </div>
          <div style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display', serif", color: "var(--gold)", lineHeight: 1 }}>
            ₹{collectedThisMonth.toLocaleString("en-IN")}
          </div>
          {finesThisMonth > 0 && (
            <div style={{ color: "#fbbf24", fontSize: "0.75rem", marginTop: 4 }}>
              Includes ₹{finesThisMonth.toLocaleString("en-IN")} fine
            </div>
          )}
        </div>
      </div>

      {/* Lift Summary */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--gold)" }}>Lift Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ textAlign: "center", background: "rgba(217,119,6,0.08)", borderRadius: 10, padding: "1rem" }}>
            <div style={{ fontSize: "1.8rem", fontFamily: "'Playfair Display', serif", color: "var(--gold)" }}>{total20kLifts}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 4 }}>₹20,000 Lifts</div>
          </div>
          <div style={{ textAlign: "center", background: "rgba(217,119,6,0.08)", borderRadius: 10, padding: "1rem" }}>
            <div style={{ fontSize: "1.8rem", fontFamily: "'Playfair Display', serif", color: "#fbbf24" }}>{total50kLifts}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 4 }}>₹50,000 Lifts</div>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--gold)" }}>This Month's Progress</h3>
          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{paymentPercent}%</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, height: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${paymentPercent}%`, background: "linear-gradient(90deg, #d97706, #b45309)", borderRadius: 20, transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
          <span style={{ color: "#34d399", fontSize: "0.78rem" }}>✓ {paidThisMonth} paid</span>
          <span style={{ color: "#f87171", fontSize: "0.78rem" }}>✗ {unpaidThisMonth} pending</span>
        </div>
      </div>

      {/* Recent Lifts */}
      <div className="card">
        <h3 style={{ fontSize: "1rem", marginBottom: "0.85rem", color: "var(--gold)" }}>Recent Lifts</h3>
        {recentLifts.length === 0 ? (
          <p style={{ color: "var(--muted)", textAlign: "center", padding: "1rem", fontSize: "0.9rem" }}>No lifts recorded yet</p>
        ) : (
          recentLifts.map((lift) => (
            <div key={lift.id} className="table-row" style={{ padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{lift.memberName}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{lift.date}</div>
              </div>
              <div style={{ background: lift.type === "50k" ? "rgba(251,191,36,0.15)" : "rgba(217,119,6,0.15)", color: lift.type === "50k" ? "#fbbf24" : "var(--gold)", borderRadius: 6, padding: "3px 10px", fontSize: "0.8rem", fontWeight: 700 }}>
                ₹{lift.amount.toLocaleString("en-IN")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
