"use client";

import { useRouter } from "next/navigation";
import { logoutServices } from "@/services/user-services/userServices";
import styles from "./LogoutForm.module.css"; 

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

  return <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>;
};
