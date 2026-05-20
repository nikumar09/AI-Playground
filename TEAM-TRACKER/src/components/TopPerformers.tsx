import React from 'react';
import type { MemberPerformance } from '../data/analyticsData';

interface TopPerformersProps {
  members: MemberPerformance[];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const TrendIcon: React.FC<{ trend: MemberPerformance['trend'] }> = ({ trend }) => {
  if (trend === 'up') return (
    <span className="trend-badge trend-up" aria-label="Trending up">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
      +
    </span>
  );
  if (trend === 'down') return (
    <span className="trend-badge trend-down" aria-label="Trending down">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      –
    </span>
  );
  return (
    <span className="trend-badge trend-steady" aria-label="Steady">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return (
    <span className="rank-badge rank-gold" aria-label="1st place">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </span>
  );
  if (rank === 2) return <span className="rank-badge rank-silver" aria-label="2nd place">2</span>;
  if (rank === 3) return <span className="rank-badge rank-bronze" aria-label="3rd place">3</span>;
  return <span className="rank-badge rank-plain" aria-label={`${rank}th place`}>{rank}</span>;
};

const TopPerformers: React.FC<TopPerformersProps> = ({ members }) => {
  const sorted = [...members].sort((a, b) => b.completed - a.completed);

  return (
    <div className="card top-performers-card">
      <div className="tp-header">
        <h3 className="section-title" style={{ margin: 0 }}>Top Performers</h3>
        <span className="period-badge">Last 30 days</span>
      </div>

      <div className="tp-table" role="list">
        {sorted.map((member, i) => {
          const rate = Math.round((member.completed / member.total) * 100);
          return (
            <div key={member.name} className="tp-row" role="listitem"
              aria-label={`${member.name}: ${member.completed} of ${member.total} tasks, ${rate}%`}>

              <RankBadge rank={i + 1} />

              <div className="tp-avatar-circle" style={{ backgroundColor: member.color }}>
                {getInitials(member.name)}
              </div>

              <div className="tp-info">
                <div className="tp-name-row">
                  <span className="tp-member-name">{member.name}</span>
                  <TrendIcon trend={member.trend} />
                </div>
                <span className="tp-member-role">{member.role}</span>
                <div className="tp-progress-track">
                  <div className="tp-progress-fill"
                    style={{ width: `${rate}%`, backgroundColor: member.color }} />
                </div>
              </div>

              <div className="tp-stats">
                <span className="tp-stat-primary">{member.completed}<span className="tp-stat-total">/{member.total}</span></span>
                <span className="tp-stat-secondary">{rate}%</span>
                <span className="tp-stat-hours">{member.hours}h</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tp-footer">
        <span className="tp-footer-label">Tasks</span>
        <span className="tp-footer-label">Rate</span>
        <span className="tp-footer-label">Hours</span>
      </div>
    </div>
  );
};

export default TopPerformers;
