import { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

const storage = Platform.OS === 'web'
  ? {
      get: (key) => Promise.resolve(localStorage.getItem(key)),
      set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
      remove: (key) => Promise.resolve(localStorage.removeItem(key)),
    }
  : require('@react-native-async-storage/async-storage').default;

const get = (key) => Platform.OS === 'web' ? storage.get(key) : storage.getItem(key);
const set = (key, value) => Platform.OS === 'web' ? storage.set(key, value) : storage.setItem(key, value);
const remove = (key) => Platform.OS === 'web' ? storage.remove(key) : storage.removeItem(key);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([get('user'), get('token')]).then(([u, t]) => {
      if (u) setUser(JSON.parse(u));
      if (t) setToken(t);
      setReady(true);
    });
  }, []);

  const signin = async (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    await set('user', JSON.stringify(userData));
    await set('token', userToken);
  };

  const signout = async () => {
    setUser(null);
    setToken(null);
    await remove('user');
    await remove('token');
  };

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, token, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
