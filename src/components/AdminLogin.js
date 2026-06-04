import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Shield, X, Eye, EyeOff } from "lucide-react";

export default function AdminLogin({ onClose }) {
  const { loginAdmin } = useApp();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = () => {
    if (loginAdmin(password)) {
      onClose();
    } else {
      setError("Wrong password. Try again.");
      setPassword("");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "rgba(217,119,6,0.2)", borderRadius: "50%", padding: 10 }}>
              <Shield size={22} color="var(--gold)" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem" }}>Admin Login</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Enter admin password</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <input
            className="input"
            type={show ? "text" : "password"}
            placeholder="Admin Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoFocus
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            onClick={() => setShow(!show)}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

        <button className="btn-gold" style={{ width: "100%" }} onClick={handleLogin}>
          Login as Admin
        </button>
      </div>
    </div>
  );
}
