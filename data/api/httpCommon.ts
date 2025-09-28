import axios from "axios";
import { BASE_URL } from "@/data/expenseTrackerAPI/expenseTrackerApi";

export const axiosService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});
