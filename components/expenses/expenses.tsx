"use client";
import { useEffect, useState } from "react";
import { ExpensesVM } from "@/models/expenses/expensesVM";
import {
  getExpenses,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
} from "@/services/expense-services/expensesServices";
import { ExpensesGraph } from "./ExpenseGraph";
import {Form} from "@/components/formComponent/Form";
import styles from "./expense.module.css";

export const Expenses = ({
  onTotalExpense,
}: { onTotalExpense?: (total: number) => void } = {}) => {
  const [expenses, setExpenses] = useState<ExpensesVM[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [updateExpenseItem, setUpdateExpenseItem] = useState<ExpensesVM | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [otherCategory, setOtherCategory] = useState<string>("");

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const expenseCategories = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Health",
    "Other",
  ];

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) {
      setMessage("No user logged in");
      return;
    }
    setUserId(id);
    fetchExpenses(id, filterCategory, sortOption);
  }, [filterCategory, sortOption]);

  const fetchExpenses = async (id: string, category = "", sort = "") => {
    try {
      let expenseData: ExpensesVM[] = await getExpenses();

      // Filter by user
      expenseData = expenseData.filter((exp) => exp.userId === id);

      // Filter by category
      if (category) {
        if (category === "Other") {
          expenseData = expenseData.filter(
            (exp) => !expenseCategories.includes(exp.category)
          );
        } else {
          expenseData = expenseData.filter((exp) => exp.category === category);
        }
      }

      // Sort
      if (sort === "amountAsc") expenseData.sort((a, b) => a.amount - b.amount);
      if (sort === "amountDesc")
        expenseData.sort((a, b) => b.amount - a.amount);
      if (sort === "dateAsc")
        expenseData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      if (sort === "dateDesc")
        expenseData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      const total = expenseData.reduce(
        (sum, current) => sum + current.amount,
        0
      );
      setExpenses(expenseData);
      setTotalExpense(total);
      if (onTotalExpense) onTotalExpense(total);
      setMessage(
        expenseData.length === 0
          ? "No expenses found for selected category."
          : null
      );
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch expenses");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (!formData.description || formData.description.trim() === "") {
      setMessage("Description cannot be empty or only spaces");
      return;
    }
    if (formData.category === "Other" && !otherCategory.trim()) {
      setMessage("Please enter a custom category");
      return;
    }

    const expenseData: ExpensesVM = {
      ...formData,
      amount,
      userId,
      date: new Date(formData.date).toISOString(),
      category:
        formData.category === "Other" ? otherCategory : formData.category,
    };

    try {
      if (updateExpenseItem) {
        await updateExpenseById(updateExpenseItem._id!, expenseData);
        setMessage("Expense updated!");
      } else {
        await createExpense(expenseData);
        setMessage("Expense added!");
      }

      setUpdateExpenseItem(null);
      setFormData({ amount: "", category: "", description: "", date: "" });
      setOtherCategory("");
      fetchExpenses(userId, filterCategory, sortOption);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !userId || !confirm("Are you sure?")) return;
    try {
      await deleteExpenseById(id);
      setMessage("Expense deleted successfully!");
      fetchExpenses(userId, filterCategory, sortOption);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete expense");
    }
  };

  const handleEdit = (expense: ExpensesVM) => {
    setUpdateExpenseItem(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expenseCategories.includes(expense.category)
        ? expense.category
        : "Other",
      description: expense.description || "",
      date: new Date(expense.date).toISOString().slice(0, 10),
    });
    if (!expenseCategories.includes(expense.category))
      setOtherCategory(expense.category);
    else setOtherCategory("");
  };

  return (
    <div className={styles.expensesContainer}>
      <h2>{updateExpenseItem ? "Update Expense" : "Add Expense"}</h2>
      <Form
        type="expense"
        categoriesOrSources={expenseCategories}
        formData={formData}
        otherValue={otherCategory}
        setOtherValue={setOtherCategory}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        updateItem={updateExpenseItem}
        message={message}
      />

      <div>
        <label>Filter by Category: </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All</option>
          {expenseCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">None</option>
          <option value="amountAsc">Amount (Low to High)</option>
          <option value="amountDesc">Amount (High to Low)</option>
          <option value="dateAsc">Date (Older to Newer)</option>
          <option value="dateDesc">Date (Newer to Older)</option>
        </select>
      </div>

      <h3>Total Expense: {totalExpense}</h3>
      <div className={styles.expenseTable}>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.amount}</td>
                <td>{exp.category}</td>
                <td>{exp.description}</td>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(exp)}>Edit</button>
                  <button onClick={() => handleDelete(exp._id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.expenseGraphSection}>
        <ExpensesGraph expenses={expenses} />
      </div>
    </div>
  );
};
