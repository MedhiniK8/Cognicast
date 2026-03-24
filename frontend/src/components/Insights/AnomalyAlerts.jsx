import { useMemo } from 'react';
import useAppStore from '../../store/appStore';
import { detectAnomalies } from '../../utils/helpers';
import { AlertTriangle, X } from 'lucide-react';

export default function AnomalyAlerts() {
  const { transactions } = useAppStore();

  const anomalies = useMemo(() => detectAnomalies(transactions), [transactions]);

  if (anomalies.length === 0) return null;

  return (
    <div className="space-y-2">
      {anomalies.map((a, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-fade-in"
          style={{
            background: a.severity === 'high' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(234, 179, 8, 0.08)',
            border: `1px solid ${a.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`,
            animationDelay: `${i * 0.1}s`,
          }}>
          <AlertTriangle size={16} style={{ color: a.severity === 'high' ? '#ef4444' : '#eab308', flexShrink: 0 }} />
          <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{a.message}</p>
        </div>
      ))}
    </div>
  );
}
