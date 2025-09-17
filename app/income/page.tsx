"use client";

import { Income as IncomeComponent } from "@/components/income/Income";


export default function Income() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Total Income</h1>
      <IncomeComponent />
    </div>
  );
}
