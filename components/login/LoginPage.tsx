"use client";

import styles from "./login.module.css";
import { LoginForm } from "@/components/login/LoginForm";

export const LoginPage = () => {
  return (
    <div className={styles.homepageContainer}>
      <div className={styles.infoSection}>
        <h1>Welcome to Expense Tracker</h1>
        <b>
          Track your expenses easily, manage your budget, and get insights to
          save money. Start by logging in to access your personalized dashboard.
        </b>
      </div>

      <div className={styles.loginSection}>
        <h2>Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};
