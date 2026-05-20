export interface DailyDataPoint {
  date: string;
  completed: number;
  created: number;
}

export interface MemberPerformance {
  name: string;
  role: string;
  color: string;
  completed: number;
  total: number;
  hours: number;
  trend: 'up' | 'down' | 'steady';
}

export interface AtRiskTask {
  title: string;
  assignee: string;
  daysStuck: number;
  priority: 'high' | 'medium' | 'low';
  status: 'Blocked' | 'In Progress';
}

// Last 30 days: Apr 19 – May 18, 2026
// Pattern: low weekends, mid-week peaks, upward trend toward end
export const DAILY_DATA: DailyDataPoint[] = [
  { date: 'Apr 19', completed: 1, created: 3 }, // Sat
  { date: 'Apr 20', completed: 0, created: 1 }, // Sun
  { date: 'Apr 21', completed: 3, created: 4 }, // Mon
  { date: 'Apr 22', completed: 4, created: 2 }, // Tue
  { date: 'Apr 23', completed: 2, created: 3 }, // Wed
  { date: 'Apr 24', completed: 5, created: 3 }, // Thu
  { date: 'Apr 25', completed: 3, created: 2 }, // Fri
  { date: 'Apr 26', completed: 1, created: 1 }, // Sat
  { date: 'Apr 27', completed: 0, created: 0 }, // Sun
  { date: 'Apr 28', completed: 4, created: 5 }, // Mon
  { date: 'Apr 29', completed: 6, created: 4 }, // Tue
  { date: 'Apr 30', completed: 5, created: 3 }, // Wed
  { date: 'May 1',  completed: 4, created: 4 }, // Thu
  { date: 'May 2',  completed: 3, created: 2 }, // Fri
  { date: 'May 3',  completed: 2, created: 2 }, // Sat
  { date: 'May 4',  completed: 1, created: 1 }, // Sun
  { date: 'May 5',  completed: 5, created: 6 }, // Mon
  { date: 'May 6',  completed: 7, created: 5 }, // Tue — peak
  { date: 'May 7',  completed: 6, created: 4 }, // Wed
  { date: 'May 8',  completed: 4, created: 3 }, // Thu
  { date: 'May 9',  completed: 5, created: 4 }, // Fri
  { date: 'May 10', completed: 2, created: 2 }, // Sat
  { date: 'May 11', completed: 1, created: 1 }, // Sun
  { date: 'May 12', completed: 4, created: 5 }, // Mon
  { date: 'May 13', completed: 6, created: 4 }, // Tue
  { date: 'May 14', completed: 5, created: 3 }, // Wed
  { date: 'May 15', completed: 3, created: 3 }, // Thu
  { date: 'May 16', completed: 4, created: 3 }, // Fri
  { date: 'May 17', completed: 2, created: 2 }, // Sat
  { date: 'May 18', completed: 3, created: 2 }, // Sun (today)
];

export const MEMBER_PERFORMANCE: MemberPerformance[] = [
  { name: 'Sarah Chen',    role: 'Senior Designer',  color: '#10B981', completed: 24, total: 27, hours: 86, trend: 'up'     },
  { name: 'Jordan Smyth',  role: 'Lead Developer',   color: '#4F46E5', completed: 21, total: 26, hours: 98, trend: 'up'     },
  { name: 'Liam Wilson',   role: 'Backend Dev',      color: '#06B6D4', completed: 18, total: 21, hours: 74, trend: 'steady' },
  { name: 'Alex Rivera',   role: 'Project Manager',  color: '#8B5CF6', completed: 14, total: 19, hours: 62, trend: 'down'   },
  { name: 'Maria Garcia',  role: 'QA Engineer',      color: '#F59E0B', completed: 12, total: 17, hours: 58, trend: 'up'     },
];

export const AT_RISK_TASKS: AtRiskTask[] = [
  { title: 'Database migration to PostgreSQL',  assignee: 'Edward Norton',   daysStuck: 8,  priority: 'high',   status: 'Blocked'     },
  { title: 'Implement user authentication',     assignee: 'Alice Johnson',   daysStuck: 6,  priority: 'high',   status: 'In Progress' },
  { title: 'Security audit of prod server',     assignee: 'Fiona Gallagher', daysStuck: 4,  priority: 'high',   status: 'In Progress' },
  { title: 'Optimize frontend bundle size',     assignee: 'Hannah Abbott',   daysStuck: 3,  priority: 'medium', status: 'In Progress' },
];

export const BOTTLENECK_SUMMARY = {
  blockedCount:      1,
  atRiskCount:       3,
  avgDaysInProgress: 4.2,
  completionRate:    76,   // % of tasks completed vs created in the period
  velocityChange:    '+18', // % change vs previous 30 days
};
