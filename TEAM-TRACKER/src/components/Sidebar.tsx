import React from 'react';
import logo from '../assets/logo.png';
import { useAuth, fullName } from '../context/AuthContext';
import Avatar from './Avatar';

export type Tab = 'dashboard' | 'tasks' | 'analytics' | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ReactNode }[] = [
  {
    tab: 'dashboard', label: 'Dashboard',
    icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="11" width="7" height="9" /><rect x="3" y="15" width="7" height="6" /></svg>,
  },
  {
    tab: 'tasks', label: 'Tasks',
    icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  },
  {
    tab: 'analytics', label: 'Analytics',
    icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  },
  {
    tab: 'settings', label: 'Settings',
    icon: <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const { users } = useAuth();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="Team Tracker" className="logo-img" />
            <span className="logo-text">Team Tracker</span>
          </div>
          <button className="close-menu" onClick={onClose} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="nav-section">
          <div className="nav-title">Menu</div>
          <ul className="nav-links">
            {NAV_ITEMS.map(({ tab, label, icon }) => (
              <li key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => { onTabChange(tab); onClose(); }}
                >
                  {icon}
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="team-list">
          <div className="nav-title">Team Members</div>
          {users.map(user => (
            <div key={user.id} className={`team-member ${user.status === 'inactive' ? 'member-inactive' : ''}`}>
              <div className="avatar-wrapper">
                <Avatar user={user} size={36} className="avatar" />
                <div className={`status-pulse ${user.status === 'active' ? 'status-active' : 'status-offline'}`} />
              </div>
              <div className="member-info">
                <span className="member-name">{fullName(user)}</span>
                <span className="member-role">
                  {user.status === 'inactive' ? 'Inactive' : (user.role === 'admin' ? 'Admin' : 'Member')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
