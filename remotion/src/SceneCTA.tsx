import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Fredoka';
import { BRAND, SHADOW, SHADOW_SM, BORDER } from './brand';
import { Molly } from './Molly';

const { fontFamily } = loadFont('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mollyIn  = spring({ frame,            fps, config: { damping: 12, stiffness: 120 } });
  const titleIn  = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const tagIn    = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const btnIn    = spring({ frame: frame - 32, fps, config: { damping: 14, stiffness: 140 } });
  const subIn    = spring({ frame: frame - 46, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.yellow, fontFamily, alignItems: 'center', justifyContent: 'center' }}>

      {/* Dotted background — matches intro */}
      <AbsoluteFill style={{ opacity: 0.25 }}>
        {Array.from({ length: 22 }).map((_, row) =>
          Array.from({ length: 14 }).map((__, col) => (
            <div key={`${row}-${col}`} style={{
              position: 'absolute',
              top: row * 100 + 50,
              left: col * 100 + 50,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: BRAND.black,
            }} />
          ))
        )}
      </AbsoluteFill>

      {/* Main card — same retro style as intro */}
      <div style={{
        backgroundColor: BRAND.white,
        border: BORDER,
        borderWidth: 4,
        borderRadius: 56,
        boxShadow: SHADOW,
        padding: '80px 100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        minWidth: 800,
      }}>

        {/* Molly */}
        <div style={{ transform: `scale(${mollyIn}) translateY(${interpolate(mollyIn, [0, 1], [30, 0])}px)` }}>
          <Molly size={200} expression="happy" />
        </div>

        {/* Wordmark */}
        <div style={{
          fontSize: 110,
          fontWeight: 700,
          color: BRAND.black,
          letterSpacing: -2,
          lineHeight: 1,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
        }}>
          Hindsight
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 36,
          color: BRAND.purple,
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.4,
          opacity: tagIn,
          transform: `translateY(${interpolate(tagIn, [0, 1], [16, 0])}px)`,
        }}>
          Stop carrying your regrets.<br />Start learning from them.
        </div>

        {/* Download button — retro style */}
        <div style={{
          opacity: btnIn,
          transform: `scale(${btnIn})`,
          width: '100%',
        }}>
          <div style={{
            backgroundColor: BRAND.purple,
            border: BORDER,
            borderWidth: 4,
            borderRadius: 100,
            padding: '28px 60px',
            fontSize: 40,
            fontWeight: 700,
            color: BRAND.white,
            boxShadow: SHADOW,
            textAlign: 'center',
          }}>
            Download Free →
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          opacity: subIn,
          fontSize: 22,
          color: '#999',
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          Available on iOS &amp; Android
        </div>
      </div>
    </AbsoluteFill>
  );
};
