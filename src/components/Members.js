import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Phone, Trash2, Edit2, X, Check, User } from "lucide-react";

function AddMemberModal({ onClose }) {
  const { addMember } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", joinDate: new Date().toISOString().slice(0, 10), active: true });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.phone.trim()) return alert("Name and phone are required!");
    if (!/^\d{10}$/.test(form.phone)) return alert("Enter a valid 10-digit phone number!");
    addMember(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Add New Member</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Full Name *</label>
            <input className="input" placeholder="e.g. Ravi Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Phone Number *</label>
            <input className="input" placeholder="10-digit mobile number" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} />
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Join Date</label>
            <input className="input" type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
          </div>
          <button className="btn-gold" style={{ width: "100%", marginTop: 4 }} onClick={handleSubmit}>
            Add Member
          </button>
        </div>
      </div>
    </div>
  );
}

function EditMemberModal({ member, onClose }) {
  const { updateMember } = useApp();
  const [form, setForm] = useState({ name: member.name, phone: member.phone, active: member.active });

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) return alert("Name and phone are required!");
    updateMember(member.id, form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Edit Member</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Full Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "0.8rem", display: "block", marginBottom: 4 }}>Phone Number</label>
            <input className="input" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ accentColor: "var(--gold)", width: 16, height: 16 }} />
            <label htmlFor="active" style={{ color: "var(--text)", fontSize: "0.9rem" }}>Active Member</label>
          </div>
          <button className="btn-gold" style={{ width: "100%", marginTop: 4 }} onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Members() {
  const { members, deleteMember, isAdmin } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  );

  const handleDelete = (member) => {
    if (confirm(`Delete ${member.name}? This cannot be undone.`)) {
      deleteMember(member.id);
    }
  };

  return (
    <div style={{ padding: "1.25rem", paddingBottom: "6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontSize: "1.3rem" }}>Members</h2>
        {isAdmin && (
          <button className="btn-gold" onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      <input
        className="input"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />

      <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
        {filtered.length} member{filtered.length !== 1 ? "s" : ""} found
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {filtered.map((member) => (
          <div key={member.id} className="card" style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "1rem" }}>
            <div style={{ background: "rgba(217,119,6,0.15)", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <User size={20} color="var(--gold)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {member.name}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Phone size={12} /> {member.phone}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={member.active ? "badge-paid" : "badge-unpaid"}>
                {member.active ? "Active" : "Inactive"}
              </span>
              {isAdmin && (
                <>
                  <button onClick={() => setEditMember(member)} style={{ background: "rgba(217,119,6,0.1)", border: "none", borderRadius: 6, padding: 6, cursor: "pointer", color: "var(--gold)" }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(member)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 6, padding: 6, cursor: "pointer", color: "#f87171" }}>
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 1rem" }}>
          No members found
        </div>
      )}

      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} />}
      {editMember && <EditMemberModal member={editMember} onClose={() => setEditMember(null)} />}
    </div>
  );
}
