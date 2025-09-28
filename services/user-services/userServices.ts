import { axiosService } from "@/data/api/httpCommon";
import { UserVM } from "@/models/user/userVM";

// Login
export const loginServices = async (email: string, password: string) => {
  const response = await axiosService.post("login", { email, password });
  return response.data;
};

// Register
export const registerServices = async (body: UserVM) => {
  const response = await axiosService.post("register", body);
  return response.data;
};

// Verify
export const verifyServices = async () => {
  const response = await axiosService.get("verify"); // sends cookie automatically
  return response.data;
};


// Logout
export const logoutServices = async () => {
  const response = await axiosService.post("logout");
  return response.data;
};
