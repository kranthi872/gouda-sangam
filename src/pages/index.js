import { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import Members from "@/components/Members";
import Lifts from "@/components/Lifts";
import Payments from "@/components/Payments";
import AdminLogin from "@/components/AdminLogin";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard onAdminLogin={() => setShowAdminLogin(true)} />;
      case "members": return <Members />;
      case "lifts": return <Lifts />;
      case "payments": return <Payments />;
      default: return <Dashboard onAdminLogin={() => setShowAdminLogin(true)} />;
    }
  };

  return (
    <>
      <Head>
        <title>Gouds Chitti</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", position: "relative" }}>
        <Navbar active={activeTab} setActive={setActiveTab} />
        <main>{renderPage()}</main>
        {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
      </div>
    </>
  );
}
