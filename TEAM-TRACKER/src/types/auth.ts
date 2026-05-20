export type UserRole   = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarDataUrl?: string; // base64 uploaded photo; undefined = show initials
  avatarColor: string;    // color for initials circle
}

// All 5 existing team members. Admin is the only one with role='admin'.
// All start active so the assignee dropdown in NewTaskModal shows all 5.
export const SEED_USERS: AppUser[] = [
  { id: 'u1', firstName: 'Alex',   lastName: 'Rivera',  email: 'alex@teamtracker.dev',   role: 'admin', status: 'active', avatarColor: '#8B5CF6' },
  { id: 'u2', firstName: 'Sarah',  lastName: 'Chen',    email: 'sarah@teamtracker.dev',  role: 'user',  status: 'active', avatarColor: '#10B981' },
  { id: 'u3', firstName: 'Jordan', lastName: 'Smyth',   email: 'jordan@teamtracker.dev', role: 'user',  status: 'active', avatarColor: '#F59E0B' },
  { id: 'u4', firstName: 'Maria',  lastName: 'Garcia',  email: 'maria@teamtracker.dev',  role: 'user',  status: 'active', avatarColor: '#EF4444' },
  { id: 'u5', firstName: 'Liam',   lastName: 'Wilson',  email: 'liam@teamtracker.dev',   role: 'user',  status: 'active', avatarColor: '#06B6D4' },
];

export function fullName(user: Pick<AppUser, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`;
}

export function getInitials(user: Pick<AppUser, 'firstName' | 'lastName'>): string {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}
