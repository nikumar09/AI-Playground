import React from 'react';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar5 from '../assets/avatar5.png';

const activities = [
  { id: 1, member: 'Sarah Chen', action: 'Completed task', task: 'Design System Update', time: '2 hours ago', avatar: avatar2 },
  { id: 2, member: 'Jordan Smyth', action: 'Commented on', task: 'API Authentication Flow', time: '4 hours ago', avatar: avatar3 },
  { id: 3, member: 'Liam Wilson', action: 'Pushed code to', task: 'Database Optimization', time: '5 hours ago', avatar: avatar5 },
];

const ActivityTable: React.FC = () => {
  return (
    <div className="card">
      <h3 className="section-title">Recent Activity</h3>
      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Action</th>
              <th>Task</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id}>
                <td className="member-td">
                  <div className="member-cell">
                    <img src={activity.avatar} alt={activity.member} className="avatar" style={{ width: 28, height: 28 }} />
                    <span>{activity.member}</span>
                  </div>
                </td>
                <td data-label="Action" style={{ color: 'var(--secondary-text)' }}>{activity.action}</td>
                <td data-label="Task" style={{ fontWeight: 600 }}>{activity.task}</td>
                <td data-label="Time" style={{ color: 'var(--secondary-text)' }}>{activity.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
