import React from 'react';
import { useTasks } from '../context/TasksContext';
import StatsSection from './StatsSection';
import TeamProgressChart from './TeamProgressChart';

const DashboardOverview: React.FC = () => {
  const { stats, teamStats } = useTasks();
  return (
    <div className="dashboard-overview">
      <StatsSection {...stats} />
      <TeamProgressChart members={teamStats} />
    </div>
  );
};

export default DashboardOverview;
