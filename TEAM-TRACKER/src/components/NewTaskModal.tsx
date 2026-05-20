import React, { useState, useEffect, useRef } from 'react';
import { useAuth, fullName } from '../context/AuthContext';
import Avatar from './Avatar';
import '../styles/NewTaskModal.css';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: any) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { activeUsers } = useAuth();
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(activeUsers[0]);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
          triggerRef.current?.focus();
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isDropdownOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      setFocusedIndex(activeUsers.findIndex(m => m.id === assignee.id));
    }
  }, [isDropdownOpen, assignee]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsDropdownOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < activeUsers.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : activeUsers.length - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          setAssignee(activeUsers[focusedIndex]);
          setIsDropdownOpen(false);
          triggerRef.current?.focus();
        }
        break;
      case 'Tab':
        setIsDropdownOpen(false);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onCreate({
      title,
      assignee: { name: fullName(assignee) },
      priority,
      dueDate: dueDate || 'No date set',
      status: 'In Progress',
    });

    setTitle('');
    setAssignee(activeUsers[0]);
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="header-accent"></div>
          <div className="header-content">
            <h2 id="modal-title" className="modal-title">Create New Task</h2>
            <button 
              className="close-btn" 
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field full-width">
            <label htmlFor="task-title" className="field-label">Task Title</label>
            <input
              id="task-title"
              type="text"
              className="text-input title-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label id="assignee-label" className="field-label">Assignee</label>
              <div className="custom-dropdown" ref={dropdownRef}>
                <button 
                  ref={triggerRef}
                  type="button"
                  className={`dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onKeyDown={handleKeyDown}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  aria-labelledby="assignee-label"
                >
                  <Avatar user={assignee} size={24} className="dropdown-avatar" />
                  <span className="dropdown-name">{fullName(assignee)}</span>
                  <svg className={`chevron ${isDropdownOpen ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="dropdown-popover">
                    <ul 
                      ref={listboxRef}
                      className="dropdown-list" 
                      role="listbox" 
                      aria-labelledby="assignee-label"
                      tabIndex={-1}
                    >
                      {activeUsers.map((member, index) => (
                        <li
                          key={member.id}
                          role="option"
                          aria-selected={assignee.id === member.id}
                          className={`dropdown-item ${assignee.id === member.id ? 'selected' : ''} ${focusedIndex === index ? 'focused' : ''}`}
                          onClick={() => { setAssignee(member); setIsDropdownOpen(false); triggerRef.current?.focus(); }}
                          onMouseEnter={() => setFocusedIndex(index)}
                        >
                          <Avatar user={member} size={24} className="dropdown-avatar" />
                          <div className="item-info">
                            <span className="item-name">{fullName(member)}</span>
                            <span className="item-role">{member.role === 'admin' ? 'Admin' : 'Member'}</span>
                          </div>
                          {assignee.id === member.id && (
                            <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="due-date" className="field-label">Due Date</label>
              <div className="input-with-icon">
                <input
                  id="due-date"
                  type="date"
                  className="date-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Priority Level</label>
            <div className="priority-selector">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`priority-option ${p} ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                  aria-pressed={priority === p}
                >
                  <span className="priority-dot"></span>
                  <span className="priority-label">{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                </button>
              ))}
              <div className={`priority-indicator ${priority}`} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="action-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="action-btn create">
              <span>Create Task</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
