import React from 'react';

const SummaryCards: React.FC = () => {
  return (
    <div className="summary-grid">
      <div className="card">
        <div className="card-title">Active Tasks</div>
        <div className="card-value">24</div>
        <div className="card-trend trend-up">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>+12% from last week</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Team Efficiency</div>
        <div className="card-value">92.4%</div>
        <div className="card-trend trend-up">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <span>+4.2% from last week</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Deadline Completion</div>
        <div className="card-value">98.1%</div>
        <div className="card-trend">
          <span style={{ color: 'var(--secondary-text)' }}>Steady performance</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
