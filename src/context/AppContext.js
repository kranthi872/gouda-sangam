import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth, firebaseEnabled } from "@/lib/firebase";

const ADMIN_PASSWORD = "GoudsChitti@2024";

const normalizePayments = (payments = {}) =>
  Object.fromEntries(
    Object.entries(payments).map(([month, value]) => {
      if (typeof value === "boolean") {
        return [month, { paid: value, fine: 0, amount: value ? 1000 : 0 }];
      }
      if (value && typeof value === "object") {
        const paid = !!value.paid;
        const amount = Number(value.amount);
        return [month, {
          paid,
          fine: Number(value.fine) || 0,
          amount: !Number.isNaN(amount) ? amount : paid ? 1000 : 0,
        }];
      }
      return [month, { paid: false, fine: 0, amount: 0 }];
    })
  );

const defaultMembers = [
  { id: 1, name: "Ravi Kumar", phone: "9876543210", joinDate: "2024-01-01", active: true, payments: { "2024-01": { paid: true, amount: 1000, fine: 0 }, "2024-02": { paid: true, amount: 1000, fine: 0 }, "2024-03": { paid: true, amount: 1000, fine: 0 }, "2024-04": { paid: false, amount: 0, fine: 0 }, "2024-05": { paid: false, amount: 0, fine: 0 } } },
  { id: 2, name: "Suresh Reddy", phone: "9876543211", joinDate: "2024-01-01", active: true, payments: { "2024-01": { paid: true, amount: 1000, fine: 0 }, "2024-02": { paid: true, amount: 1000, fine: 0 }, "2024-03": { paid: false, amount: 0, fine: 0 }, "2024-04": { paid: true, amount: 1000, fine: 0 }, "2024-05": { paid: false, amount: 0, fine: 0 } } },
  { id: 3, name: "Mahesh Goud", phone: "9876543212", joinDate: "2024-01-01", active: true, payments: { "2024-01": { paid: true, amount: 1000, fine: 0 }, "2024-02": { paid: false, amount: 0, fine: 0 }, "2024-03": { paid: true, amount: 1000, fine: 0 }, "2024-04": { paid: true, amount: 1000, fine: 0 }, "2024-05": { paid: true, amount: 1000, fine: 0 } } },
  { id: 4, name: "Vijay Nayak", phone: "9876543213", joinDate: "2024-02-01", active: true, payments: { "2024-02": { paid: true, amount: 1000, fine: 0 }, "2024-03": { paid: true, amount: 1000, fine: 0 }, "2024-04": { paid: true, amount: 1000, fine: 0 }, "2024-05": { paid: false, amount: 0, fine: 0 } } },
  { id: 5, name: "Kiran Goud", phone: "9876543214", joinDate: "2024-02-01", active: true, payments: { "2024-02": { paid: true, amount: 1000, fine: 0 }, "2024-03": { paid: false, amount: 0, fine: 0 }, "2024-04": { paid: true, amount: 1000, fine: 0 }, "2024-05": { paid: true, amount: 1000, fine: 0 } } },
];

