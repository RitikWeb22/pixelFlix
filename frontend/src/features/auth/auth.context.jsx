import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "./services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const data = await getMe();
        setUser(data.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await getMe();
    setUser(data.user || null);
    return data.user || null;
  }, []);

  const login = useCallback(
    async (credentials) => {
      setAuthLoading(true);
      setError("");

      try {
        await loginUser(credentials);
        const refreshedUser = await refreshUser();
        const data = { user: refreshedUser };
        return data;
      } catch (err) {
        setError(err.message || "Unable to login");
        throw err;
      } finally {
        setAuthLoading(false);
      }
    },
    [refreshUser],
  );

  const register = useCallback(
    async (payload) => {
      setAuthLoading(true);
      setError("");

      try {
        await registerUser(payload);
        const refreshedUser = await refreshUser();
        const data = { user: refreshedUser };
        return data;
      } catch (err) {
        setError(err.message || "Unable to register");
        throw err;
      } finally {
        setAuthLoading(false);
      }
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    setAuthLoading(true);
    setError("");

    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message || "Unable to logout");
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setError("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authLoading,
      error,
      login,
      register,
      logout,
      clearAuthError,
      refreshUser,
    }),
    [
      user,
      loading,
      authLoading,
      error,
      login,
      register,
      logout,
      clearAuthError,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
