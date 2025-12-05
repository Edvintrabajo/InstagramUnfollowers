import React from 'react';

export const Logo = () => (
  <svg
    width='42'
    height='42'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='app-logo'
  >
    <defs>
      <linearGradient
        id='logoGradient'
        x1='2'
        y1='2'
        x2='22'
        y2='22'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#06b6d4' />
        <stop offset='1' stopColor='#3b82f6' />
      </linearGradient>
    </defs>

    {/* Radar exterior */}
    <path
      d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'
      stroke='url(#logoGradient)'
      strokeWidth='2'
      strokeOpacity='0.3'
    />

    {/* Ondas */}
    <path
      d='M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'
      stroke='url(#logoGradient)'
      strokeWidth='1.5'
      strokeDasharray='3 3'
    />

    {/* Ojo central */}
    <circle cx='12' cy='12' r='2' fill='#fff' />

    {/* Línea de escaneo */}
    <path d='M12 12L17 7' stroke='#fff' strokeWidth='1.5' strokeLinecap='round' />
  </svg>
);
