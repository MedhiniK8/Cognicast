export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Amount (₹)', 'Type', 'Category'];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString('en-IN'),
    t.description,
    t.amount,
    t.type,
    t.category,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finsight_transactions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMonthYear(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
}

export function calculateHealthScore(transactions, monthlyBudget) {
  if (transactions.length === 0) return { score: 50, label: 'No Data', color: 'yellow' };

  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const income = thisMonth.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const expenses = thisMonth.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  // Savings ratio (0-40 points)
  const savingsRatio = income > 0 ? (income - expenses) / income : 0;
  const savingsScore = Math.max(0, Math.min(40, savingsRatio * 100));

  // Budget adherence (0-35 points)
  const budgetRatio = monthlyBudget > 0 ? expenses / monthlyBudget : 1;
  const budgetScore = budgetRatio <= 1 ? 35 : Math.max(0, 35 - (budgetRatio - 1) * 50);

  // Spending stability (0-25 points) - less variance = better
  const dailySpending = {};
  thisMonth.filter(t => t.type === 'debit').forEach(t => {
    const day = new Date(t.date).toDateString();
    dailySpending[day] = (dailySpending[day] || 0) + t.amount;
  });
  const values = Object.values(dailySpending);
  if (values.length > 1) {
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
    const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
    var stabilityScore = Math.max(0, 25 - cv * 20);
  } else {
    var stabilityScore = 15;
  }

  const score = Math.round(savingsScore + budgetScore + stabilityScore);
  const clampedScore = Math.max(0, Math.min(100, score));

  let label, color;
  if (clampedScore >= 70) { label = 'Excellent'; color = 'green'; }
  else if (clampedScore >= 40) { label = 'Moderate'; color = 'yellow'; }
  else { label = 'At Risk'; color = 'red'; }

  return { score: clampedScore, label, color };
}

export function detectAnomalies(transactions) {
  const anomalies = [];
  const categoryAvgs = {};

  // Calculate category averages
  transactions.filter(t => t.type === 'debit').forEach(t => {
    if (!categoryAvgs[t.category]) categoryAvgs[t.category] = { total: 0, count: 0 };
    categoryAvgs[t.category].total += t.amount;
    categoryAvgs[t.category].count += 1;
  });

  Object.keys(categoryAvgs).forEach(cat => {
    categoryAvgs[cat].avg = categoryAvgs[cat].total / categoryAvgs[cat].count;
  });

  // Check recent transactions for spikes
  const recent = [...transactions]
    .filter(t => t.type === 'debit')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20);

  recent.forEach(t => {
    const avg = categoryAvgs[t.category]?.avg || 0;
    if (t.amount > avg * 3 && t.amount > 1000) {
      anomalies.push({
        id: t.id,
        type: 'high_spending',
        message: `High expense detected: ${formatCurrency(t.amount)} on ${t.category}`,
        transaction: t,
        severity: t.amount > avg * 5 ? 'high' : 'medium',
      });
    }
  });

  return anomalies.slice(0, 5);
}

export function generateRuleBasedInsights(transactions, monthlyBudget) {
  const insights = [];
  if (transactions.length === 0) return insights;

  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date);
    const target = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
  });

  const thisExpenses = thisMonth.filter(t => t.type === 'debit');
  const lastExpenses = lastMonth.filter(t => t.type === 'debit');
  const thisTotal = thisExpenses.reduce((s, t) => s + t.amount, 0);
  const lastTotal = lastExpenses.reduce((s, t) => s + t.amount, 0);

  // Category breakdown
  const categorySpending = {};
  thisExpenses.forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
  });

  const lastCategorySpending = {};
  lastExpenses.forEach(t => {
    lastCategorySpending[t.category] = (lastCategorySpending[t.category] || 0) + t.amount;
  });

  // Trend
  if (lastTotal > 0) {
    const change = ((thisTotal - lastTotal) / lastTotal * 100).toFixed(0);
    if (change > 10) {
      insights.push({ type: 'warning', icon: '📈', text: `Spending is up ${change}% compared to last month.` });
    } else if (change < -10) {
      insights.push({ type: 'success', icon: '📉', text: `Great! Spending is down ${Math.abs(change)}% this month.` });
    }
  }

  // Budget status
  if (monthlyBudget > 0) {
    const usage = (thisTotal / monthlyBudget * 100).toFixed(0);
    if (usage > 90) {
      insights.push({ type: 'danger', icon: '🚨', text: `You've used ${usage}% of your monthly budget!` });
    } else if (usage > 70) {
      insights.push({ type: 'warning', icon: '⚠️', text: `Budget usage at ${usage}%. Be cautious with spending.` });
    }
  }

  // Top category
  const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({
      type: 'info',
      icon: '🏷️',
      text: `Top spending category: ${topCategory[0]} at ${formatCurrency(topCategory[1])}.`,
    });
  }

  // Category comparison
  Object.entries(categorySpending).forEach(([cat, amount]) => {
    const lastAmount = lastCategorySpending[cat] || 0;
    if (lastAmount > 0) {
      const change = ((amount - lastAmount) / lastAmount * 100).toFixed(0);
      if (change > 25) {
        insights.push({
          type: 'warning',
          icon: '⬆️',
          text: `${cat} spending increased by ${change}% this month.`,
        });
      }
    }
  });

  // Subscriptions
  const subs = thisExpenses.filter(t => t.category === 'Subscriptions');
  if (subs.length > 0) {
    const subTotal = subs.reduce((s, t) => s + t.amount, 0);
    insights.push({
      type: 'info',
      icon: '📺',
      text: `Subscriptions cost you ${formatCurrency(subTotal)} this month.`,
    });
  }

  // Income
  const income = thisMonth.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  if (income > 0 && thisTotal > 0) {
    const savingsRate = ((income - thisTotal) / income * 100).toFixed(0);
    if (savingsRate > 30) {
      insights.push({ type: 'success', icon: '💪', text: `Savings rate is ${savingsRate}%. Keep it up!` });
    } else if (savingsRate < 10) {
      insights.push({ type: 'danger', icon: '💸', text: `Savings rate is only ${savingsRate}%. Try to cut expenses.` });
    }
  }

  return insights.slice(0, 8);
}
