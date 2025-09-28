import axios from "axios";
// import { NEXT_PUBLIC_API_URL } from "@/data/expenseTrackerAPI/expenseTrackerApi";

export const axiosService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});
