import { axiosService } from "@/data/api/httpCommon";
import { UserVM } from "@/models/user/userVM";

// Login
export const loginServices = async (email: string, password: string) => {
  const response = await axiosService.post("/api/login", { email, password });
  return response.data;
};

// Register
export const registerServices = async (body: UserVM) => {
  const response = await axiosService.post("/api/register", body);
  return response.data;
};

// Verify user
export const verifyServices = async () => {
  const response = await axiosService.get("/api/verify");
  return response.data;
};

// Logout
export const logoutServices = async () => {
  const response = await axiosService.post("/api/logout");
  return response.data;
};
