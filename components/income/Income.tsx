"use client";
import { useEffect, useState, FormEvent } from "react";
//getting all services
import {
  getIncome,
  createIncome,
  updateIncomeById,
  deleteIncomeById,
  getIncomeBySource,
} from "@/services/income-services/incomeServices";
import { IncomeVM } from "@/models/income/incomeVM";
import styles from "./Income.module.css";

export const Income = () => {
  const [incomes, setIncomes] = useState<IncomeVM[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>("");
  const [updateIncome, setUpdateIncome] = useState<IncomeVM | null>(null);

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Fetch all incomes
  const fetchIncomes = async () => {
    try {
      const incomesResult = await getIncome();
      console.log(incomesResult);
      setIncomes(incomesResult);
      calculateTotal(incomesResult);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch incomes.");
    }
  };

  // Filter incomes by source
  const fetchBySource = async (source: string) => {
    try {
      if (!source) {
        fetchIncomes(); // show all income if "All" is selected
      } else {
        const sourceResult = await getIncomeBySource(source);
        console.log(sourceResult);
        setIncomes(sourceResult);
        calculateTotal(sourceResult);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch income by source.");
    }
  };

  const calculateTotal = (data: IncomeVM[]) => {
    const totalIncome = data.reduce(
      (sum, currentIncome) => sum + currentIncome.amount,
      0
    );
    setTotalIncome(totalIncome);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop page refresh

    // get form values
    const form = e.currentTarget;
    const formData = new FormData(form);

    // build income object
    const incomeData: IncomeVM = {
      amount: Number(formData.get("amount")),
      source: formData.get("source") as string,
      description: (formData.get("description") as string) || "",
      date: formData.get("date") as string,
      userId: localStorage.getItem("id") || "",
    };

    try {
      if (updateIncome) {
        // update income
        await updateIncomeById(updateIncome._id!, incomeData);
        setMessage(" Income updated!");
        setUpdateIncome(null);
      } else {
        // add new income
        await createIncome(incomeData);
        setMessage("Income added!");
      }

      form.reset(); // clear form fields
      fetchIncomes(); // refresh list
    } catch (err) {
      console.error(err);
      setMessage(" Something went wrong.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !confirm("Are you sure you want to delete this income?")) return;

    try {
      await deleteIncomeById(id);
      setMessage("Income deleted successfully!");
      fetchIncomes();
    } catch (err) {
      console.log(err);
      setMessage("Failed to delete income.");
    }
  };

  const handleUpdate = (income: IncomeVM) => {
    setUpdateIncome(income);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2 className={styles.heading}>
          {updateIncome ? "Update Income" : "Add Income"}
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Amount</label>
          <input
            className={styles.input}
            type="number"
            name="amount"
            placeholder="amount"
            required
            defaultValue={updateIncome?.amount || ""}
          />

          <label className={styles.label}>Source</label>
          <select
            className={styles.input}
            name="source"
            required
            defaultValue={updateIncome?.source || ""}
          >
            <option value="" disabled>
              Select source
            </option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Investment">Investment</option>
            <option value="Gift">Gift</option>
            <option value="Bonus">Bonus</option>
          </select>

          <label className={styles.label}>Description</label>
          <input
            className={styles.input}
            type="text"
            name="description"
            placeholder="Description"
            defaultValue={updateIncome?.description || ""}
          />

          <label className={styles.label}>Date</label>
          <input
            className={styles.input}
            type="date"
            name="date"
            defaultValue={
              updateIncome
                ? new Date(updateIncome.date).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10)
            }
            required
          />

          <button className={styles.button} type="submit">
            {updateIncome ? "Update Income" : "Add Income"}
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>

      <div className={styles.tableSection}>
        <h2 className={styles.heading}>Income Details</h2>

        <label className={styles.label}>Filter by Source:</label>
        <select
          className={styles.input}
          value={filterSource}
          onChange={(e) => {
            const selected = e.target.value;
            setFilterSource(selected);
            fetchBySource(selected);
          }}
        >
          <option value="">All</option>
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Investment">Investment</option>
          <option value="Gift">Gift</option>
          <option value="Bonus">Bonus</option>
        </select>

        <h3 className={styles.totalIncome}>Total Income: {totalIncome} €</h3>

        {incomes.length === 0 ? (
          <p>No incomes yet.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income._id}>
                  <td>{income.source}</td>
                  <td>{income.amount}</td>
                  <td>{income.description}</td>
                  <td>{new Date(income.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => handleUpdate(income)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(income._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
