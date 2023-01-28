import React from 'react';

const InfoCard = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className='card shadow px-4 py-2 bg-primary-content flex-row items-center gap-2 w-fit'>
      {icon}
      {text}
    </div>
  );
};

export default InfoCard;
