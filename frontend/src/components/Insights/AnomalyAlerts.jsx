import { useMemo } from 'react';
import useAppStore from '../../store/appStore';
import { detectAnomalies } from '../../utils/helpers';
import { AlertTriangle } from 'lucide-react';

export default function AnomalyAlerts() {
  const { transactions } = useAppStore();

  const anomalies = useMemo(() => detectAnomalies(transactions), [transactions]);

  if (anomalies.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {anomalies.map((a, i) => (
        <div key={i} className="animate-fade-in"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 20px', borderRadius: 16,
            background: a.severity === 'high' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(234, 179, 8, 0.06)',
            border: `1px solid ${a.severity === 'high' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)'}`,
            animationDelay: `${i * 0.08}s`,
          }}>
          <AlertTriangle size={16} style={{ color: a.severity === 'high' ? '#ef4444' : '#eab308', flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, flex: 1 }}>{a.message}</p>
        </div>
      ))}
    </div>
  );
}
