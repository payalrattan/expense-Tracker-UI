import { axiosService } from "@/data/api/httpCommon";
import { ExpensesVM } from "@/models/expenses/expensesVM";

// Service to get all expenses
export const getExpenses = async () => {
  const result = await axiosService.get("expenses");
  return result.data; // returns array of expenses
};

// Service to get expense by ID
export const getExpenseById = async (id: string | number) => {
  const path = `expenses/${id}`;
  const result = await axiosService.get(path);
  return result.data; // returns single expense object
};

// Service to create a new expense
export const createExpense = async (body: ExpensesVM) => {
  try {
    const response = await axiosService.post("expenses", body);
    console.log("Expense created", response.data);
    return response.data;
  } catch (error) {
    console.log("Error creating expense", error);
    throw error;
  }
};

// Service to delete expense by ID
export const deleteExpenseById = async (id: string) => {
  const path = `expenses/${id}`;
  const result = await axiosService.delete(path);
  return result.data;
};

// Service to update expense
export const updateExpenseById = async (id: string, expense: ExpensesVM) => {
  const response = await axiosService.put(`expenses/${id}`, expense);
  return response.data;
};

// Get expenses by category
export const getExpensesByCategory = async (category: string) => {
  const response = await axiosService.get(`expenses/category/${category}`);
  return response.data;
};

// Get all expenses of a specific user
export const getUserExpenses = async (userId: string) => {
  const response = await axiosService.get(`expenses/user/${userId}`);
  return response.data;
};
