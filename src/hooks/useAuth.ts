import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simulação de login básico
    if (email && password.length >= 4) {
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return { user, isLoading, login, logout };
}