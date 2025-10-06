"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import styles from "@/components/income/incomeGraph.module.css";

interface IncomeGraphProps {
  incomes: { source: string; amount: number }[];
}

export function IncomeGraph({ incomes }: IncomeGraphProps) {
  const incomeData = incomes.reduce((acc: { source: string; amount: number }[], curr) => {
    const found = acc.find((item) => item.source === curr.source);
    if (found) {
      found.amount += curr.amount;
    } else {
      acc.push({ source: curr.source, amount: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className={styles.graphContainer}>
      <h3 className={styles.graphTitle}>Income Breakdown (Bar Chart)</h3>
      <BarChart
        width={500}
        height={300}
        data={incomeData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="source" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
