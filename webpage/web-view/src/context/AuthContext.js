import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 added

  useEffect(() => {
    fetch("http://localhost:3000/users/me", {
      method: "GET",
      credentials: "include",
    })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); // 👈 done fetching
  }, []);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:3000/users/sign_in", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ user: { email, password } }),
    });

    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setUser(data.user);
  };

  const signup = async (email, password, device_uid) => {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ user: { email, password, device_uid } }),
    });

    if (!res.ok) throw new Error("Signup failed");
    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch("http://localhost:3000/users/sign_out", {
      method: "DELETE",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};