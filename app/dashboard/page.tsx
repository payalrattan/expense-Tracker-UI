"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutForm } from "@/components/logout/Logout";
import { verifyServices } from "@/services/user-services/userServices";
import { Income } from "@/components/income/Income";
import { Expenses } from "@/components/expenses/Expenses";
import { Reports } from "@/components/Reports/Reports"; 
import { SummaryDashboard } from "./summary/page";
import styles from "@/app/page.module.css";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    username: string;
    _id: string;
    profilePic?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "income" | "expenses" | "reports"
  >("dashboard");
  const [showLogout, setShowLogout] = useState(false);

  // Track total income and expense
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Store individual transactions for Reports
  const [incomeTransactions, setIncomeTransactions] = useState<any[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<any[]>([]);

  // Verify user login
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
    <div className={styles.container}>
      <div className={styles.main}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div>
            <div className={styles.profile}>
              <div style={{ position: "relative" }}>
                {showLogout && <div className={styles.logoutDropdown}></div>}
              </div>
              <h2 className={styles.username}>Welcome {user?.username}</h2>
            </div>
            <nav style={{ marginTop: 48 }}>
              <button
                className={`${styles.navButton} ${
                  activeTab === "dashboard" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
              <button
                className={`${styles.navButton} ${
                  activeTab === "income" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("income")}
              >
                Income
              </button>
              <button
                className={`${styles.navButton} ${
                  activeTab === "expenses" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("expenses")}
              >
                Expenses
              </button>
              <button
                className={`${styles.navButton} ${
                  activeTab === "reports" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("reports")}
              >
                Reports
              </button>
              <LogoutForm />
            </nav>
          </div>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.contentWrapper}>
            {activeTab === "dashboard" && <SummaryDashboard />}

            {activeTab === "income" && (
              <Income
                onTotalIncome={(total, transactions) => {
                  setTotalIncome(total);
                  setIncomeTransactions(transactions);
                }}
              />
            )}

            {activeTab === "expenses" && (
              <Expenses
                onTotalExpense={(total, transactions) => {
                  setTotalExpense(total);
                  setExpenseTransactions(transactions);
                }}
              />
            )}

            {activeTab === "reports" && (
              <Reports
              
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
