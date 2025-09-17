"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Income {
  _id: string;
  amount: number;
  source: string;
  description: string;
  date: string;
  userId: string;
}

export const Income = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("id");
      if (userId) fetchIncome(userId);
    }
  }, []);

  // Fetch incomes for logged-in user
  const fetchIncome = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:5002/api/income/user/${userId}`);
      setIncomes(res.data);
    } catch (err) {
      console.error("Failed to fetch income:", err);
    }
  };

  // Add new income
  const handleAddIncome = async () => {
    if (!amount || !source || !date) {
      alert("Please fill in amount, source, and date.");
      return;
    }

    if (typeof window === "undefined") return;
    const userId = localStorage.getItem("id");
    if (!userId) return;

    try {
      const newIncome = { amount: Number(amount), source, description, date, userId };
      const res = await axios.post("http://localhost:5002/api/income", newIncome);

      if (res.status === 201 || res.status === 200) {
        setIncomes([...incomes, res.data]); // update income list
        setAmount("");
        setSource("");
        setDescription("");
        setDate("");
      } else {
        alert("Failed to add income");
      }
    } catch (err) {
      console.error("Error adding income:", err);
    }
  };

  return (
    <div>
      <h2>Your Income</h2>

      {/* Add Income Form */}
      <div>
        <h3>Add New Income</h3>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleAddIncome}>Add Income</button>
      </div>

      {/* Income Table */}
      {incomes.length === 0 ? (
        <p>No income found. Add some!</p>
      ) : (
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((inc) => (
              <tr key={inc._id}>
                <td>{inc.source}</td>
                <td>{inc.amount}</td>
                <td>{inc.description}</td>
                <td>{new Date(inc.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
