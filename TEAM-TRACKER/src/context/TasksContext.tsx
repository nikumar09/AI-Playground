import React, { createContext, useContext, useState, useMemo } from 'react';
import { initialTasks, type Task, type TaskStatus } from '../data/tasksData';
import type { MemberProgress } from '../components/TeamProgressChart';

interface StatsShape {
  total: number;
  completed: number;
  inProgress: number;
  completionPct: number;
  totalHours: number;
}

interface TasksContextValue {
  tasks: Task[];
  stats: StatsShape;
  teamStats: MemberProgress[];
  toggleComplete: (id: number) => void;
  createTask: (task: Omit<Task, 'id' | 'hoursTracked'>) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const stats = useMemo<StatsShape>(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalHours = tasks.reduce((s, t) => s + t.hoursTracked, 0);
    return { total, completed, inProgress, completionPct, totalHours };
  }, [tasks]);

  const teamStats = useMemo<MemberProgress[]>(() => {
    const map = new Map<string, { total: number; completed: number }>();
    tasks.forEach(task => {
      const name = task.assignee.name;
      const entry = map.get(name) ?? { total: 0, completed: 0 };
      map.set(name, {
        total: entry.total + 1,
        completed: entry.completed + (task.status === 'Completed' ? 1 : 0),
      });
    });
    return Array.from(map.entries())
      .map(([name, s]) => ({ name, ...s, pct: Math.round((s.completed / s.total) * 100) }))
      .sort((a, b) => b.pct - a.pct || a.name.localeCompare(b.name));
  }, [tasks]);

  const toggleComplete = (id: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, status: (t.status === 'Completed' ? 'In Progress' : 'Completed') as TaskStatus }
        : t
    ));
  };

  const createTask = (newTask: Omit<Task, 'id' | 'hoursTracked'>) => {
    setTasks(prev => [{ ...newTask, id: Date.now(), hoursTracked: 0 }, ...prev]);
  };

  return (
    <TasksContext.Provider value={{ tasks, stats, teamStats, toggleComplete, createTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
}
