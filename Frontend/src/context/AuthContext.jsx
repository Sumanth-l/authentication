import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setLogin(data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

   const logout = async () => {
    try {
      await fetch(" ", {
        method: "POST",
        credentials: "include",
      });

      setLogin(null);
    } catch (error) {
      console.log("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ login, setLogin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};