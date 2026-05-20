import React from 'react';
import { type AppUser, getInitials } from '../types/auth';

interface AvatarProps {
  user: Pick<AppUser, 'firstName' | 'lastName' | 'avatarDataUrl' | 'avatarColor'>;
  size?: number; // px, default 36
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 36, className = '' }) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    objectFit: 'cover',
  };

  if (user.avatarDataUrl) {
    return (
      <img
        src={user.avatarDataUrl}
        alt={`${user.firstName} ${user.lastName}`}
        style={style}
        className={`avatar ${className}`}
      />
    );
  }

  const fontSize = Math.round(size * 0.33);
  return (
    <div
      style={{ ...style, backgroundColor: user.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize, letterSpacing: '0.02em' }}
      className={className}
      aria-hidden="true"
    >
      {getInitials(user)}
    </div>
  );
};

export default Avatar;
