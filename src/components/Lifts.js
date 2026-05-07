import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, TrendingUp, Trash2, X } from "lucide-react";

function AddLiftModal({ onClose }) {
  const { members, addLift } = useApp();
  const activeMembers = members.filter((m) => m.active);
  const [form, setForm] = useState({
    memberId: "",
    memberName: "",
    amount: "20000",
    type: "20k",
    date: new Date().toISOString().slice(0, 10),
    month: new Date().toISOString().slice(0, 7),
  });

  const handleMemberChange = (e) => {
    const member = activeMembers.find((m) => m.id === parseInt(e.target.value));
    if (member) setForm({ ...form, memberId: member.id, memberName: member.name });
  };

  const handleTypeChange = (type) => {
    setForm({ ...form, type, amount: type === "20k" ? "20000" : "50000" });
  };

  const handleSubmit = () => {
    if (!form.memberId) return alert("Please select a member!");
    addLift({ ...form, memberId: parseInt(form.memberId), amount: parseInt(form.amount) });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Record Lift</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Member *</label>
            <select className="input" value={form.memberId} onChange={handleMemberChange} style={{ cursor: "pointer" }}>
              <option value="">-- Select Member --</option>
              {activeMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Lift Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {["20k", "50k"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  style={{
                    padding: "0.7rem",
                    borderRadius: 8,
                    border: `2px solid ${form.type === type ? "var(--gold)" : "rgba(255,255,255,0.1)"}`,
                    background: form.type === type ? "rgba(217,119,6,0.15)" : "transparent",
                    color: form.type === type ? "var(--gold)" : "var(--muted)",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  ₹{type === "20k" ? "20,000" : "50,000"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Date</label>
            <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, month: e.target.value.slice(0, 7) })} />
          </div>
          <button className="btn-gold" style={{ width: "100%", marginTop: 4 }} onClick={handleSubmit}>
            Record Lift
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Lifts() {
  const { lifts, deleteLift, isAdmin } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = lifts.filter((l) => filter === "all" || l.type === filter);
  const sorted = [...filtered].reverse();

  const total20k = lifts.filter((l) => l.type === "20k").reduce((s, l) => s + l.amount, 0);
  const total50k = lifts.filter((l) => l.type === "50k").reduce((s, l) => s + l.amount, 0);

  return (
    <div style={{ padding: "1.25rem", paddingBottom: "6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontSize: "1.3rem" }}>Lifts</h2>
        {isAdmin && (
          <button className="btn-gold" onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1rem" }}>
        <div className="stat-card">
          <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: 6 }}>Total ₹20K Lifts</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "var(--gold)" }}>
            {lifts.filter((l) => l.type === "20k").length}
          </div>
          <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 2 }}>₹{total20k.toLocaleString("en-IN")}</div>
        </div>
        <div className="stat-card">
          <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: 6 }}>Total ₹50K Lifts</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#fbbf24" }}>
            {lifts.filter((l) => l.type === "50k").length}
          </div>
          <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 2 }}>₹{total50k.toLocaleString("en-IN")}</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {["all", "20k", "50k"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              border: `1px solid ${filter === f ? "var(--gold)" : "rgba(255,255,255,0.1)"}`,
              background: filter === f ? "rgba(217,119,6,0.15)" : "transparent",
              color: filter === f ? "var(--gold)" : "var(--muted)",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            {f === "all" ? "All" : `₹${f === "20k" ? "20,000" : "50,000"}`}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {sorted.map((lift) => (
          <div key={lift.id} className="card" style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ background: lift.type === "50k" ? "rgba(251,191,36,0.15)" : "rgba(217,119,6,0.15)", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={18} color={lift.type === "50k" ? "#fbbf24" : "var(--gold)"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{lift.memberName}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 2 }}>{lift.date} · {lift.month}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: lift.type === "50k" ? "#fbbf24" : "var(--gold)", fontSize: "1rem" }}>
                ₹{lift.amount.toLocaleString("en-IN")}
              </span>
              {isAdmin && (
                <button onClick={() => deleteLift(lift.id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 6, padding: 6, cursor: "pointer", color: "#f87171" }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 1rem" }}>
          No lifts recorded yet
        </div>
      )}

      {showAdd && <AddLiftModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
