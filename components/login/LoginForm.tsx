"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginServices } from "@/services/user-services/userServices";
import Link from "next/link";
import styles from "./login.module.css";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // for non-blocking messages

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const user = await loginServices(email, password);

      // save user info
      localStorage.setItem("id", user.id);
      localStorage.setItem("username", user.username);

      // show welcome message in UI
      setMessage(`Welcome, ${user.username}! Redirecting to dashboard...`);

      // reset form
      setEmail("");
      setPassword("");

      // redirect after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleLogin}>
      {message && (
        <p style={{ color: "green", marginBottom: "10px" }}>{message}</p>
      )}

      <label>Email:</label>
      <input
        type="email"
        placeholder="E-mail address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password:</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link href="/register">Do not have an account? Sign up</Link>
    </form>
  );
};
