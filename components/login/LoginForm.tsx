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

  //function to handle login submit button
  const handleLogin = async () => {
    try {
      const user = await loginServices(email, password);
      console.log(user);
      localStorage.setItem("id", user.id);
      localStorage.setItem("name", user.username);
      alert(`Welcome, ${user.username}!`);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (err) {
      alert("Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <form className={styles.loginForm}>
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
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="button" onClick={handleLogin}>
        Submit
      </button>

      <Link href="/register">Do not have an account?Sign up</Link>
    </form>
  );
};
