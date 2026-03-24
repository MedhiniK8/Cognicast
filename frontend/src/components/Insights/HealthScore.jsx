import { useMemo, useEffect } from 'react';
import useAppStore from '../../store/appStore';
import { calculateHealthScore } from '../../utils/helpers';
import { Shield, TrendingUp, Target, Activity } from 'lucide-react';

export default function HealthScore() {
  const { transactions, monthlyBudget, setHealthScore } = useAppStore();

  const score = useMemo(() => {
    return calculateHealthScore(transactions, monthlyBudget);
  }, [transactions, monthlyBudget]);

  useEffect(() => {
    setHealthScore(score);
  }, [score, setHealthScore]);

  const colorMap = {
    green: { main: '#22c55e', bg: 'rgba(34, 197, 94, 0.06)', gradient: 'conic-gradient(#22c55e var(--p), var(--border-color) 0deg)' },
    yellow: { main: '#eab308', bg: 'rgba(234, 179, 8, 0.06)', gradient: 'conic-gradient(#eab308 var(--p), var(--border-color) 0deg)' },
    red: { main: '#ef4444', bg: 'rgba(239, 68, 68, 0.06)', gradient: 'conic-gradient(#ef4444 var(--p), var(--border-color) 0deg)' },
  };

  const colors = colorMap[score.color] || colorMap.yellow;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score.score / 100) * circumference;

  return (
    <div className="card-static" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Shield size={20} style={{ color: colors.main }} />
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Financial Health</h3>
      </div>

      {/* Circular Score */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="52" stroke="var(--border-color)" strokeWidth="10" fill="none" />
            <circle
              cx="70" cy="70" r="52"
              stroke={colors.main}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: colors.main, letterSpacing: '-0.03em', lineHeight: 1 }}>{score.score}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{
          display: 'inline-block', padding: '6px 18px', borderRadius: 20,
          fontSize: 12, fontWeight: 700, background: colors.bg, color: colors.main,
          border: `1px solid ${colors.main}20`,
        }}>
          {score.label}
        </span>
      </div>

      {/* Factors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: TrendingUp, label: 'Savings Ratio', desc: 'Income vs expenses balance' },
          { icon: Target, label: 'Budget Adherence', desc: 'Staying within limits' },
          { icon: Activity, label: 'Spending Stability', desc: 'Consistent daily spending' },
        ].map((factor, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 12,
            background: 'var(--bg-card-hover)',
          }}>
            <factor.icon size={15} style={{ color: colors.main, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{factor.label}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{factor.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