const defaultLifts = [
  { id: 1, memberId: 1, memberName: "Ravi Kumar", amount: 20000, date: "2024-03-15", month: "2024-03", type: "20k" },
  { id: 2, memberId: 3, memberName: "Mahesh Goud", amount: 50000, date: "2024-04-10", month: "2024-04", type: "50k" },
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [lifts, setLifts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const membersRef = db ? collection(db, "members") : null;
  const liftsRef = db ? collection(db, "lifts") : null;

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setLoaded(true);
      return;
    }

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setIsAdmin(true);
        localStorage.setItem("gc_isAdmin", "true");
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!firebaseEnabled || !db || !membersRef) {
      const savedMembers = localStorage.getItem("gc_members");
      const savedLifts = localStorage.getItem("gc_lifts");
      setMembers(
        savedMembers
          ? JSON.parse(savedMembers).map((member) => ({
              ...member,
              payments: normalizePayments(member.payments),
            }))
          : defaultMembers.map((member) => ({
              ...member,
              payments: normalizePayments(member.payments),
            }))
      );
      setLifts(savedLifts ? JSON.parse(savedLifts) : defaultLifts);
      setLoaded(true);
      return;
    }

    const unsubMembers = onSnapshot(membersRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        payments: normalizePayments(doc.data().payments),
      }));
      setMembers(data.length > 0 ? data : defaultMembers);
      localStorage.setItem("gc_members", JSON.stringify(data));
    });

    const unsubLifts = onSnapshot(liftsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setLifts(data.length > 0 ? data : defaultLifts);
      localStorage.setItem("gc_lifts", JSON.stringify(data));
    });

    setLoaded(true);

    return () => {
      unsubMembers();
      unsubLifts();
    };
  }, [firebaseEnabled, db, membersRef, liftsRef]);

  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const saveToFirebase = async (membersData, liftsData) => {
    if (!firebaseEnabled || !db) return;
    try {
      const batch = writeBatch(db);

      membersData.forEach((member) => {
        const memberRef = doc(db, "members", String(member.id));
        batch.set(memberRef, member);
      });

      liftsData.forEach((lift) => {
        const liftRef = doc(db, "lifts", String(lift.id));
        batch.set(liftRef, lift);
      });

      await batch.commit();
    } catch (error) {
      console.error("Firebase batch write failed", error);
    }
  };

  const loginAdmin = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("gc_isAdmin", "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem("gc_isAdmin");
    if (firebaseEnabled && auth) {
      signOut(auth).catch((err) => console.error("Sign out failed", err));
    }
  };

  const addMember = (member) => {
    const newMember = { ...member, id: Date.now(), payments: {} };
    const updated = [...members, newMember];
    setMembers(updated);
    save("gc_members", updated);
    saveToFirebase(updated, lifts);
  };

  const updateMember = (id, updates) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setMembers(updated);
    save("gc_members", updated);
    saveToFirebase(updated, lifts);
  };

  const deleteMember = (id) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    save("gc_members", updated);
    if (firebaseEnabled && db) {
      deleteDoc(doc(db, "members", String(id))).catch((err) => console.error(err));
    }
    saveToFirebase(updated, lifts);
  };

  const togglePayment = (memberId, monthKey) => {
    const updated = members.map((m) => {
      if (m.id === memberId) {
        const payments = normalizePayments(m.payments);
        const existing = payments[monthKey] || { paid: false, fine: 0, amount: 0 };
        return {
          ...m,
          payments: {
            ...payments,
            [monthKey]: {
              ...existing,
              paid: !existing.paid,
              amount: existing.amount || (!existing.paid ? 1000 : 0),
            },
          },
        };
      }
      return m;
    });
    setMembers(updated);
    save("gc_members", updated);
    saveToFirebase(updated, lifts);
  };

  const setPaymentFine = (memberId, monthKey, fine) => {
    const updated = members.map((m) => {
      if (m.id === memberId) {
        const payments = normalizePayments(m.payments);
        const existing = payments[monthKey] || { paid: false, fine: 0, amount: 0 };
        return {
          ...m,
          payments: {
            ...payments,
            [monthKey]: { ...existing, fine: fine || 0 },
          },
        };
      }
      return m;
    });
    setMembers(updated);
    save("gc_members", updated);
    saveToFirebase(updated, lifts);
  };

  const setPaymentAmount = (memberId, monthKey, amount) => {
    const updated = members.map((m) => {
      if (m.id === memberId) {
        const payments = normalizePayments(m.payments);
        const existing = payments[monthKey] || { paid: false, fine: 0, amount: 0 };
        return {
          ...m,
          payments: {
            ...payments,
            [monthKey]: { ...existing, amount: amount || 0 },
          },
        };
      }
      return m;
    });
    setMembers(updated);
    save("gc_members", updated);
    saveToFirebase(updated, lifts);
  };

  const addLift = (lift) => {
    const newLift = { ...lift, id: Date.now() };
    const updated = [...lifts, newLift];
    setLifts(updated);
    save("gc_lifts", updated);
    saveToFirebase(members, updated);
  };

  const deleteLift = (id) => {
    const updated = lifts.filter((l) => l.id !== id);
    setLifts(updated);
    save("gc_lifts", updated);
    if (firebaseEnabled && db) {
      deleteDoc(doc(db, "lifts", String(id))).catch((err) => console.error(err));
    }
    saveToFirebase(members, updated);
  };

  // Stats
  const totalMembers = members.filter((m) => m.active).length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const paidThisMonth = members.filter((m) => m.active && m.payments[currentMonth]?.paid).length;
  const finesThisMonth = members.reduce(
    (sum, member) => sum + (member.payments[currentMonth]?.fine || 0),
    0
  );
  const collectedThisMonth = members.reduce(
    (sum, member) => {
      const payment = member.payments[currentMonth];
      return sum + (payment?.paid ? (payment.amount || 0) : 0) + (payment?.fine || 0);
    },
    0
  );
  const total20kLifts = lifts.filter((l) => l.type === "20k").length;
  const total50kLifts = lifts.filter((l) => l.type === "50k").length;

  return (
    <AppContext.Provider
      value={{
        members,
        lifts,
        isAdmin,
        loaded,
        loginAdmin,
        logoutAdmin,
        addMember,
        updateMember,
        deleteMember,
        togglePayment,
        setPaymentFine,
        setPaymentAmount,
        addLift,
        deleteLift,
        totalMembers,
        paidThisMonth,
        finesThisMonth,
        collectedThisMonth,
        total20kLifts,
        total50kLifts,
        currentMonth,
      }}
    >
      {loaded ? children : null}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
