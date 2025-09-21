import { axiosService } from "@/data/api/httpCommon";
import { IncomeVM } from "@/models/income/incomeVM";

// Service to get all incomes
export const getIncome = async () => {
  const result = await axiosService.get("income");
  console.log(result);
  console.log(result.data);
  return result.data; // returns array of incomes
};

// Service to get income by ID
export const getIncomeById = async (id: string | number) => {
  const path = `income/by-id/${id}`;
  const result = await axiosService.get(path);
  return result.data; // returns single income object
};

// Service to create a new income
export const createIncome = async (body: IncomeVM) => {
  try {
    const response = await axiosService.post("income", body);
    console.log("Income created", response.data);
    return response.data;
  } catch (error) {
    console.log("Error creating income", error);
    throw error;
  }
};

// Service to delete income by ID
export const deleteIncomeById = async (id: string) => {
  const path = `income/${id}`;
  const result = await axiosService.delete(path);
  return result.data;
};

//service to update income
export const updateIncomeById = async (id: string, income: IncomeVM) => {
  const response = await axiosService.put(`/income/${id}`, income);
  return response.data;
};

// get incomes by source 
export const getIncomeBySource = async (source: string) => {
  const response = await axiosService.get(`/income/source/${source}`);
  return response.data;
};
