"use client";
import { useEffect, useState } from "react";
import { Income } from "@/components/income/Income";
import { Expenses } from "@/components/expenses/expenses";
import { getIncome } from "@/services/income-services/incomeServices";
import { getExpenses } from "@/services/expense-services/expensesServices";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function SummaryDashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  type Transaction = { date: string; amount: number };

  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [expenseData, setExpenseData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [incomes, expenses] = await Promise.all([
        getIncome(),
        getExpenses(),
      ]);

      // Collect all unique dates from incomes and expenses
      const allDatesSet = new Set<string>();

      incomes.forEach((inc: Transaction) =>
        allDatesSet.add(new Date(inc.date).toISOString().slice(0, 10))
      );
      expenses.forEach((exp: Transaction) =>
        allDatesSet.add(new Date(exp.date).toISOString().slice(0, 10))
      );
      const allDates = Array.from(allDatesSet).sort();

      // Sum income and expense for each date
      const incomeByDate: Record<string, number> = {};
      const expenseByDate: Record<string, number> = {};

      allDates.forEach((date) => {
        incomeByDate[date] = incomes
          .filter(
            (inc: Transaction) =>
              new Date(inc.date).toISOString().slice(0, 10) === date
          )
          .reduce(
            (sum: number, inc: Transaction) => sum + (inc.amount || 0),
            0
          );
        expenseByDate[date] = expenses
          .filter(
            (exp: Transaction) =>
              new Date(exp.date).toISOString().slice(0, 10) === date
          )
          .reduce(
            (sum: number, exp: Transaction) => sum + (exp.amount || 0),
            0
          );
      });

      setLabels(allDates);
      setIncomeData(allDates.map((date) => incomeByDate[date]));
      setExpenseData(allDates.map((date) => expenseByDate[date]));
    };
    fetchData();
  }, []);

  const balance = totalIncome - totalExpenses;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#38a169",
        backgroundColor: "rgba(56,161,105,0.08)",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: expenseData,
        borderColor: "#e53e3e",
        backgroundColor: "rgba(229,62,62,0.08)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 32,
        background: "linear-gradient(135deg, #e3fcec 0%, #e3e7ed 100%)",
        fontFamily: "Segoe UI, Arial, sans-serif",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 32,
          color: "#3182ce",
          marginBottom: 32,
          letterSpacing: "1px",
        }}
      >
        Summary Dashboard
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 32,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: "#e6fffa",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(56,161,105,0.08)",
            padding: 24,
            textAlign: "center",
            border: "2px solid #38a169",
          }}
        >
          <strong style={{ color: "#38a169", fontSize: 18 }}>
            Total Income
          </strong>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginTop: 8,
              color: "#38a169",
            }}
          >
            {totalIncome}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: "#fff5f5",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(229,62,62,0.08)",
            padding: 24,
            textAlign: "center",
            border: "2px solid #e53e3e",
          }}
        >
          <strong style={{ color: "#e53e3e", fontSize: 18 }}>
            Total Expenses
          </strong>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginTop: 8,
              color: "#e53e3e",
            }}
          >
            {totalExpenses}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: "#ebf8ff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(49,130,206,0.08)",
            padding: 24,
            textAlign: "center",
            border: "2px solid #3182ce",
          }}
        >
          <strong style={{ color: "#3182ce", fontSize: 18 }}>
            Total Balance
          </strong>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginTop: 8,
              color: "#3182ce",
            }}
          >
            {balance}
          </div>
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(49,130,206,0.08)",
          padding: 32,
          marginBottom: 32,
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 22,
            color: "#3182ce",
            marginBottom: 24,
          }}
        >
          All Transactions
        </h3>
        <Line data={chartData} />
      </div>
      {/* Hidden components to get totals */}
      <div style={{ display: "none" }}>
        <Income onTotalIncome={setTotalIncome} />
        <Expenses onTotalExpense={setTotalExpenses} />
      </div>
    </div>
  );
}
