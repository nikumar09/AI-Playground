import React from 'react';
import { DAILY_DATA, MEMBER_PERFORMANCE, AT_RISK_TASKS, BOTTLENECK_SUMMARY } from '../data/analyticsData';
import ProductivityChart from './ProductivityChart';
import TopPerformers from './TopPerformers';
import BottleneckPanel from './BottleneckPanel';

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  accent: string;
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, accent, icon }) => (
  <div className="analytics-kpi-card">
    <div className="analytics-kpi-icon" style={{ color: accent, backgroundColor: accent + '18' }}>
      {icon}
    </div>
    <div className="analytics-kpi-body">
      <span className="analytics-kpi-value">{value}</span>
      <span className="analytics-kpi-label">{label}</span>
      <span className="analytics-kpi-sub">{sub}</span>
    </div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const totalCompleted = DAILY_DATA.reduce((s, d) => s + d.completed, 0);
  const totalCreated   = DAILY_DATA.reduce((s, d) => s + d.created,   0);
  const peakDay        = DAILY_DATA.reduce((best, d) => d.completed > best.completed ? d : best);
  const teamHours      = MEMBER_PERFORMANCE.reduce((s, m) => s + m.hours, 0);

  return (
    <div className="analytics-dashboard">
      <div className="analytics-page-header">
        <div>
          <h2 className="analytics-page-title">Team Analytics</h2>
          <p className="analytics-page-sub">Apr 19 – May 18, 2026 · Chromium</p>
        </div>
        <div className="analytics-period-badge">Last 30 days</div>
      </div>

      {/* KPI row */}
      <div className="analytics-kpi-grid">
        <KpiCard
          label="Tasks Completed"
          value={String(totalCompleted)}
          sub={`of ${totalCreated} created`}
          accent="#4F46E5"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <KpiCard
          label="Completion Rate"
          value={`${BOTTLENECK_SUMMARY.completionRate}%`}
          sub={`${BOTTLENECK_SUMMARY.velocityChange}% vs prev period`}
          accent="#10B981"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
        />
        <KpiCard
          label="Peak Day"
          value={`${peakDay.completed} tasks`}
          sub={peakDay.date}
          accent="#8B5CF6"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
        />
        <KpiCard
          label="Team Hours"
          value={`${teamHours}h`}
          sub={`${MEMBER_PERFORMANCE.length} contributors`}
          accent="#F59E0B"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>

      {/* Productivity chart — full width */}
      <ProductivityChart data={DAILY_DATA} />

      {/* Two-column: performers + bottlenecks */}
      <div className="analytics-columns">
        <TopPerformers members={MEMBER_PERFORMANCE} />
        <BottleneckPanel summary={BOTTLENECK_SUMMARY} tasks={AT_RISK_TASKS} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
