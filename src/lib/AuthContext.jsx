import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const USERS_KEY = 'shop_users';
const CURRENT_USER_KEY = 'shop_current_user';

// Tài khoản admin cố định
const ADMIN_ACCOUNT = {
  id: 'admin-001',
  email: 'admin@shop.com',
  password: 'admin123',
  full_name: 'Quản trị viên',
  role: 'admin',
  created_date: '2024-01-01T00:00:00.000Z',
};

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch { return []; }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState({ id: 'local', public_settings: {} });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) {
        const u = JSON.parse(saved);
        setUser(u);
        setIsAuthenticated(true);
      }
    } catch {}
    setIsLoadingAuth(false);
    setAuthChecked(true);
  }, []);

  const login = async ({ email, password }) => {
    // Kiểm tra tài khoản admin cố định trước
    if (email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
      const { password: _pw, ...safeAdmin } = ADMIN_ACCOUNT;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeAdmin));
      setUser(safeAdmin);
      setIsAuthenticated(true);
      return safeAdmin;
    }

    // Kiểm tra tài khoản thường trong localStorage
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Email hoặc mật khẩu không đúng');
    const { password: _pw, ...safeUser } = found;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    setIsAuthenticated(true);
    return safeUser;
  };

  const register = async ({ email, password, full_name }) => {
    // Không cho đăng ký trùng email admin
    if (email === ADMIN_ACCOUNT.email) {
      throw new Error('Email này đã được sử dụng');
    }
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('Email này đã được đăng ký');
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      full_name: full_name || email.split('@')[0],
      role: 'user', // Khách hàng thường — chỉ admin@shop.com mới là admin
      created_date: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { password: _pw, ...safeUser } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    setUser(safeUser);
    setIsAuthenticated(true);
    return safeUser;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const checkUserAuth = () => {};
  const checkAppState = () => {};

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
      login,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
