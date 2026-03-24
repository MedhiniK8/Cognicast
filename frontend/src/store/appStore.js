import { create } from 'zustand';
import { simulateTransactions, simulateDemoProfile } from '../utils/transactionSimulator';

const BANK_NAMES = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'IndusInd', 'Yes Bank', 'Federal Bank'];
const BANK_COLORS = {
  SBI: ['#1a237e', '#283593'],
  HDFC: ['#004b87', '#00538a'],
  ICICI: ['#f57c00', '#e65100'],
  Axis: ['#800020', '#6d0019'],
  Kotak: ['#ed1c24', '#c41017'],
  PNB: ['#0d47a1', '#1565c0'],
  BOB: ['#ff6f00', '#e65100'],
  IndusInd: ['#1a237e', '#0d47a1'],
  'Yes Bank': ['#0066b3', '#004d8c'],
  'Federal Bank': ['#ffd700', '#ccac00'],
};

function generateAccountNumber() {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    segments.push(String(Math.floor(1000 + Math.random() * 9000)));
  }
  return segments.join(' ');
}

const useAppStore = create((set, get) => ({
  // Accounts
  accounts: [],
  addAccount: (name, initialBalance) => {
    const account = {
      id: crypto.randomUUID(),
      name,
      accountNumber: generateAccountNumber(),
      balance: initialBalance,
      createdAt: new Date().toISOString(),
      color: BANK_COLORS[name] || ['#3b82f6', '#8b5cf6'],
    };
    set(state => ({ accounts: [...state.accounts, account] }));
    return account;
  },
  removeAccount: (id) => {
    set(state => ({
      accounts: state.accounts.filter(a => a.id !== id),
      transactions: state.transactions.filter(t => t.accountId !== id),
    }));
  },

  // Transactions
  transactions: [],
  addTransaction: (transaction) => {
    set(state => {
      const newTxns = [...state.transactions, transaction];
      const account = state.accounts.find(a => a.id === transaction.accountId);
      if (account) {
        const balanceChange = transaction.type === 'credit' ? transaction.amount : -transaction.amount;
        return {
          transactions: newTxns,
          accounts: state.accounts.map(a =>
            a.id === transaction.accountId
              ? { ...a, balance: a.balance + balanceChange }
              : a
          ),
        };
      }
      return { transactions: newTxns };
    });
  },

  // Simulation
  simulateDays: (accountId, days) => {
    const account = get().accounts.find(a => a.id === accountId);
    if (!account) return;
    const newTxns = simulateTransactions(accountId, days, account.balance);
    let balanceChange = 0;
    newTxns.forEach(t => {
      balanceChange += t.type === 'credit' ? t.amount : -t.amount;
    });
    set(state => ({
      transactions: [...state.transactions, ...newTxns],
      accounts: state.accounts.map(a =>
        a.id === accountId ? { ...a, balance: a.balance + balanceChange } : a
      ),
    }));
  },
  simulateAllAccounts: (days) => {
    const { accounts } = get();
    accounts.forEach(account => {
      get().simulateDays(account.id, days);
    });
  },

  // Demo profiles
  activeDemo: null,
  loadDemoProfile: (profileKey) => {
    const { accounts } = get();
    if (accounts.length === 0) return;
    // Clear existing transactions
    const allTxns = [];
    let updatedAccounts = [...accounts];
    accounts.forEach(account => {
      const txns = simulateDemoProfile(profileKey, account.id, 90);
      allTxns.push(...txns);
      let balanceChange = 0;
      txns.forEach(t => {
        balanceChange += t.type === 'credit' ? t.amount : -t.amount;
      });
      updatedAccounts = updatedAccounts.map(a =>
        a.id === account.id ? { ...a, balance: a.balance + balanceChange } : a
      );
    });
    set({ transactions: allTxns, accounts: updatedAccounts, activeDemo: profileKey });
  },

  // Budget
  monthlyBudget: 30000,
  setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),

  // Insights
  insights: [],
  healthScore: null,
  anomalies: [],
  setInsights: (insights) => set({ insights }),
  setHealthScore: (score) => set({ healthScore: score }),
  setAnomalies: (anomalies) => set({ anomalies }),

  // Reset
  resetAll: () => set({
    accounts: [],
    transactions: [],
    activeDemo: null,
    insights: [],
    healthScore: null,
    anomalies: [],
  }),

  // Quick setup for demo
  setupDemoData: () => {
    const store = get();
    store.resetAll();
    const sbi = store.addAccount('SBI', 75000);
    const hdfc = store.addAccount('HDFC', 120000);
    const icici = store.addAccount('ICICI', 45000);
    // Simulate 60 days of data
    setTimeout(() => {
      get().simulateDays(sbi.id, 60);
      get().simulateDays(hdfc.id, 60);
      get().simulateDays(icici.id, 60);
    }, 100);
  },
}));

export { BANK_NAMES, BANK_COLORS };
export default useAppStore;
