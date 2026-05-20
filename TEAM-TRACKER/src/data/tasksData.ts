export type TaskStatus   = 'In Progress' | 'Completed' | 'Blocked';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  assignee: { name: string; avatar?: string; initials?: string };
  dueDate: string;
  status: TaskStatus;
  hoursTracked: number;
}

export const initialTasks: Task[] = [
  { id: 1, title: 'Implement user authentication system', priority: 'high',   assignee: { name: 'Alice Johnson' },   dueDate: '3 days left',  status: 'In Progress', hoursTracked: 8 },
  { id: 2, title: 'Design mobile app wireframes',         priority: 'medium', assignee: { name: 'Bob Smith' },       dueDate: '7 days left',  status: 'In Progress', hoursTracked: 4 },
  { id: 3, title: 'Fix navigation menu bug',              priority: 'high',   assignee: { name: 'Carol Davis' },     dueDate: '2 days ago',   status: 'Completed',   hoursTracked: 2 },
  { id: 4, title: 'Update API documentation',             priority: 'low',    assignee: { name: 'David Wilson' },    dueDate: '10 days left', status: 'In Progress', hoursTracked: 3 },
  { id: 5, title: 'Database migration to PostgreSQL',     priority: 'high',   assignee: { name: 'Edward Norton' },   dueDate: 'Tomorrow',     status: 'Blocked',     hoursTracked: 6 },
  { id: 6, title: 'Security audit of production server',  priority: 'high',   assignee: { name: 'Fiona Gallagher' }, dueDate: '5 days left',  status: 'In Progress', hoursTracked: 5 },
  { id: 7, title: 'Quarterly performance review prep',    priority: 'low',    assignee: { name: 'George Miller' },   dueDate: 'In 2 weeks',   status: 'Completed',   hoursTracked: 1 },
  { id: 8, title: 'Optimize frontend bundle size',        priority: 'medium', assignee: { name: 'Hannah Abbott' },   dueDate: '4 days left',  status: 'In Progress', hoursTracked: 4 },
];
