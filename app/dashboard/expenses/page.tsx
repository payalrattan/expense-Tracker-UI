"use client";

import { Expenses } from "@/components/expenses/expenses";
// import { useState } from "react";

export default function ExpensePage() {
  // const [totalExpenses, setTotalExpenses] = useState(0);

  return (
    <div>
      <h1>Expense Page</h1>
      <Expenses/>
    </div>
  );
}
