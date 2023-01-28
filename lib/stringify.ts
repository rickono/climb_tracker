import { ClimbsAngleOptions } from '@/schema/pocketbase-types';

export const displayClimbAngle = (angle: string) => {
  switch (angle) {
    case 'vertical':
      return 'Vertical';
    case 'overhang-1':
      return 'Slight overhang';
    case 'overhang-2':
      return 'Overhang';
    case 'overhang-3':
      return 'Severe overhang';
    case 'slab':
      return 'Slab';
    default:
      return 'Unknown';
  }
};

export const displaySeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60).toString();
  const secondsLeft = (seconds % 60).toString();
  return `${minutes}:${secondsLeft.padStart(2, '0')}`;
};
