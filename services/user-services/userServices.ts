// /services/user-services/userServices.ts
import { axiosService } from "@/data/api/httpCommon";
import { UserVM } from "@/models/user/userVM";

// Services for login
export const loginServices = async (email: string, password: string) => {
  const response = await axiosService.post("login", { email, password });
  console.log(response);
  return response.data;
};

//Register services
export const registerServices = async (body: UserVM) => {
  const response = await axiosService.post("register", body);
  console.log(response);
  return response.data;
};
