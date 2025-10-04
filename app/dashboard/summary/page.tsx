"use client";

import { useEffect, useState } from "react";
import { Income } from "@/components/income/Income";
import { Expenses } from "@/components/expenses/Expenses";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

export function SummaryDashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    
  }, []);

  const balance = totalIncome - totalExpenses;

  // Pie chart data
  const chartData = {
    labels: ["Income", "Expenses", "Balance"],
    datasets: [
      {
        data: [totalIncome, totalExpenses, balance],
        backgroundColor: ["#38a169", "#e53e3e", "#3182ce"],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div>
      <h2>Summary Dashboard</h2>

      <div>
        <div>
          <strong>Total Income:-</strong>
          {totalIncome}
        </div>

        <div>
          <strong>Total Expenses:-</strong>
          {totalExpenses}
        </div>
        <div>
          <strong>Total Balance:-</strong>
          {balance}
        </div>
      </div>

      <div>
        <h3>Income vs Expenses</h3>
        <Pie data={chartData} />
      </div>

    
      <div style={{ display: "none" }}>
        <Income onTotalIncome={setTotalIncome} />
        <Expenses onTotalExpense={setTotalExpenses} />
      </div>
    </div>
  );
}
