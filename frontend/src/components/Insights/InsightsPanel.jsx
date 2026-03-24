import { useMemo } from 'react';
import useAppStore from '../../store/appStore';
import { generateRuleBasedInsights, detectAnomalies } from '../../utils/helpers';
import { Lightbulb, Brain, Zap } from 'lucide-react';

const typeStyles = {
  success: { bg: 'rgba(34, 197, 94, 0.08)', border: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
  warning: { bg: 'rgba(234, 179, 8, 0.08)', border: 'rgba(234, 179, 8, 0.2)', color: '#eab308' },
  danger: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
  info: { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' },
};

export default function InsightsPanel() {
  const { transactions, monthlyBudget } = useAppStore();

  const insights = useMemo(() => {
    return generateRuleBasedInsights(transactions, monthlyBudget);
  }, [transactions, monthlyBudget]);

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
          <Brain size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>AI Insights</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Smart analysis of your spending</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8" style={{ color: 'var(--text-muted)' }}>
          <Lightbulb size={32} className="mb-2 opacity-30" />
          <p className="text-sm">Add transactions to get insights</p>
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((insight, i) => {
            const style = typeStyles[insight.type] || typeStyles.info;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl animate-fade-in"
                style={{ background: style.bg, border: `1px solid ${style.border}`, animationDelay: `${i * 0.1}s` }}>
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{insight.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
