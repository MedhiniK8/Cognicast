import { useMemo } from 'react';
import useAppStore from '../../store/appStore';
import { generateRuleBasedInsights } from '../../utils/helpers';
import { Brain, Lightbulb } from 'lucide-react';

const typeStyles = {
  success: { bg: 'rgba(34, 197, 94, 0.06)', border: 'rgba(34, 197, 94, 0.15)', accent: '#22c55e' },
  warning: { bg: 'rgba(234, 179, 8, 0.06)', border: 'rgba(234, 179, 8, 0.15)', accent: '#eab308' },
  danger: { bg: 'rgba(239, 68, 68, 0.06)', border: 'rgba(239, 68, 68, 0.15)', accent: '#ef4444' },
  info: { bg: 'rgba(59, 130, 246, 0.06)', border: 'rgba(59, 130, 246, 0.15)', accent: '#3b82f6' },
};

export default function InsightsPanel() {
  const { transactions, monthlyBudget } = useAppStore();

  const insights = useMemo(() => {
    return generateRuleBasedInsights(transactions, monthlyBudget);
  }, [transactions, monthlyBudget]);

  return (
    <div className="card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'var(--gradient-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Brain size={18} color="white" />
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>AI Insights</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Smart analysis of your spending</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
          <Lightbulb size={36} style={{ opacity: 0.15, marginBottom: 12 }} />
          <p style={{ fontSize: 14 }}>Add transactions to get insights</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {insights.map((insight, i) => {
            const s = typeStyles[insight.type] || typeStyles.info;
            return (
              <div key={i} className="animate-fade-in"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '14px 16px', borderRadius: 14,
                  background: s.bg, border: `1px solid ${s.border}`,
                  animationDelay: `${i * 0.08}s`,
                }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{insight.icon}</span>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 450 }}>
                  {insight.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
