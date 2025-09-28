"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutForm } from "@/components/logout/Logout";
import { verifyServices } from "@/services/user-services/userServices";
import { Income } from "@/components/income/Income";
import { Expenses } from "@/components/expenses/expenses";
import SummaryDashboard from "./summarydashboard/page";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    username: string;
    _id: string;
    profilePic?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "income" | "expenses"
  >("dashboard");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await verifyServices();
        setUser(res.user);
        setLoading(false);
      } catch (err) {
        console.error("Verify failed:", err);
        router.push("/login");
      }
    };
    checkLogin();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #e3fcec 0%, #e3e7ed 100%)",
        fontFamily: "Segoe UI, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left Panel */}
        <div
          style={{
            width: "260px",
            background: "linear-gradient(135deg, #38a169 0%, #3182ce 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 16px",
            minWidth: 220,
            boxShadow: "2px 0 16px rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Profile Pic */}
              <div style={{ position: "relative" }}>
                <img
                  src={
                    user?.profilePic ||
                    "https://ui-avatars.com/api/?name=" +
                      (user?.username || "U")
                  }
                  alt="Profile"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "2px solid #fff",
                    background: "#fff",
                  }}
                  onClick={() => setShowLogout((prev) => !prev)}
                />
                {showLogout && (
                  <div
                    style={{
                      position: "absolute",
                      top: 64,
                      left: 0,
                      background: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      zIndex: 10,
                      minWidth: 120,
                    }}
                  ></div>
                )}
              </div>
              <h2
                style={{
                  margin: 0,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 22,
                }}
              >
                {user?.username}
              </h2>
            </div>
            <nav style={{ marginTop: 48 }}>
              <button
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: 18,
                  background:
                    activeTab === "dashboard"
                      ? "linear-gradient(90deg, #38a169 60%, #3182ce 100%)"
                      : "transparent",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 0",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 18,
                  transition: "background 0.2s",
                }}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
              <button
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: 18,
                  background:
                    activeTab === "income"
                      ? "linear-gradient(90deg, #38a169 60%, #3182ce 100%)"
                      : "transparent",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 0",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 18,
                  transition: "background 0.2s",
                }}
                onClick={() => setActiveTab("income")}
              >
                Income
              </button>
              <button
                style={{
                  display: "block",
                  width: "100%",
                  background:
                    activeTab === "expenses"
                      ? "linear-gradient(90deg, #38a169 60%, #3182ce 100%)"
                      : "transparent",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 0",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 18,
                  transition: "background 0.2s",
                }}
                onClick={() => setActiveTab("expenses")}
              >
                Expenses
              </button>
              <LogoutForm />
            </nav>
          </div>
        </div>
        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            padding: "32px 0",
            overflow: "auto",
            background: "linear-gradient(135deg, #e3fcec 0%, #e3e7ed 100%)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "0 32px",
              height: "100%",
              flex: 1,
            }}
          >
            {activeTab === "dashboard" && <SummaryDashboard />}
            {activeTab === "income" && <Income />}
            {activeTab === "expenses" && <Expenses />}
          </div>
        </div>
      </div>
      {/* Fixed Footer */}
      <footer
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100vw",
          background: "#fff",
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
          color: "#666",
          fontSize: 16,
          padding: "16px 0",
          zIndex: 100,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
        }}
      >
        &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
}
