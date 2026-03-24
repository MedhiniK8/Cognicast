import { detectCategory } from './categoryDetector';

// Realistic transaction templates
const DEBIT_TEMPLATES = [
  { desc: 'Swiggy Order', min: 150, max: 600, weight: 3 },
  { desc: 'Zomato Food Delivery', min: 200, max: 800, weight: 3 },
  { desc: 'Uber Ride', min: 100, max: 500, weight: 2 },
  { desc: 'Ola Auto', min: 50, max: 250, weight: 2 },
  { desc: 'Amazon Purchase', min: 300, max: 5000, weight: 1.5 },
  { desc: 'Flipkart Order', min: 200, max: 4000, weight: 1 },
  { desc: 'Netflix Subscription', min: 199, max: 649, weight: 0.3 },
  { desc: 'Spotify Premium', min: 119, max: 179, weight: 0.3 },
  { desc: 'Hotstar Subscription', min: 299, max: 1499, weight: 0.2 },
  { desc: 'Electricity Bill', min: 500, max: 3000, weight: 0.5 },
  { desc: 'Internet Bill', min: 500, max: 1500, weight: 0.3 },
  { desc: 'Grocery - BigBasket', min: 400, max: 3000, weight: 1.5 },
  { desc: 'Zepto Quick Commerce', min: 100, max: 800, weight: 1.5 },
  { desc: 'BookMyShow Movie', min: 200, max: 1000, weight: 0.5 },
  { desc: 'Myntra Fashion', min: 500, max: 4000, weight: 0.7 },
  { desc: 'Petrol Fuel', min: 500, max: 3000, weight: 1 },
  { desc: 'Metro Card Recharge', min: 200, max: 500, weight: 1 },
  { desc: 'Gym Membership', min: 1000, max: 3000, weight: 0.2 },
  { desc: 'Apollo Pharmacy', min: 100, max: 2000, weight: 0.4 },
  { desc: 'Udemy Course', min: 399, max: 3499, weight: 0.2 },
  { desc: 'Restaurant Dining', min: 500, max: 3000, weight: 1 },
  { desc: 'Starbucks Coffee', min: 250, max: 700, weight: 0.7 },
  { desc: 'Rent Payment', min: 8000, max: 25000, weight: 0.3 },
  { desc: 'Maintenance Charges', min: 2000, max: 5000, weight: 0.2 },
  { desc: 'Mobile Recharge - Jio', min: 199, max: 999, weight: 0.3 },
];

const CREDIT_TEMPLATES = [
  { desc: 'Salary Credit', min: 25000, max: 100000, weight: 0.3 },
  { desc: 'Freelance Payment', min: 5000, max: 30000, weight: 0.2 },
  { desc: 'UPI Refund', min: 100, max: 2000, weight: 0.3 },
  { desc: 'Cashback Received', min: 20, max: 500, weight: 0.5 },
  { desc: 'Interest Credit', min: 50, max: 500, weight: 0.2 },
  { desc: 'Dividend Income', min: 100, max: 5000, weight: 0.1 },
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(templates) {
  const totalWeight = templates.reduce((sum, t) => sum + t.weight, 0);
  let random = Math.random() * totalWeight;
  for (const t of templates) {
    random -= t.weight;
    if (random <= 0) return t;
  }
  return templates[0];
}

function generateTransactionsForDay(date, accountId, weekendMultiplier = 1) {
  const transactions = [];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const dailyCount = randomBetween(1, isWeekend ? 5 : 3);
  const multiplier = isWeekend ? weekendMultiplier : 1;

  // Salary on 1st of month
  if (date.getDate() === 1) {
    const salaryTemplate = CREDIT_TEMPLATES[0];
    transactions.push({
      id: crypto.randomUUID(),
      accountId,
      date: date.toISOString(),
      description: salaryTemplate.desc,
      amount: randomBetween(salaryTemplate.min, salaryTemplate.max),
      type: 'credit',
      category: detectCategory(salaryTemplate.desc),
    });
  }

  // Daily spending
  for (let i = 0; i < dailyCount * multiplier; i++) {
    const isCredit = Math.random() < 0.1;
    const templates = isCredit ? CREDIT_TEMPLATES.slice(1) : DEBIT_TEMPLATES;
    const template = pickWeighted(templates);
    const amount = randomBetween(template.min, template.max);

    const hour = randomBetween(7, 23);
    const minute = randomBetween(0, 59);
    const txDate = new Date(date);
    txDate.setHours(hour, minute, 0, 0);

    transactions.push({
      id: crypto.randomUUID(),
      accountId,
      date: txDate.toISOString(),
      description: template.desc,
      amount,
      type: isCredit ? 'credit' : 'debit',
      category: detectCategory(template.desc),
    });
  }

  return transactions;
}

export function simulateTransactions(accountId, days, existingBalance = 50000) {
  const transactions = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dayTxns = generateTransactionsForDay(date, accountId, 1.5);
    transactions.push(...dayTxns);
  }

  return transactions;
}

