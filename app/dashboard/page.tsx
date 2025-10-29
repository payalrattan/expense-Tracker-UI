"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { LogoutForm } from "@/components/logout/Logout";
import { verifyServices } from "@/services/user-services/userServices";
import { Income } from "@/components/income/Income";
import { Expense } from "@/components/expenses/Expense";
import {Reports} from "@/components/Reports/Reports";
import SummaryDashboard from "./summary/page";
import styles from "@/app/page.module.css";

const ReportsComponent = Reports as ComponentType<unknown>;

// Define transaction types
interface Transaction {
  id?: string;
  amount: number;
  description?: string;
  date?: string;
}

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
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>(
    []
  );
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>(
    []
  );

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
              {["dashboard", "income", "expenses", "reports"].map((tab) => (
                <button
                  key={tab}
                  className={`${styles.navButton} ${
                    activeTab === tab ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
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
                onTotalIncome={(total: number, transactions: Transaction[]) => {
                  setTotalIncome(total);
                  setIncomeTransactions(transactions);
                }}
              />
            )}

            {activeTab === "expenses" && (
              <Expense
                onTotalExpense={(
                  total: number,
                  transactions: Transaction[]
                ) => {
                  setTotalExpense(total);
                  setExpenseTransactions(transactions);
                }}
              />
            )}

            {activeTab === "reports" && (
              <ReportsComponent
                incomeTransactions={incomeTransactions}
                expenseTransactions={expenseTransactions}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
