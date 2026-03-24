// Keyword → Category mapping for auto-categorization
const CATEGORY_MAP = {
  // Food & Dining
  swiggy: 'Food', zomato: 'Food', dominos: 'Food', pizza: 'Food',
  mcdonalds: 'Food', kfc: 'Food', starbucks: 'Food', restaurant: 'Food',
  café: 'Food', cafe: 'Food', food: 'Food', lunch: 'Food', dinner: 'Food',
  breakfast: 'Food', biryani: 'Food', burger: 'Food', grocery: 'Food',
  bigbasket: 'Food', blinkit: 'Food', zepto: 'Food', instamart: 'Food',

  // Transport
  uber: 'Transport', ola: 'Transport', rapido: 'Transport',
  metro: 'Transport', bus: 'Transport', train: 'Transport',
  fuel: 'Transport', petrol: 'Transport', diesel: 'Transport',
  parking: 'Transport', toll: 'Transport', irctc: 'Transport',

  // Shopping
  amazon: 'Shopping', flipkart: 'Shopping', myntra: 'Shopping',
  ajio: 'Shopping', nykaa: 'Shopping', meesho: 'Shopping',
  shopping: 'Shopping', mall: 'Shopping', clothes: 'Shopping',

  // Subscriptions
  netflix: 'Subscriptions', spotify: 'Subscriptions', hotstar: 'Subscriptions',
  prime: 'Subscriptions', youtube: 'Subscriptions', jio: 'Subscriptions',
  airtel: 'Subscriptions', vi: 'Subscriptions', subscription: 'Subscriptions',

  // Utilities
  electricity: 'Utilities', water: 'Utilities', gas: 'Utilities',
  internet: 'Utilities', wifi: 'Utilities', broadband: 'Utilities',
  rent: 'Utilities', maintenance: 'Utilities',

  // Entertainment
  movie: 'Entertainment', bookmyshow: 'Entertainment', pvr: 'Entertainment',
  inox: 'Entertainment', game: 'Entertainment', concert: 'Entertainment',

  // Health
  pharmacy: 'Health', hospital: 'Health', doctor: 'Health',
  apollo: 'Health', medplus: 'Health', medicine: 'Health',
  gym: 'Health', fitness: 'Health',

  // Education
  course: 'Education', udemy: 'Education', coursera: 'Education',
  book: 'Education', tuition: 'Education', college: 'Education',

  // Salary & Income
  salary: 'Salary', income: 'Salary', freelance: 'Salary',
  bonus: 'Salary', dividend: 'Salary', interest: 'Salary',
  refund: 'Salary', cashback: 'Salary',

  // Transfers
  transfer: 'Transfer', upi: 'Transfer', neft: 'Transfer', imps: 'Transfer',
};

export const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Subscriptions', 'Utilities',
  'Entertainment', 'Health', 'Education', 'Salary', 'Transfer', 'Other'
];

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Subscriptions: '#8b5cf6',
  Utilities: '#06b6d4',
  Entertainment: '#eab308',
  Health: '#22c55e',
  Education: '#14b8a6',
  Salary: '#10b981',
  Transfer: '#64748b',
  Other: '#94a3b8',
};

export const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Subscriptions: '📺',
  Utilities: '💡',
  Entertainment: '🎬',
  Health: '🏥',
  Education: '📚',
  Salary: '💰',
  Transfer: '🔄',
  Other: '📋',
};

export function detectCategory(description) {
  const lower = description.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(keyword)) {
      return category;
    }
  }
  return 'Other';
}
