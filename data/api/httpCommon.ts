import axios from "axios";
// import { NEXT_PUBLIC_API_URL } from "@/data/expenseTrackerAPI/expenseTrackerApi";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

export const axiosService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
