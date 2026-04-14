import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Fredoka';
import { BRAND } from './brand';
import { Molly } from './Molly';

const { fontFamily } = loadFont('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

// SVG face icons matching Lucide's Frown/Meh/Smile
const FaceIcon: React.FC<{ type: 'frown' | 'meh' | 'smile'; size?: number; opacity?: number }> = ({ type, size = 56, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
    {type === 'frown' && <path d="M16 16c-.5-1.5-1.5-2.5-4-2.5s-3.5 1-4 2.5" />}
    {type === 'meh'   && <line x1="8" y1="15" x2="16" y2="15" />}
    {type === 'smile' && <path d="M8 14s1.5 2 4 2 4-2 4-2" />}
  </svg>
);

const MOODS: { icon: 'frown' | 'meh' | 'smile'; opacity?: number }[] = [
  { icon: 'frown' },
  { icon: 'frown', opacity: 0.55 },
  { icon: 'meh' },
  { icon: 'smile', opacity: 0.55 },
  { icon: 'smile' },
];

// Matches the app's "retro-button"
const RetroButton: React.FC<{ label: string; opacity?: number }> = ({ label, opacity = 1 }) => (
  <div style={{
    backgroundColor: BRAND.purple,
    border: `5px solid ${BRAND.black}`,
    borderRadius: 100,
    padding: '36px 52px',
    textAlign: 'center',
    color: BRAND.white,
    fontSize: 42,
    fontWeight: 700,
    boxShadow: '6px 6px 0px rgba(0,0,0,1)',
    opacity,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  }}>
    {label} <span style={{ fontSize: 36 }}>›</span>
  </div>
);

// Step 1: "How was your day?"
const StepMood: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();

  const mollyIn  = spring({ frame: localFrame,           fps, config: { damping: 12 } });
  const titleIn  = spring({ frame: localFrame - 8,  fps, config: { damping: 14 } });
  const modsIn   = spring({ frame: localFrame - 18, fps, config: { damping: 14 } });
  const btnIn    = interpolate(localFrame, [30, 48], [0, 1], { extrapolateRight: 'clamp' });

  const selected = 3; // meh

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60, height: '100%', padding: '80px 64px 80px', boxSizing: 'border-box' }}>
      <div style={{ transform: `scale(${mollyIn})` }}>
        <Molly size={220} />
      </div>

      <div style={{
        textAlign: 'center',
        opacity: titleIn,
        transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
      }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: BRAND.purple, lineHeight: 1.15, marginBottom: 20 }}>
          How was your day?
        </div>
        <div style={{ fontSize: 32, color: 'rgba(0,0,0,0.4)', fontWeight: 400 }}>
          Give it an honest rating.
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 24,
        justifyContent: 'center',
        opacity: modsIn,
        transform: `translateY(${interpolate(modsIn, [0, 1], [16, 0])}px)`,
      }}>
        {MOODS.map((m, i) => {
          const isSelected = i + 1 === selected;
          const itemIn = spring({ frame: localFrame - 18 - i * 4, fps, config: { damping: 12, stiffness: 160 } });
          return (
            <div key={i} style={{
              width: 160,
              height: 160,
              borderRadius: 44,
              border: `5px solid ${BRAND.black}`,
              backgroundColor: isSelected ? BRAND.yellow : BRAND.white,
              boxShadow: isSelected ? '4px 4px 0px rgba(0,0,0,1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${itemIn}) ${isSelected ? 'scale(1.1)' : ''}`,
              color: BRAND.black,
            }}>
              <FaceIcon type={m.icon} size={80} opacity={m.opacity} />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', width: '100%', opacity: btnIn }}>
        <RetroButton label="Next" />
      </div>
    </div>
  );
};

// Step 2: "Any regrets?" — matches Image 24 exactly
const StepLog: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  const { fps } = useVideoConfig();

  const mollyIn  = spring({ frame: localFrame,           fps, config: { damping: 12 } });
  const titleIn  = spring({ frame: localFrame - 8,  fps, config: { damping: 14 } });
  const cardIn   = spring({ frame: localFrame - 16, fps, config: { damping: 14 } });
  const btnIn    = interpolate(localFrame, [30, 48], [0, 1], { extrapolateRight: 'clamp' });

  // "Somewhat" selected = yellow; "Work" selected = purple
  const INTENSITIES = ['A little', 'Somewhat', 'A lot'];
  const selectedIntensity = 'Somewhat';
  const CATEGORIES = ['Work', 'Money', 'Relationships', 'Health', 'Impulse', 'Social'];
  const selectedCategory = 'Work';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', padding: '60px 56px 56px', boxSizing: 'border-box', gap: 28 }}>

      {/* Molly + title */}
      <div style={{
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        opacity: titleIn,
        transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
      }}>
        <div style={{ transform: `scale(${mollyIn})` }}>
          <Molly size={140} />
        </div>
        <div style={{ fontSize: 66, fontWeight: 700, color: BRAND.purple, lineHeight: 1.1 }}>Any regrets?</div>
        <div style={{ fontSize: 28, color: 'rgba(0,0,0,0.4)', fontWeight: 400 }}>Log the decisions weighing on you.</div>
      </div>

      {/* Form card — light gray, no border, rounded */}
      <div style={{
        width: '100%',
        backgroundColor: '#ebebeb',
        borderRadius: 24,
        padding: '36px 36px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        opacity: cardIn,
        transform: `translateY(${interpolate(cardIn, [0, 1], [24, 0])}px)`,
      }}>

        {/* Input — white bg, purple focus ring */}
        <div style={{
          backgroundColor: BRAND.white,
          border: `3px solid ${BRAND.purple}`,
          borderRadius: 16,
          padding: '28px 32px',
          fontSize: 30,
          fontWeight: 400,
          color: 'rgba(0,0,0,0.35)',
          boxShadow: `0 0 0 3px rgba(76,34,237,0.15)`,
        }}>
          What's weighing on you?
        </div>

        {/* HOW MUCH REGRET? */}
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>
            How much regret?
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {INTENSITIES.map(label => {
              const isSelected = label === selectedIntensity;
              return (
                <div key={label} style={{
                  flex: 1,
                  padding: '20px 12px',
                  borderRadius: 100,
                  border: `3px solid ${BRAND.black}`,
                  backgroundColor: isSelected ? BRAND.yellow : BRAND.white,
                  color: BRAND.black,
                  textAlign: 'center',
                  fontSize: 26,
                  fontWeight: isSelected ? 700 : 600,
                }}>
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>
            Category
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {CATEGORIES.map(cat => {
              const isSelected = cat === selectedCategory;
              return (
                <div key={cat} style={{
                  padding: '14px 32px',
                  borderRadius: 100,
                  border: `3px solid ${isSelected ? BRAND.purple : BRAND.black}`,
                  backgroundColor: isSelected ? BRAND.purple : BRAND.white,
                  color: isSelected ? BRAND.white : BRAND.black,
                  fontSize: 26,
                  fontWeight: 700,
                }}>
                  {cat}
                </div>
              );
            })}
          </div>
        </div>

        {/* Log it — muted lavender (disabled/empty state) */}
        <div style={{
          backgroundColor: '#a78bfa',
          borderRadius: 16,
          padding: '30px',
          textAlign: 'center',
          color: BRAND.white,
          fontSize: 36,
          fontWeight: 700,
          opacity: btnIn,
        }}>
          Log it
        </div>
      </div>

      {/* Bottom bar: back + skip — pinned to bottom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: '100%', marginTop: 'auto', opacity: btnIn }}>
        {/* Back button — small rounded square */}
        <div style={{
          width: 88, height: 88, borderRadius: 24,
          border: `3px solid ${BRAND.black}`,
          backgroundColor: BRAND.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={BRAND.black} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
        {/* Skip button — lavender pill */}
        <div style={{
          flex: 1, padding: '26px',
          borderRadius: 100,
          backgroundColor: '#c4b5fd',
          textAlign: 'center',
          fontSize: 34, fontWeight: 700, color: BRAND.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          Skip
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={BRAND.white} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Total scene: 240 frames — Step 1 (0–120), crossfade (105–125), Step 2 (115–240)
export const SceneRitual: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const cardY   = interpolate(slideUp, [0, 1], [400, 0]);

  // Step 1 fades out 210→240, Step 2 fades in 220→256  (@ 60fps, doubled from 30fps values)
  const step1Opacity = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const step2Opacity = interpolate(frame, [220, 256], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const step1Frame = frame;
  const step2Frame = Math.max(0, frame - 230);

  // Progress bar: step 1 = 33%, step 2 = 66%
  const progressPct = interpolate(frame, [210, 250], [33, 66], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.white, fontFamily }}>
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: BRAND.white,
        transform: `translateY(${cardY}px)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Progress bar */}
        <div style={{ height: 14, backgroundColor: '#f3f4f6', flexShrink: 0 }}>
          <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: BRAND.pink, transition: 'none' }} />
        </div>

        {/* Close button */}
        <div style={{ position: 'absolute', top: 36, right: 36,
          width: 72, height: 72, borderRadius: '50%', backgroundColor: '#f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, color: BRAND.black, fontWeight: 700 }}>
          ✕
        </div>

        {/* Step 1 */}
        <div style={{ position: 'absolute', top: 14, left: 0, right: 0, bottom: 0, opacity: step1Opacity }}>
          <StepMood localFrame={step1Frame} />
        </div>

        {/* Step 2 */}
        <div style={{ position: 'absolute', top: 14, left: 0, right: 0, bottom: 0, opacity: step2Opacity }}>
          <StepLog localFrame={step2Frame} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
