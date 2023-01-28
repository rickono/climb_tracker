import React from 'react';
import {
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Stats = ({
  className,
  duration,
  hardestAscent,
  tops,
  attempts,
}: {
  className?: string;
  duration: string;
  hardestAscent: string;
  tops: number;
  attempts: number;
}) => {
  console.log(tops, attempts);
  return (
    <div className={`stats shadow ${className}`}>
      <div className='stat'>
        <div className='stat-figure text-primary'>
          <ClockIcon className='w-8 h-8' />
        </div>
        <div className='stat-title'>Workout Duration</div>
        <div className='stat-value text-primary'>{duration}</div>
        {/* <div className='stat-desc'>21% more than last month</div> */}
      </div>

      <div className='stat'>
        <div className='stat-figure text-secondary'>
          <StarIcon className='w-8 h-8' />
        </div>
        <div className='stat-title'>Hardest Ascent</div>
        <div className='stat-value text-secondary'>{hardestAscent}</div>
        {/* <div className='stat-desc'>Better than 50% of sessions</div> */}
      </div>

      <div className='stat'>
        <div className='stat-figure text-success'>
          <CheckCircleIcon className='w-8 h-8' />
        </div>
        <div className='stat-value'>{Math.round((tops * 100) / attempts)}%</div>
        <div className='stat-title'>Top Rate</div>
        <div className='stat-desc text-secondary font-medium'>
          {tops} total tops
        </div>
      </div>
    </div>
  );
};

export default Stats;
