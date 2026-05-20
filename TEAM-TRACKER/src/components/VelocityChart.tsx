import React from 'react';

const VelocityChart: React.FC = () => {
  const dataPoints = [
    { x: 0, y: 80, label: 'Mon' },
    { x: 40, y: 60, label: 'Tue' },
    { x: 80, y: 70, label: 'Wed' },
    { x: 120, y: 30, label: 'Thu' },
    { x: 160, y: 40, label: 'Fri' },
    { x: 200, y: 10, label: 'Sat' },
  ];

  const polylinePoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,100 ${polylinePoints} 200,100`;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 className="section-title" style={{ margin: 0 }}>Weekly Velocity</h3>
        <div style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 700 }}>
          +14% VS LAST WEEK
        </div>
      </div>
      
      <div className="chart-container">
        <svg viewBox="-20 -10 240 130" className="chart-svg">
          {/* Grid lines */}
          <line x1="0" y1="0" x2="200" y2="0" className="chart-axis" strokeDasharray="4" />
          <line x1="0" y1="50" x2="200" y2="50" className="chart-axis" strokeDasharray="4" />
          <line x1="0" y1="100" x2="200" y2="100" className="chart-axis" />
          <line x1="0" y1="0" x2="0" y2="100" className="chart-axis" />

          {/* Area fill */}
          <polyline
            fill="rgba(79, 70, 229, 0.08)"
            points={areaPoints}
          />

          {/* Main line */}
          <polyline
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Data points */}
          {dataPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              className="chart-dot"
            />
          ))}

          {/* Labels */}
          {dataPoints.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y="118"
              textAnchor="middle"
              className="chart-label"
            >
              {p.label}
            </text>
          ))}

          {/* Y-axis labels */}
          <text x="-10" y="5" textAnchor="end" className="chart-label">100</text>
          <text x="-10" y="55" textAnchor="end" className="chart-label">50</text>
          <text x="-10" y="105" textAnchor="end" className="chart-label">0</text>
        </svg>
      </div>
      
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 16 }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontWeight: 700, textTransform: 'uppercase' }}>Avg. Velocity</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>64.2 pts</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', fontWeight: 700, textTransform: 'uppercase' }}>Highest</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>92 pts</div>
        </div>
      </div>
    </div>
  );
};

export default VelocityChart;
