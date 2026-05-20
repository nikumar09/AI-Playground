import React from 'react';
import type { AtRiskTask } from '../data/analyticsData';

// Use the shape directly since the import is a const
interface BottleneckSummary {
  blockedCount: number;
  atRiskCount: number;
  avgDaysInProgress: number;
  completionRate: number;
  velocityChange: string;
}

interface BottleneckPanelProps {
  summary: BottleneckSummary;
  tasks: AtRiskTask[];
}

const PRIORITY_COLOR: Record<string, string> = {
  high:   '#EF4444',
  medium: '#F59E0B',
  low:    '#3B82F6',
};

const BottleneckPanel: React.FC<BottleneckPanelProps> = ({ summary, tasks }) => (
  <div className="card bottleneck-card">
    <div className="bn-header">
      <h3 className="section-title" style={{ margin: 0 }}>Bottlenecks</h3>
      <span className="period-badge">Last 30 days</span>
    </div>

    {/* Metric row */}
    <div className="bn-metrics">
      <div className="bn-metric bn-metric-red">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span className="bn-metric-value">{summary.blockedCount}</span>
        <span className="bn-metric-label">Blocked</span>
      </div>
      <div className="bn-metric bn-metric-amber">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span className="bn-metric-value">{summary.atRiskCount}</span>
        <span className="bn-metric-label">At Risk</span>
      </div>
      <div className="bn-metric bn-metric-blue">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span className="bn-metric-value">{summary.avgDaysInProgress}d</span>
        <span className="bn-metric-label">Avg age</span>
      </div>
    </div>

    {/* Completion rate bar */}
    <div className="bn-rate-section">
      <div className="bn-rate-header">
        <span className="bn-rate-label">Period completion rate</span>
        <span className="bn-rate-value">{summary.completionRate}%</span>
      </div>
      <div className="bn-rate-track">
        <div className="bn-rate-fill" style={{ width: `${summary.completionRate}%` }} />
      </div>
      <span className="bn-rate-sub">Velocity {summary.velocityChange}% vs previous 30 days</span>
    </div>

    {/* At-risk task list */}
    <div className="bn-tasks-header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
      Tasks needing attention
    </div>

    <div className="bn-task-list" role="list">
      {tasks.map(task => (
        <div key={task.title} className="bn-task-row" role="listitem">
          <div className="bn-task-priority-rail"
            style={{ backgroundColor: PRIORITY_COLOR[task.priority] }} />
          <div className="bn-task-body">
            <span className="bn-task-title" title={task.title}>{task.title}</span>
            <div className="bn-task-meta">
              <span className="bn-task-assignee">{task.assignee}</span>
              <span className={`bn-task-status ${task.status === 'Blocked' ? 'status-blocked' : 'status-progress'}`}>
                {task.status}
              </span>
            </div>
          </div>
          <span className={`bn-task-age ${task.daysStuck >= 7 ? 'age-critical' : task.daysStuck >= 4 ? 'age-warning' : 'age-ok'}`}>
            {task.daysStuck}d
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default BottleneckPanel;
