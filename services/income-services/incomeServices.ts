import axios from "axios";
import { IncomeVM } from "@/models/income/incomeVM";

const BASE_URL = "http://localhost:5002/api/income";

export const incomeService = {
  // Add a new income
  addIncome: async (income: IncomeVM) => {
    const response = await axios.post(BASE_URL, income);
    return response.data;
  },

  // Get all incomes
  getAllIncome: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Get income by ID
  getIncomeById: async (id: string) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get incomes for a specific user
  getUserIncome: async (userId: string) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  // Update income by ID
  updateIncome: async (id: string, updatedIncome: Partial<IncomeVM>) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedIncome);
    return response.data;
  },

  // Delete income by ID
  deleteIncome: async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
