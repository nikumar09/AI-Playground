import React, { useMemo } from 'react';
import type { DailyDataPoint } from '../data/analyticsData';

interface ProductivityChartProps {
  data: DailyDataPoint[];
}

// SVG layout constants
const W = 800, H = 220;
const PAD = { left: 44, right: 16, top: 20, bottom: 48 };
const PW = W - PAD.left - PAD.right;   // plot width
const PH = H - PAD.top - PAD.bottom;  // plot height
const Y_MAX = 8;
const Y_TICKS = [0, 2, 4, 6, 8];

function toSvg(index: number, value: number, count: number): { x: number; y: number } {
  return {
    x: PAD.left + (index / (count - 1)) * PW,
    y: PAD.top + PH - (value / Y_MAX) * PH,
  };
}

// Catmull-Rom → cubic bezier conversion for smooth lines
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  const { pts, avgPts, total, peak, dailyAvg } = useMemo(() => {
    const n = data.length;
    const pts = data.map((d, i) => toSvg(i, d.completed, n));

    // 7-day moving average
    const avgPts = data.map((_, i) => {
      const window = data.slice(Math.max(0, i - 6), i + 1);
      const avg = window.reduce((s, d) => s + d.completed, 0) / window.length;
      return toSvg(i, avg, n);
    });

    const total = data.reduce((s, d) => s + d.completed, 0);
    const peak = Math.max(...data.map(d => d.completed));
    const workingDays = data.filter(d => d.completed > 0).length;
    const dailyAvg = workingDays > 0 ? (total / workingDays).toFixed(1) : '0';

    return { pts, avgPts, total, peak, dailyAvg };
  }, [data]);

  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${PAD.top + PH} L ${pts[0].x},${PAD.top + PH} Z`;
  const avgLinePath = smoothPath(avgPts);

  // Show every 5th label to avoid crowding
  const labelIndices = new Set(data.map((_, i) => i).filter(i => i % 5 === 0 || i === data.length - 1));

  return (
    <div className="productivity-chart-card card">
      <div className="chart-card-header">
        <div>
          <h3 className="section-title" style={{ margin: 0 }}>Productivity Trend</h3>
          <span className="chart-subtitle">Daily task completions — last 30 days</span>
        </div>
        <div className="chart-kpis">
          <div className="chart-kpi">
            <span className="chart-kpi-value">{total}</span>
            <span className="chart-kpi-label">Total</span>
          </div>
          <div className="chart-kpi">
            <span className="chart-kpi-value">{dailyAvg}</span>
            <span className="chart-kpi-label">Avg/day</span>
          </div>
          <div className="chart-kpi">
            <span className="chart-kpi-value">{peak}</span>
            <span className="chart-kpi-label">Peak</span>
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#4F46E5' }} />
          Completions
        </span>
        <span className="legend-item">
          <span className="legend-line" style={{ background: '#F59E0B' }} />
          7-day avg
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="productivity-svg"
        role="img"
        aria-label="Productivity trend chart showing daily task completions over the last 30 days"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4F46E5" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines + Y labels */}
        {Y_TICKS.map(v => {
          const y = PAD.top + PH - (v / Y_MAX) * PH;
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke={v === 0 ? '#9CA3AF' : '#E5E7EB'} strokeWidth={v === 0 ? 1.5 : 1} strokeDasharray={v === 0 ? '' : '4 3'} />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="chart-axis-label">{v}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Main completion line */}
        <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* 7-day moving average */}
        <path d={avgLinePath} fill="none" stroke="#F59E0B" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />

        {/* Data dots */}
        {pts.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="3.5"
            fill="white" stroke="#4F46E5" strokeWidth="2" />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => labelIndices.has(i) && (
          <text key={i} x={pts[i].x} y={H - 8} textAnchor="middle" className="chart-axis-label">{d.date}</text>
        ))}
      </svg>
    </div>
  );
};

export default ProductivityChart;
