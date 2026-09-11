import React from 'react';

interface IconProps { size?: number; className?: string; style?: React.CSSProperties; }

export const IconDashboard = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

export const IconChat = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M14 2H2a1 1 0 00-1 1v8a1 1 0 001 1h2v2l3-2h7a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M4 7h8M4 5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconFactory = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M1 13V7l4-3v3l4-3v3l4-3v9H1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <rect x="2.5" y="10" width="2" height="3" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="7" y="10" width="2" height="3" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="11.5" y="10" width="2" height="3" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

export const IconCalendar = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="1" y="3" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M1 7h14M5 1v4M11 1v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconMachine = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="1" y="4" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M4 4V2h8v2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 6.5v1M8 10v1M5.5 9H6.5M9.5 9h1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconWork = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="2" y="3" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 3V1h6v2M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconAlert = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M8 6v3.5M8 11.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconQuality = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconCost = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 4v1.5M8 10.5V12M6 7c0-1.1.9-1.5 2-1.5s2 .7 2 1.5-1 1.5-2 1.5-2 .4-2 1.5 1 1.5 2 1.5 2-.5 2-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

export const IconActions = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="13" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export const IconDocs = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M10 2v3h3M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconReport = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="2" y="1" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M10 10l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconAdmin = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M12 10l1 1M10 12l1 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconChevronRight = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconChevronDown = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconBell = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 1.5a5 5 0 00-5 5v3L1.5 11.5h13L13 9.5v-3a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M6.5 11.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

export const IconSearch = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconUser = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 14.5c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconServer = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="1" y="2" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="1" y="9" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="12.5" cy="4.5" r="1" fill="currentColor"/>
    <circle cx="12.5" cy="11.5" r="1" fill="currentColor"/>
  </svg>
);

export const IconSync = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M13.5 8A5.5 5.5 0 012.5 8M2.5 8l2-2M2.5 8l2 2M2.5 8A5.5 5.5 0 0113.5 8M13.5 8l-2-2M13.5 8l-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconCheck = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconX = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconPlus = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconFilter = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconSend = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M14 2L7 9M14 2L9 14l-2-5-5-2 12-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

export const IconWrench = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M11.5 2a3 3 0 00-3 3c0 .4.07.8.2 1.1L2.6 12.2a1.4 1.4 0 001.98 1.98l6.1-6.1c.3.13.7.2 1.1.2a3 3 0 000-6z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="11.5" cy="5" r="1" fill="currentColor"/>
  </svg>
);

export const IconTrendUp = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 11l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 4h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconTrendDown = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 5l4 4 3-3 5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12h4V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconLink = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M7 9a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7.5 3.5M9 7a3.5 3.5 0 00-5 0L2 9a3.5 3.5 0 005 5l1.5-1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconDownload = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M8 2v8M5 7l3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconLock = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <rect x="2" y="7" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8" cy="11" r="1" fill="currentColor"/>
  </svg>
);

export const IconEye = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M1 8c1.5-3 3.8-5 7-5s5.5 2 7 5c-1.5 3-3.8 5-7 5S2.5 11 1 8z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

export const IconEyeOff = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 2l12 12M6.8 6.8A2 2 0 0010.2 10M4 4.4C2.4 5.5 1.4 6.8 1 8c1.5 3 3.8 5 7 5 1.3 0 2.5-.3 3.5-.8M7 3.1C7.3 3 7.7 3 8 3c3.2 0 5.5 2 7 5-.4 1-1 1.9-1.7 2.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const IconRefresh = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M14 8A6 6 0 112 8M2 8V4M2 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconCircle = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

export const IconInfo = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconArrowLeft = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IconMenuCollapse = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M2 4h12M2 8h8M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
