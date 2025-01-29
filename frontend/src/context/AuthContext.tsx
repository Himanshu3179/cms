import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthState } from "../types/auth";
import { registerUser, loginUser, fetchUserProfile } from "../api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true); // Manage initialization

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile()
        .then((user) => setAuth({ user, isAuthenticated: true }))
        .catch(() => {
          localStorage.removeItem("token");
          setAuth({ user: null, isAuthenticated: false });
        })
        .finally(() => setLoading(false)); // Finish initialization
    } else {
      setLoading(false); // No token, initialization complete
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token } = await loginUser({ email, password });
      localStorage.setItem("token", token);
      const user = await fetchUserProfile();
      setAuth({ user, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      await registerUser({ username, email, password });
      const { token } = await loginUser({ email, password });
      localStorage.setItem("token", token);
      const user = await fetchUserProfile();
      setAuth({ user, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
