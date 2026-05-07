import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  return new Date(year, parseInt(month) - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getMonthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export default function Payments() {
  const { members, togglePayment, setPaymentFine, setPaymentAmount, isAdmin } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [amountInputs, setAmountInputs] = useState({});
  const [fineInputs, setFineInputs] = useState({});

  const monthKey = getMonthKey(year, month);
  const activeMembers = members.filter((m) => m.active);
  const paidCount = activeMembers.filter((m) => m.payments[monthKey]?.paid).length;

  useEffect(() => {
    setAmountInputs({});
    setFineInputs({});
  }, [monthKey]);

  const handlePaymentInputChange = (memberId, field, value) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (field === "amount") {
      setAmountInputs((prev) => ({ ...prev, [memberId]: cleaned }));
    } else {
      setFineInputs((prev) => ({ ...prev, [memberId]: cleaned }));
    }
  };

  const savePaymentValue = (memberId, field, value) => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue) || numberValue < 0) return;
    if (field === "amount") {
      setPaymentAmount(memberId, monthKey, numberValue);
      setAmountInputs((prev) => ({ ...prev, [memberId]: String(numberValue) }));
    } else {
      setPaymentFine(memberId, monthKey, numberValue);
      setFineInputs((prev) => ({ ...prev, [memberId]: String(numberValue) }));
    }
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div style={{ padding: "1.25rem", paddingBottom: "6rem" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontSize: "1.3rem", marginBottom: "1rem" }}>
        Monthly Payments
      </h2>

      {/* Month Selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--card)", borderRadius: 12, padding: "0.75rem 1rem", marginBottom: "1rem", border: "1px solid rgba(217,119,6,0.2)" }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer" }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--text)" }}>
            {getMonthLabel(monthKey)}
          </div>
          <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 2 }}>
            {paidCount}/{activeMembers.length} paid
          </div>
        </div>
        <button onClick={nextMonth} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer" }}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 20, height: 8, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: activeMembers.length > 0 ? `${(paidCount / activeMembers.length) * 100}%` : "0%", background: "linear-gradient(90deg, #d97706, #b45309)", borderRadius: 20, transition: "width 0.4s" }} />
      </div>


      {/* Members Payment List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr repeat(3, minmax(70px, auto))", gap: "0.75rem", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.04)", color: "var(--muted)", fontSize: "0.8rem" }}>
          <div>Name</div>
          <div style={{ textAlign: "right" }}>Amount</div>
          <div style={{ textAlign: "right" }}>Fine</div>
          <div style={{ textAlign: "right" }}>Total</div>
        </div>
        {activeMembers.map((member) => {
          const paymentData = member.payments[monthKey] || { paid: false, fine: 0, amount: 0 };
          const amountValue = amountInputs[member.id] !== undefined ? amountInputs[member.id] : String(paymentData.amount || 0);
          const fineValue = fineInputs[member.id] !== undefined ? fineInputs[member.id] : String(paymentData.fine || 0);
          const totalValue = (paymentData.amount || 0) + (paymentData.fine || 0);

          return (
            <div
              key={member.id}
              className="card"
              style={{ display: "grid", gridTemplateColumns: "1fr repeat(3, minmax(70px, auto))", gap: "0.75rem", alignItems: "center", padding: "0.9rem 1rem", transition: "opacity 0.2s", cursor: isAdmin ? "pointer" : "default" }}
              onClick={() => isAdmin && togglePayment(member.id, monthKey)}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{member.name}</div>
              </div>
              {isAdmin ? (
                <>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={amountValue}
                    onChange={(e) => handlePaymentInputChange(member.id, "amount", e.target.value)}
                    onBlur={() => savePaymentValue(member.id, "amount", amountValue)}
                    onKeyDown={(e) => e.key === "Enter" && savePaymentValue(member.id, "amount", amountValue)}
                    style={{ width: 90, fontSize: "0.9rem", padding: "0.55rem 0.75rem", borderRadius: 10, textAlign: "right" }}
                  />
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={fineValue}
                    onChange={(e) => handlePaymentInputChange(member.id, "fine", e.target.value)}
                    onBlur={() => savePaymentValue(member.id, "fine", fineValue)}
                    onKeyDown={(e) => e.key === "Enter" && savePaymentValue(member.id, "fine", fineValue)}
                    style={{ width: 90, fontSize: "0.9rem", padding: "0.55rem 0.75rem", borderRadius: 10, textAlign: "right" }}
                  />
                  <div style={{ textAlign: "right", fontWeight: 600, fontSize: "0.95rem" }}>
                    ₹{totalValue.toLocaleString("en-IN")}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: "right", color: "var(--text)", fontSize: "0.9rem" }}>
                    ₹{paymentData.amount.toLocaleString("en-IN")}
                  </div>
                  <div style={{ textAlign: "right", color: "var(--text)", fontSize: "0.9rem" }}>
                    ₹{paymentData.fine.toLocaleString("en-IN")}
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 600, fontSize: "0.95rem" }}>
                    ₹{totalValue.toLocaleString("en-IN")}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {activeMembers.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--muted)", padding: "3rem 1rem" }}>
          No active members
        </div>
      )}

      {!isAdmin && (
        <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.8rem", marginTop: "1.5rem", padding: "0.75rem", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
          Login as admin to mark payments
        </div>
      )}
    </div>
  );
}
