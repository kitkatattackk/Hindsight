import React from 'react';
import { useCurrentFrame } from 'remotion';
import { BRAND } from './brand';
import { Molly } from './Molly';

// Matches the app's Layout header exactly, scaled to 1080px canvas
export const AppHeader: React.FC = () => {
  return (
    <div style={{
      height: 160,
      backgroundColor: BRAND.yellow,
      borderBottom: `5px solid ${BRAND.black}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 52px',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Left: Molly + HINDSIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Molly size={88} />
        <span style={{
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: 2,
          color: BRAND.black,
        }}>
          HINDSIGHT
        </span>
      </div>

      {/* Right: Ritual button — matches retro-button with purple bg */}
      <div style={{
        backgroundColor: BRAND.purple,
        color: BRAND.white,
        border: `4px solid ${BRAND.black}`,
        borderRadius: 100,
        padding: '18px 44px',
        fontSize: 34,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '4px 4px 0px rgba(0,0,0,1)',
      }}>
        <span style={{ fontSize: 32 }}>＋</span>
        Ritual
      </div>
    </div>
  );
};
