import React from 'react';

export interface TeamMemberProps {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'busy' | 'offline';
  avatar: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, status, avatar }) => {
  return (
    <div className="team-member">
      <div className="avatar-wrapper">
        <img src={avatar} alt={name} className="avatar" />
        <div className={`status-pulse status-${status}`}></div>
      </div>
      <div className="member-info">
        <span className="member-name">{name}</span>
        <span className="member-role">{role}</span>
      </div>
    </div>
  );
};

export default TeamMember;
