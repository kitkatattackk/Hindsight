import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { BRAND } from './brand';

// Remotion-native Molly — no Framer Motion, driven by useCurrentFrame()
export const Molly: React.FC<{ size?: number; expression?: 'neutral' | 'happy' }> = ({
  size = 120,
  expression = 'neutral',
}) => {
  const frame = useCurrentFrame();

  // Gentle float
  const floatY = interpolate(
    Math.sin((frame / 90) * Math.PI * 2),
    [-1, 1],
    [expression === 'happy' ? -10 : -6, 0]
  );

  // Blink: fast close every ~4.5s (135 frames)
  const blinkCycle = frame % 135;
  const blinkScale = blinkCycle > 125 && blinkCycle < 132
    ? interpolate(blinkCycle, [125, 128, 132], [1, 0.08, 1])
    : 1;

  // Sparkle pulse
  const sparkleScale = 1 + 0.15 * Math.sin((frame / 45) * Math.PI * 2);

  return (
    <div style={{ width: size, height: size, transform: `translateY(${floatY}px)`, filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,1))' }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size} overflow="visible">
        {/* Body */}
        <path
          d="M20 40C20 20 40 10 55 10C75 10 85 25 85 45C85 70 75 90 50 90C25 90 15 75 15 55C15 50 18 45 20 40Z"
          fill={BRAND.yellow}
          stroke="black"
          strokeWidth="4"
        />

        {/* Left Eye */}
        <g style={{ transformOrigin: '40px 45px', transform: `scaleY(${blinkScale})` }}>
          <circle cx="40" cy="45" r="10" fill="white" stroke="black" strokeWidth="3" />
          <circle cx="42" cy={expression === 'happy' ? 46 : 40} r="4" fill="black" />
          <circle cx="45" cy="38" r="1.5" fill="white" />
        </g>

        {/* Right Eye */}
        <g style={{ transformOrigin: '65px 48px', transform: `scaleY(${blinkScale})` }}>
          <circle cx="65" cy="48" r="12" fill="white" stroke="black" strokeWidth="3" />
          <circle cx="67" cy={expression === 'happy' ? 50 : 42} r="5" fill="black" />
          <circle cx="71" cy="40" r="2" fill="white" />
        </g>

        {/* Mouth */}
        {expression === 'happy' ? (
          <path
            d="M40 65C40 65 45 74 55 65"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : (
          <ellipse cx="45" cy="65" rx="4" ry="6" fill="black" />
        )}

        {/* Sparkle */}
        <path
          d="M75 25L78 32L85 35L78 38L75 45L72 38L65 35L72 32L75 25Z"
          fill="white"
          style={{ transformOrigin: '75px 35px', transform: `scale(${sparkleScale})`, opacity: 0.7 + 0.3 * Math.sin((frame / 45) * Math.PI * 2) }}
        />
      </svg>
    </div>
  );
};
