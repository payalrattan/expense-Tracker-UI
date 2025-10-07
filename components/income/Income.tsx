"use client";

import { useEffect, useState } from "react";
import { IncomeVM } from "@/models/income/incomeVM";
import {
  getIncome,
  createIncome,
  updateIncomeById,
  deleteIncomeById,
} from "@/services/income-services/incomeServices";
import { IncomeGraph } from "./IncomeGraph";
import { Form } from "@/components/formComponent/Form";
import styles from "@/components/income/income.module.css";

interface IncomeProps {
  onTotalIncome?: (total: number, transactions: IncomeVM[]) => void;
}

export const Income: React.FC<IncomeProps> = ({ onTotalIncome }) => {
  const [incomes, setIncomes] = useState<IncomeVM[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [updateIncome, setUpdateIncome] = useState<IncomeVM | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [otherSource, setOtherSource] = useState<string>("");

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
    date: "",
  });

  const incomeSources = ["Salary", "Freelance", "Investment", "Gift", "Bonus", "Other"];

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) {
      setMessage("No user logged in");
      return;
    }
    setUserId(id);
    fetchIncomes(id, filterSource, sortOption);
  }, [filterSource, sortOption]);

  const fetchIncomes = async (id: string, source = "", sort = "") => {
    try {
      let incomeData: IncomeVM[] = await getIncome();
      incomeData = incomeData.filter((income) => income.userId === id);

      if (source) {
        if (source === "Other") {
          incomeData = incomeData.filter((income) => !incomeSources.includes(income.source));
        } else {
          incomeData = incomeData.filter((income) => income.source === source);
        }
      }

      if (sort === "amountAsc") incomeData.sort((a, b) => a.amount - b.amount);
      if (sort === "amountDesc") incomeData.sort((a, b) => b.amount - a.amount);
      if (sort === "dateAsc") incomeData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      if (sort === "dateDesc") incomeData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setIncomes(incomeData);
      const total = incomeData.reduce((sum, currentIncome) => sum + currentIncome.amount, 0);
      setTotalIncome(total);
      if (onTotalIncome) onTotalIncome(total, incomeData);

      setMessage(incomeData.length === 0 ? "No incomes found for selected source." : null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch incomes");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      setMessage("Amount must be a valid number");
      return;
    }

    if (!formData.description.trim()) {
      setMessage("Description cannot be empty");
      return;
    }

    if (formData.source === "Other" && !otherSource.trim()) {
      setMessage("Please enter a custom source");
      return;
    }

    const incomeData: IncomeVM = {
      ...formData,
      amount,
      userId,
      date: new Date(formData.date).toISOString(),
      source: formData.source === "Other" ? otherSource : formData.source,
    };

    try {
      if (updateIncome) {
        await updateIncomeById(updateIncome._id!, incomeData);
        setMessage("Income updated!");
      } else {
        await createIncome(incomeData);
        setMessage("Income added!");
      }

      setUpdateIncome(null);
      setFormData({ amount: "", source: "", description: "", date: "" });
      setOtherSource("");
      fetchIncomes(userId, filterSource, sortOption);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !userId || !confirm("Are you sure?")) return;
    try {
      await deleteIncomeById(id);
      setMessage("Income deleted successfully!");
      fetchIncomes(userId, filterSource, sortOption);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete income");
    }
  };

  const handleEdit = (income: IncomeVM) => {
    setUpdateIncome(income);
    setFormData({
      amount: income.amount.toString(),
      source: incomeSources.includes(income.source) ? income.source : "Other",
      description: income.description || "",
      date: new Date(income.date).toISOString().slice(0, 10),
    });
    setOtherSource(incomeSources.includes(income.source) ? "" : income.source);
  };

  return (
    <div className={styles.incomeContainer}>
      <h2>{updateIncome ? "Update Income" : "Add Income"}</h2>
      <Form
        type="income"
        categoriesOrSources={incomeSources}
        formData={formData}
        otherValue={otherSource}
        setOtherValue={setOtherSource}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        updateItem={!!updateIncome}
        message={message}
      />

      <div className={styles.incomeTable}>
        <label>Filter by Source:</label>
        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
          <option value="">All</option>
          {incomeSources.map((src) => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>

        <label>Sort by:</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">None</option>
          <option value="amountAsc">Amount (Low to High)</option>
          <option value="amountDesc">Amount (High to Low)</option>
          <option value="dateAsc">Date (Older to Newer)</option>
          <option value="dateDesc">Date (Newer to Older)</option>
        </select>

        <h3>Total Income: {totalIncome}</h3>

        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Source</th>
              <th>Description</th>
              <th>Date</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income._id}>
                <td>{income.amount}</td>
                <td>{income.source}</td>
                <td>{income.description}</td>
                <td>{new Date(income.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(income)}>Edit</button>
                  <button onClick={() => handleDelete(income._id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.graphSection}>
        <IncomeGraph incomes={incomes} />
      </div>
    </div>
  );
};
