import React from 'react';

export const Stat = ({
  icon = '',
  description = '',
  title,
  value,
}: {
  icon?: React.ReactNode;
  title: string;
  value: string;
  description?: string;
}) => {
  return (
    <div className='stat'>
      <div className='stat-figure text-secondary'>{icon}</div>
      <div className='stat-title'>{title}</div>
      <div className='stat-value'>{value}</div>
      {description && <div className='stat-desc'>{description}</div>}
    </div>
  );
};

const Stats = ({
  stats,
}: {
  stats: {
    icon?: React.ReactNode;
    description?: string;
    title: string;
    value: string;
  }[];
}) => {
  return (
    <div className='stats shadow'>
      {stats.map((stat) => (
        <Stat
          key={stat.title}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </div>
  );
};

export default Stats;
