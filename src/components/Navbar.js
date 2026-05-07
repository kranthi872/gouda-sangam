import { useApp } from "@/context/AppContext";
import { LayoutDashboard, Users, TrendingUp, CreditCard, LogOut, Shield } from "lucide-react";

export default function Navbar({ active, setActive }) {
  const { isAdmin, logoutAdmin } = useApp();

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "members", label: "Members", icon: Users },
    { key: "lifts", label: "Lifts", icon: TrendingUp },
    { key: "payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <>
      {/* Top Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid rgba(212,160,23,0.2)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontSize: "1.3rem", lineHeight: 1.1 }}>
            Gouds Chitti
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>FUND MANAGEMENT</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isAdmin && (
            <span style={{ background: "rgba(217,119,6,0.2)", color: "var(--gold)", border: "1px solid rgba(217,119,6,0.4)", borderRadius: "20px", padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Shield size={12} /> ADMIN
            </span>
          )}
          {isAdmin && (
            <button onClick={logoutAdmin} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem" }}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Nav for mobile */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--surface)", borderTop: "1px solid rgba(212,160,23,0.2)", display: "flex", justifyContent: "space-around", padding: "0.5rem 0.25rem", zIndex: 50 }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`nav-tab ${active === key ? "active" : ""}`}
            onClick={() => setActive(key)}
            style={{ flexDirection: "column", gap: 3, padding: "6px 12px" }}
          >
            <Icon size={20} />
            <span style={{ fontSize: "0.65rem" }}>{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
