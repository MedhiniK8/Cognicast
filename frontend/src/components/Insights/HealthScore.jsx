import { useMemo, useEffect } from 'react';
import useAppStore from '../../store/appStore';
import { calculateHealthScore } from '../../utils/helpers';
import { Shield, TrendingUp, Target, Activity } from 'lucide-react';

export default function HealthScore() {
  const { transactions, monthlyBudget, setHealthScore, healthScore } = useAppStore();

  const score = useMemo(() => {
    return calculateHealthScore(transactions, monthlyBudget);
  }, [transactions, monthlyBudget]);

  useEffect(() => {
    setHealthScore(score);
  }, [score, setHealthScore]);

  const colorMap = {
    green: { main: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', ring: '#22c55e' },
    yellow: { main: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', ring: '#eab308' },
    red: { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', ring: '#ef4444' },
  };

  const colors = colorMap[score.color] || colorMap.yellow;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score.score / 100) * circumference;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={20} style={{ color: colors.main }} />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Financial Health</h3>
      </div>

      {/* Circular Score */}
      <div className="flex justify-center mb-4">
        <div className="relative w-36 h-36">
          <svg width="144" height="144" className="transform -rotate-90">
            <circle cx="72" cy="72" r="54" stroke="var(--border-color)" strokeWidth="8" fill="none" />
            <circle
              cx="72" cy="72" r="54"
              stroke={colors.ring}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: colors.main }}>{score.score}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center mb-4">
        <span className="px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{ background: colors.bg, color: colors.main }}>
          {score.label}
        </span>
      </div>

      {/* Factors */}
      <div className="space-y-2">
        {[
          { icon: TrendingUp, label: 'Savings Ratio', desc: 'Income vs expenses balance' },
          { icon: Target, label: 'Budget Adherence', desc: 'Staying within limits' },
          { icon: Activity, label: 'Spending Stability', desc: 'Consistent daily spending' },
        ].map((factor, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--bg-card-hover)' }}>
            <factor.icon size={14} style={{ color: colors.main }} />
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{factor.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{factor.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
