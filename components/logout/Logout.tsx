"use client";

import { useRouter } from "next/navigation";
import { logoutServices } from "@/services/user-services/userServices";

export const LogoutForm = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutServices();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};
