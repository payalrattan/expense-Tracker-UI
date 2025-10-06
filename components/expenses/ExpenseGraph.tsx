"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import styles from "@/components/expenses/ExpenseGraph.module.css";

interface ExpenseGraphProps {
  expenses: { category: string; amount: number }[];
}

export function ExpensesGraph({ expenses }: ExpenseGraphProps) {
  // Group expenses by category and sum amounts
  const expenseData = expenses.reduce((acc: any[], curr) => {
    const found = acc.find((item) => item.category === curr.category);
    if (found) {
      found.amount += curr.amount;
    } else {
      acc.push({ category: curr.category, amount: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className={styles.graphContainer}>
      <h3 className={styles.graphTitle}>Expense Breakdown (Bar Chart)</h3>
      <BarChart
        width={500}
        height={300}
        data={expenseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#ff7f7f" />
      </BarChart>
    </div>
  );
}
