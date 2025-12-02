import React from 'react';

export const UserUncheckIcon = () => (
  <div className='icon-overlay uncheck'>
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='#f87171' // Rojo suave
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{ opacity: 0.5 }}
    >
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  </div>
);
