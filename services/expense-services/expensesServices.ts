import { axiosService } from "@/data/api/httpCommon";
import { ExpensesVM } from "@/models/expences/expensesVM";

// service to get all expenses
export const getExpenses = async () => {
  const result = await axiosService.get("expenses");
  console.log(result);
  console.log(result.data);
  return result.data;
};

// service to get expense by id
export const getExpenseById = async (id: string | number) => {
  const path = `expenses/by-id/${id}`;
  const result = await axiosService.get(path);
  return result.data;
};

// create expense
export const createExpense = async (body: ExpensesVM) => {
  try {
    const response = await axiosService.post("expenses", body);
    console.log("expense created", response.data);
    return response.data;
  } catch (error) {
    console.log("Error creating expense", error);
    throw error;
  }
};

// delete expense by id
export const deleteExpenseById = async (id: string | number) => {
  const path = `expenses/${id}`;
  const result = await axiosService.delete(path);
  return result.data;
};
