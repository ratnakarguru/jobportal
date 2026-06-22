import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // 1. Instantly read user from local storage cache so there is no delay
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      setUserData(JSON.parse(cachedUser));
    }

    // 2. Fetch fresh profile metrics directly out of your new endpoint
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setAuthLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/auth/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to sync current account profile data");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        localStorage.setItem("user", JSON.stringify(data)); // update local cache
        setAuthLoading(false);
      })
      .catch((err) => {
        console.error("Global account sync fail:", err);
        setAuthLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ userData, authLoading, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}