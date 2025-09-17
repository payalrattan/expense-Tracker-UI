"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css"; // relative path to your CSS module

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5002/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store user info in localStorage
        localStorage.setItem("id", data.id);
        localStorage.setItem("name", data.name); // <-- important
        alert(`Welcome, ${data.name}!`);
        router.push("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className={styles.homepageContainer}>
      {/* Left side: Welcome / Info */}
      <div className={styles.infoSection}>
        <h1>Welcome to Expense Tracker</h1>
        <p>
          Track your expenses easily, manage your budget, and get insights to
          save money. Start by logging in to access your personalized dashboard.
        </p>
      </div>

      {/* Right side: Login */}
      <div className={styles.loginSection}>
        <h2>Login</h2>
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Submit</button>
        <Link href="/register">Create account</Link>
      </div>
    </div>
  );
};
