import React from 'react';
import { BRAND } from './brand';

type Tab = 'insights' | 'journal' | 'settings';

// Lucide-style SVG icons matching the real app (LayoutDashboard, BookOpen, Settings)
const IconInsights = ({ color }: { color: string }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconJournal = ({ color }: { color: string }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconSettings = ({ color }: { color: string }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// Matches the app's bottom nav exactly
export const AppBottomNav: React.FC<{ active: Tab }> = ({ active }) => {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'insights',  label: 'Insights'  },
    { id: 'journal',   label: 'Journal'   },
    { id: 'settings',  label: 'Settings'  },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 40,
      left: 40,
      right: 40,
      backgroundColor: BRAND.white,
      border: `5px solid ${BRAND.black}`,
      borderRadius: 52,
      boxShadow: '4px 4px 0px rgba(0,0,0,1)',
      padding: '18px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      gap: 8,
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        const iconColor = isActive ? BRAND.white : BRAND.black;
        return (
          <div key={tab.id} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '16px 24px',
            borderRadius: 32,
            backgroundColor: isActive ? BRAND.purple : 'transparent',
            color: isActive ? BRAND.white : BRAND.black,
          }}>
            {tab.id === 'insights'  && <IconInsights  color={iconColor} />}
            {tab.id === 'journal'   && <IconJournal   color={iconColor} />}
            {tab.id === 'settings'  && <IconSettings  color={iconColor} />}
            <span style={{ fontSize: 22, fontWeight: 700 }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};
