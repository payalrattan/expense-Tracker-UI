"use client";

import Link from "next/link";
import { useState } from "react";
import { registerServices } from "@/services/user-services/userServices";
import { UserVM } from "@/models/user/userVM";

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleRegister = async () => {
    const registerBody: UserVM = { username, email, password, rePassword };
    try {
      const newUser = await registerServices(registerBody); // axios service call
      console.log(newUser.id, newUser.username);

      alert(newUser.message || "User registered successfully!");

      // reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setRePassword("");
    } catch (err) {
      console.error("Register error:", err);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <label>Username : </label>
      <input
        type="text"
        value={username}
        placeholder="Enter Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <label>Email : </label>
      <input
        type="email"
        value={email}
        placeholder="Enter E-mail"
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password : </label>
      <input
        type="password"
        value={password}
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <label>Re-enter Password : </label>
      <input
        type="password"
        placeholder="Re-Enter your password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
      />

      <button onClick={handleRegister}>Submit</button>
      <Link href={"/login"}>Already have an account ? Log in</Link>
    </div>
  );
};
