import React from 'react';

export const UserCheckIcon = () => (
  <div className='icon-overlay check'>
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='#4ade80' // Verde brillante
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}
    >
      <polyline points='20 6 9 17 4 12' />
    </svg>
  </div>
);
