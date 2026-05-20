import React from 'react';

export interface MemberProgress {
  name: string;
  total: number;
  completed: number;
  pct: number;
}

interface TeamProgressChartProps {
  members: MemberProgress[];
}

const AVATAR_COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6',
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getBarColor(pct: number) {
  if (pct === 100) return '#10B981';
  if (pct >= 67)   return '#4F46E5';
  if (pct >= 34)   return '#F59E0B';
  if (pct > 0)     return '#F97316';
  return '#E5E7EB';
}

const TeamProgressChart: React.FC<TeamProgressChartProps> = ({ members }) => {
  if (members.length === 0) return null;

  return (
    <div className="card team-progress-card">
      <div className="team-progress-header">
        <h3 className="section-title" style={{ margin: 0 }}>Team Progress</h3>
        <span className="team-progress-meta">
          {members.length} member{members.length !== 1 ? 's' : ''} · {members.reduce((s, m) => s + m.total, 0)} tasks
        </span>
      </div>

      <div className="team-progress-list" role="list">
        {members.map((member, i) => {
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const barColor = getBarColor(member.pct);

          return (
            <div
              key={member.name}
              className="team-progress-row"
              role="listitem"
              aria-label={`${member.name}: ${member.completed} of ${member.total} tasks completed (${member.pct}%)`}
            >
              <div
                className="tp-avatar"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              >
                {getInitials(member.name)}
              </div>

              <span className="tp-name">{member.name}</span>

              <div className="tp-bar-track" aria-hidden="true">
                <div
                  className="tp-bar-fill"
                  style={{ width: `${member.pct}%`, backgroundColor: barColor }}
                />
              </div>

              <span className="tp-pct" style={{ color: barColor === '#E5E7EB' ? 'var(--secondary-text)' : barColor }}>
                {member.pct}%
              </span>

              <span className="tp-fraction">
                {member.completed}/{member.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamProgressChart;
