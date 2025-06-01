import { useEffect } from 'react';
import { create } from 'zustand';
import { useNavigate, useLocation } from 'react-router-dom';
import type { NavigateOptions } from 'react-router-dom';
import { persist } from 'zustand/middleware';

interface UserData {
  user_id?: string;
  [key: string]: unknown;
}

interface AuthState {
  userData: UserData;
  userRole: string[];
  setUserData: (data: UserData) => void;
  setUserRole: (roles: string[]) => void;
  loginAuth: (data: UserData) => boolean;
  logoutAuth: () => boolean;
  checkToken: (token: string) => boolean;
}

const encode = <T>(obj: T): string =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))));

const decode = <T>(str: string): T =>
  JSON.parse(decodeURIComponent(escape(atob(str))));

const listLocalDataLogin: string[] = [
  "current_group",
  "auth-store",
  "thai_id_access_token",
  "thai_id_refresh_token",
  "thai_id_userinfo",
  "token",
  "person_data",
  "user_id",
  "menu_data",
  "state",
];

const base64Storage = {
  getItem<T>(name: string): T | null {
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      return decode<T>(value);
    } catch (e) {
      console.error("Failed to decode auth-store:", e);
      return null;
    }
  },
  setItem<T>(name: string, value: T): void {
    try {
      const encoded = encode(value);
      localStorage.setItem(name, encoded);
    } catch (e) {
      console.error("Failed to encode auth-store:", e);
    }
  },
  removeItem(name: string): void {
    localStorage.removeItem(name);
  },
};

const BasePathAuth =
  typeof window !== 'undefined' &&
    window.location &&
    typeof window.location.pathname === 'string'
    ? window.location.pathname.split("/")[1] || ''
    : "";

if (BasePathAuth) {
  listLocalDataLogin.push(BasePathAuth);
}

const localStateName = `auth-store-${BasePathAuth}`;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userData: {},
      userRole: [],

      setUserData: (userData: UserData) => set({ userData }),
      setUserRole: (userRole: string[]) => set({ userRole }),

      loginAuth: (userData: UserData) => {
        set({ userData, userRole: ['user'] });
        if (userData?.user_id) {
          localStorage.setItem("user_id", userData.user_id);
        }
        return true;
      },

      logoutAuth: () => {
        set({ userData: {}, userRole: [] });
        localStorage.removeItem(localStateName);
        listLocalDataLogin.forEach((key) => base64Storage.removeItem(key));
        return true;
      },

      checkToken: (token: string): boolean => typeof token === 'string' && token.length > 0,
    }),
    {
      name: localStateName,
      storage: base64Storage,
    }
  )
);

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    userData,
    userRole,
    setUserData,
    loginAuth: storeLoginAuth,
    logoutAuth: storeLogoutAuth,
    checkToken,
  } = useAuthStore();

  const loginAuth = async (userData: UserData, goto?: string) => {
    storeLoginAuth(userData);
    if (goto) navigate(goto, { replace: true });
  };

  const logoutAuth = async () => {
    storeLogoutAuth();
    listLocalDataLogin.forEach((key) => base64Storage.removeItem(key));
    navigate("/home", { replace: true });
  };

  const linkToPath = (path: string, options?: NavigateOptions) => {
    navigate(path, { replace: true, ...options });
  };

  useEffect(() => {
    // window.scrollTo(0, 0);
  }, [location.pathname]);

  return {
    path: location.pathname,
    userData,
    userRole,
    setUserData,
    loginAuth,
    logoutAuth,
    checkToken,
    linkToPath,
  };
};
