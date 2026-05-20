import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TasksContext';
import TaskCard from './TaskCard';
import NewTaskModal from './NewTaskModal';

const FILTER_OPTIONS = ['All', 'In Progress', 'Completed', 'Blocked'] as const;

const TaskListView: React.FC = () => {
  const { tasks, toggleComplete, createTask } = useTasks();
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    let result = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.assignee.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filter, search, tasks]);

  const handleCreateTask = (newTask: any) => {
    createTask(newTask);
  };

  return (
    <div className="tasks-section">
      <div className="tasks-header-flex">
        <div className="header-title-group">
          <h2 className="section-title">Team Tasks</h2>
          <button className="new-task-btn" onClick={() => setIsModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Task</span>
          </button>
        </div>

        <div className="tasks-controls">
          <div className="task-search-bar">
            <svg className="task-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="task-search-input"
              placeholder="Search by title or assignee…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search tasks"
            />
            {search && (
              <button className="task-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="filter-group">
            {FILTER_OPTIONS.map(option => (
              <button
                key={option}
                className={`filter-btn ${filter === option ? 'active' : ''}`}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tasks-grid">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            priority={task.priority}
            assignee={task.assignee}
            dueDate={task.dueDate}
            isCompleted={task.status === 'Completed'}
            onToggle={() => toggleComplete(task.id)}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="no-tasks">
          {search.trim()
            ? `No tasks match "${search.trim()}".`
            : 'No tasks found for this filter.'}
        </div>
      )}

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
};

export default TaskListView;
