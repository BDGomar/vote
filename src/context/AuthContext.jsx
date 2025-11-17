import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  getCurrentUser,
} from '../services/authService';

const AuthContext = createContext(null);

const TOKEN_KEY = 'ua_vote_token';
const USER_KEY = 'ua_vote_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Impossible de parser les informations utilisateur stockées.');
      return null;
    }
  });
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const persistToken = useCallback((value) => {
    if (value) {
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(value);
  }, []);

  const persistUser = useCallback((value) => {
    if (value) {
      localStorage.setItem(USER_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(value);
  }, []);

  const loadCurrentUser = useCallback(
    async (activeToken) => {
      if (!activeToken) return null;
      const response = await getCurrentUser(activeToken);
      if (response.success) {
        persistUser(response.data);
        return response.data;
      }
      return null;
    },
    [persistUser],
  );

  const login = useCallback(async (matricule, password) => {
    setIsSubmitting(true);
    setAuthError(null);
    const result = await loginRequest(matricule, password);
    setIsSubmitting(false);

    if (result.success) {
      const accessToken = result.data?.access_token;
      const userData = result.data?.user;
      if (accessToken) {
        persistToken(accessToken);
        if (userData) {
          persistUser(userData);
        } else {
          await loadCurrentUser(accessToken);
        }
      }
      return { success: true };
    }

    setAuthError(result.data?.message ?? 'Échec de connexion');
    return { success: false, message: result.data?.message };
  }, [persistToken]);

  const register = useCallback(async (matricule, password, passwordConfirmation) => {
    setIsSubmitting(true);
    setAuthError(null);
    const result = await registerRequest(matricule, password, passwordConfirmation);
    setIsSubmitting(false);

    if (result.success) {
      return { success: true, message: result.data?.message };
    }

    setAuthError(result.data?.message ?? 'Échec de l’inscription');
    return { success: false, message: result.data?.message };
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      await logoutRequest(token);
    }
    persistToken(null);
    persistUser(null);
  }, [token, persistToken]);

  useEffect(() => {
    if (!token) {
      persistUser(null);
      return;
    }

    if (!user || !user.etudiant) {
      loadCurrentUser(token);
    }
  }, [token, user, loadCurrentUser, persistUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
        register,
        authError,
        isSubmitting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  }
  return context;
};

