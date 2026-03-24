import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('finsight_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('finsight_user'),

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('finsight_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const user = { id: found.id, name: found.name, email: found.email };
      localStorage.setItem('finsight_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  signup: (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('finsight_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    const newUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    localStorage.setItem('finsight_users', JSON.stringify(users));
    const user = { id: newUser.id, name, email };
    localStorage.setItem('finsight_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return { success: true };
  },

  demoLogin: () => {
    const user = { id: 'demo-user', name: 'Demo User', email: 'demo@finsight.ai' };
    localStorage.setItem('finsight_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('finsight_user');
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
