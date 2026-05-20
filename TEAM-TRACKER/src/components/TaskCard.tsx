import React from 'react';
import '../styles/TaskCard.css';

interface TaskCardProps {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  assignee: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  dueDate: string;
  isCompleted?: boolean;
  onToggle?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  priority,
  assignee,
  dueDate,
  isCompleted = false,
  onToggle,
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
      className={`task-card priority-${priority}`}
      role="article"
      tabIndex={0}
    >
      <div className="task-checkbox-wrapper">
        <button
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          aria-label={`Mark "${title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          aria-pressed={isCompleted}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      <div className="task-content">
        <div className="task-header">
          <span className={`priority-pill pill-${priority}`}>
            <span className="priority-dot"></span>
            {priority.toUpperCase()}
          </span>
          <button
            className="options-btn"
            onClick={(e) => e.stopPropagation()}
            aria-label="More options"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>

        <div className="task-main">
          <h4 className={`task-title ${isCompleted ? 'completed' : ''}`}>
            {title}
          </h4>
          {description && <p className="task-description">{description}</p>}
        </div>

        <div className="task-footer">
          <div className="assignee">
            {assignee.avatar ? (
              <img src={assignee.avatar} alt={assignee.name} className="assignee-avatar" />
            ) : (
              <div className="assignee-initials">
                {assignee.initials || getInitials(assignee.name)}
              </div>
            )}
            <span className="assignee-name">{assignee.name}</span>
          </div>
          <div className="due-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
