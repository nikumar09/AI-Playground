import React from 'react';

interface StatsSectionProps {
  total: number;
  completed: number;
  inProgress: number;
  completionPct: number;
  totalHours: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  accent: string;
  icon: React.ReactNode;
  sub?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, accent, icon, sub }) => (
  <div className="stat-card" style={{ borderTopColor: accent }}>
    <div className="stat-icon" style={{ backgroundColor: accent + '18', color: accent }}>
      {icon}
    </div>
    <div className="stat-body">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

const StatsSection: React.FC<StatsSectionProps> = ({
  total,
  completed,
  inProgress,
  completionPct,
  totalHours,
}) => {
  const blocked = total - completed - inProgress;

  const progressBar = (
    <div className="stat-progress-track" role="progressbar" aria-valuenow={completionPct} aria-valuemin={0} aria-valuemax={100} aria-label={`${completionPct}% complete`}>
      <div className="stat-progress-fill" style={{ width: `${completionPct}%` }} />
    </div>
  );

  return (
    <div className="stats-section" aria-label="Task statistics">
      <StatCard
        label="Total Tasks"
        value={total}
        accent="#4F46E5"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        }
      />

      <StatCard
        label="Completed"
        value={completed}
        accent="#10B981"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
      />

      <StatCard
        label="In Progress"
        value={inProgress}
        accent="#F59E0B"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        }
        sub={blocked > 0 ? <span className="stat-blocked-badge">{blocked} blocked</span> : undefined}
      />

      <StatCard
        label="Completion"
        value={`${completionPct}%`}
        accent="#8B5CF6"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        }
        sub={progressBar}
      />

      <StatCard
        label="Hours Tracked"
        value={`${totalHours}h`}
        accent="#06B6D4"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />
    </div>
  );
};

export default StatsSection;
