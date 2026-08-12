import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from "../api/auth.js";

import {
  getStoredToken,
  removeStoredToken,
  setStoredToken,
} from "../utils/storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    removeStoredToken();

    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setToken(null);
      setUser(null);
      setLoading(false);

      return;
    }

    try {
      const data = await getCurrentUser(storedToken);

      setToken(storedToken);
      setUser(data.user);
    } catch (error) {
      removeStoredToken();

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);

    setStoredToken(data.accessToken);

    setToken(data.accessToken);
    setUser(data.user);

    return data;
  }, []);

  const register = useCallback(async (credentials) => {
    const data = await registerRequest(credentials);

    setStoredToken(data.accessToken);

    setToken(data.accessToken);
    setUser(data.user);

    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
