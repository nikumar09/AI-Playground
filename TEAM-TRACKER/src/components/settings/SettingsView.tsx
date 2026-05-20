import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../Avatar';
import { fullName } from '../../types/auth';
import type { AppUser } from '../../types/auth';

// ─── Profile Settings ──────────────────────────────────────────────────────

const ProfileSettings: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  if (!currentUser) return null;

  const [first, setFirst] = useState(currentUser.firstName);
  const [last, setLast]   = useState(currentUser.lastName);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!first.trim() || !last.trim()) return;
    updateProfile({ firstName: first.trim(), lastName: last.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      updateProfile({ avatarDataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="settings-section">
      <h2 className="settings-section-title">My Profile</h2>

      {/* Avatar */}
      <div className="settings-avatar-row">
        <Avatar user={currentUser} size={72} />
        <div className="settings-avatar-actions">
          <button
            type="button"
            className="settings-btn-outline"
            onClick={() => fileRef.current?.click()}
          >
            Change Photo
          </button>
          {currentUser.avatarDataUrl && (
            <button
              type="button"
              className="settings-btn-text"
              onClick={() => updateProfile({ avatarDataUrl: undefined })}
            >
              Remove
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarChange}
            aria-label="Upload profile photo"
          />
          <span className="settings-avatar-hint">JPG, PNG or GIF · max 5 MB</span>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-form-row">
          <div className="settings-field">
            <label className="settings-label" htmlFor="set-first">First name</label>
            <input
              id="set-first"
              type="text"
              className="settings-input"
              value={first}
              onChange={e => setFirst(e.target.value)}
              required
            />
          </div>
          <div className="settings-field">
            <label className="settings-label" htmlFor="set-last">Last name</label>
            <input
              id="set-last"
              type="text"
              className="settings-input"
              value={last}
              onChange={e => setLast(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="settings-field">
          <label className="settings-label" htmlFor="set-email">
            Email
            <span className="settings-locked-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Locked
            </span>
          </label>
          <input
            id="set-email"
            type="email"
            className="settings-input settings-input-locked"
            value={currentUser.email}
            readOnly
            aria-readonly="true"
          />
          <span className="settings-field-hint">Email is your account identifier and cannot be changed.</span>
        </div>

        <div className="settings-field">
          <label className="settings-label">Role</label>
          <span className={`settings-role-badge ${currentUser.role === 'admin' ? 'role-admin' : 'role-user'}`}>
            {currentUser.role === 'admin' ? 'Administrator' : 'Team Member'}
          </span>
        </div>

        <div className="settings-form-actions">
          <button type="submit" className="settings-btn-primary">Save Changes</button>
          {saved && <span className="settings-saved-msg">✓ Profile updated</span>}
        </div>
      </form>
    </section>
  );
};

// ─── User Management (admin only) ─────────────────────────────────────────

const StatusToggle: React.FC<{ user: AppUser; onToggle: () => void; isSelf: boolean }> = ({ user, onToggle, isSelf }) => (
  <button
    type="button"
    className={`status-toggle ${user.status === 'active' ? 'toggle-active' : 'toggle-inactive'}`}
    onClick={onToggle}
    disabled={isSelf}
    title={isSelf ? 'You cannot change your own status' : user.status === 'active' ? 'Mark inactive' : 'Mark active'}
    aria-label={`${user.status === 'active' ? 'Deactivate' : 'Activate'} ${fullName(user)}`}
  >
    <span className="toggle-knob" />
  </button>
);

const UserManagement: React.FC = () => {
  const { currentUser, users, toggleUserStatus } = useAuth();
  if (!currentUser || currentUser.role !== 'admin') return null;

  const others = users.filter(u => u.id !== currentUser.id);

  return (
    <section className="settings-section">
      <h2 className="settings-section-title">User Management</h2>
      <p className="settings-section-sub">Mark team members active or inactive. Inactive users cannot sign in but their task history is preserved.</p>

      <div className="user-table" role="list">
        {/* Header */}
        <div className="user-table-header" aria-hidden="true">
          <span>Member</span>
          <span>Role</span>
          <span>Status</span>
          <span>Active</span>
        </div>

        {users.map(user => {
          const isSelf = user.id === currentUser.id;
          return (
            <div key={user.id} className="user-table-row" role="listitem">
              <div className="user-table-member">
                <Avatar user={user} size={36} />
                <div>
                  <span className="user-table-name">
                    {fullName(user)}
                    {isSelf && <span className="user-you-badge">You</span>}
                  </span>
                  <span className="user-table-email">{user.email}</span>
                </div>
              </div>

              <span className={`settings-role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                {user.role === 'admin' ? 'Admin' : 'Member'}
              </span>

              <span className={`user-status-pill ${user.status === 'active' ? 'pill-active' : 'pill-inactive'}`}>
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </span>

              <StatusToggle
                user={user}
                onToggle={() => toggleUserStatus(user.id)}
                isSelf={isSelf}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── Settings View ─────────────────────────────────────────────────────────

const SettingsView: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  return (
    <div className="settings-view">
      <div className="settings-page-header">
        <h1 className="settings-page-title">Settings</h1>
        <p className="settings-page-sub">
          {currentUser.role === 'admin'
            ? 'Manage your profile and team members.'
            : 'Manage your profile.'}
        </p>
      </div>

      <ProfileSettings />
      <UserManagement />
    </div>
  );
};

export default SettingsView;