// Demo profiles
const DEMO_PROFILES = {
  student: {
    name: 'Student Mode',
    salary: { min: 8000, max: 15000 },
    spendingMultiplier: 0.6,
    heavyCategories: ['Food', 'Transport', 'Education'],
    templates: [
      { desc: 'Canteen Lunch', min: 50, max: 150, weight: 4 },
      { desc: 'Swiggy Late Night', min: 150, max: 400, weight: 3 },
      { desc: 'College Bus Pass', min: 500, max: 1500, weight: 0.3 },
      { desc: 'Udemy Course', min: 399, max: 799, weight: 0.5 },
      { desc: 'Book Purchase', min: 200, max: 800, weight: 0.5 },
      { desc: 'Metro Card', min: 100, max: 300, weight: 1.5 },
      { desc: 'Starbucks Coffee', min: 200, max: 500, weight: 1 },
      { desc: 'Mobile Recharge - Jio', min: 199, max: 399, weight: 0.3 },
    ],
  },
  highSpender: {
    name: 'High Spender Mode',
    salary: { min: 80000, max: 200000 },
    spendingMultiplier: 2.0,
    heavyCategories: ['Shopping', 'Entertainment', 'Food'],
    templates: [
      { desc: 'Amazon Luxury Purchase', min: 2000, max: 20000, weight: 2 },
      { desc: 'Myntra Premium Fashion', min: 3000, max: 15000, weight: 1.5 },
      { desc: 'Fine Dining Restaurant', min: 2000, max: 8000, weight: 2 },
      { desc: 'Uber Premium Ride', min: 300, max: 1500, weight: 2 },
      { desc: 'BookMyShow Premium', min: 500, max: 3000, weight: 1 },
      { desc: 'Subscription Bundle', min: 999, max: 2999, weight: 0.5 },
      { desc: 'Shopping Mall Spree', min: 5000, max: 25000, weight: 1 },
      { desc: 'International Flight', min: 15000, max: 50000, weight: 0.1 },
    ],
  },
  saver: {
    name: 'Saver Mode',
    salary: { min: 40000, max: 70000 },
    spendingMultiplier: 0.3,
    heavyCategories: ['Utilities', 'Food'],
    templates: [
      { desc: 'Home Cooked Grocery', min: 200, max: 800, weight: 2 },
      { desc: 'Bus Pass Monthly', min: 300, max: 600, weight: 0.3 },
      { desc: 'Electricity Bill', min: 300, max: 1000, weight: 0.3 },
      { desc: 'Mobile Recharge', min: 149, max: 299, weight: 0.3 },
      { desc: 'Zepto Essentials', min: 100, max: 400, weight: 1 },
    ],
  },
};

export function simulateDemoProfile(profileKey, accountId, days = 30) {
  const profile = DEMO_PROFILES[profileKey];
  if (!profile) return [];
  const transactions = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Salary on 1st
    if (date.getDate() === 1) {
      transactions.push({
        id: crypto.randomUUID(),
        accountId,
        date: date.toISOString(),
        description: 'Salary Credit',
        amount: randomBetween(profile.salary.min, profile.salary.max),
        type: 'credit',
        category: 'Salary',
      });
    }

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const count = Math.max(1, Math.floor(randomBetween(1, isWeekend ? 4 : 3) * profile.spendingMultiplier));

    for (let j = 0; j < count; j++) {
      const template = pickWeighted(profile.templates);
      const hour = randomBetween(7, 23);
      const txDate = new Date(date);
      txDate.setHours(hour, randomBetween(0, 59), 0, 0);

      transactions.push({
        id: crypto.randomUUID(),
        accountId,
        date: txDate.toISOString(),
        description: template.desc,
        amount: randomBetween(template.min, template.max),
        type: 'debit',
        category: detectCategory(template.desc),
      });
    }
  }

  return transactions;
}

export { DEMO_PROFILES };
