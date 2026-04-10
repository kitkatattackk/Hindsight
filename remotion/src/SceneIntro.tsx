import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Fredoka';
import { BRAND, SHADOW, BORDER } from './brand';
import { Molly } from './Molly';

const { fontFamily } = loadFont('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

const SHADOW_SM = '2px 2px 0px rgba(0,0,0,1)';

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const logoY = interpolate(logoScale, [0, 1], [60, 0]);

  const taglineOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: 'clamp' });
  const taglineY = interpolate(frame, [20, 38], [20, 0], { extrapolateRight: 'clamp' });

  const badge1Opacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });
  const badge2Opacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: 'clamp' });
  const badge3Opacity = interpolate(frame, [55, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.yellow, fontFamily, alignItems: 'center', justifyContent: 'center' }}>
      {/* Dotted background */}
      <AbsoluteFill style={{ opacity: 0.25 }}>
        {Array.from({ length: 22 }).map((_, row) =>
          Array.from({ length: 14 }).map((__, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                top: row * 100 + 50,
                left: col * 100 + 50,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: BRAND.black,
              }}
            />
          ))
        )}
      </AbsoluteFill>

      {/* Main card */}
      <div style={{
        backgroundColor: BRAND.white,
        border: BORDER,
        borderWidth: 4,
        borderRadius: 48,
        boxShadow: SHADOW,
        padding: '72px 100px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        transform: `translateY(${logoY}px) scale(${logoScale})`,
        minWidth: 740,
      }}>
        <Molly size={160} expression="happy" />

        <div style={{ fontSize: 100, fontWeight: 700, color: BRAND.black, letterSpacing: -2, lineHeight: 1 }}>
          Hindsight
        </div>

        <div style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontSize: 36,
          color: BRAND.purple,
          fontWeight: 600,
          textAlign: 'center',
        }}>
          Turn regrets into wisdom
        </div>
      </div>

      {/* Feature badges */}
      <div style={{
        position: 'absolute',
        bottom: 180,
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 900,
      }}>
        {[
          { label: '✦  Daily Rituals', opacity: badge1Opacity },
          { label: '▣  Insight Charts', opacity: badge2Opacity },
          { label: '≡  Reflection Log', opacity: badge3Opacity },
        ].map(({ label, opacity }) => (
          <div key={label} style={{
            opacity,
            backgroundColor: BRAND.white,
            border: BORDER,
            borderWidth: 3,
            borderRadius: 100,
            boxShadow: SHADOW_SM,
            padding: '16px 32px',
            fontSize: 28,
            fontWeight: 600,
            color: BRAND.black,
          }}>
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
