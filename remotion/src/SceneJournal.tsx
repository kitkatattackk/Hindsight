import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Fredoka';
import { BRAND } from './brand';
import { AppHeader } from './AppHeader';
import { AppBottomNav } from './AppBottomNav';

// SVG face icons — same as SceneRitual, avoids OS emoji rendering
const FaceSVG: React.FC<{ score: number; size?: number }> = ({ score, size = 36 }) => {
  const type = score >= 4 ? 'smile' : score >= 3 ? 'meh' : 'frown';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={BRAND.black}
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="8.5" cy="9.5" r="1.5" fill={BRAND.black} stroke="none" />
      <circle cx="15.5" cy="9.5" r="1.5" fill={BRAND.black} stroke="none" />
      {type === 'frown' && <path d="M16 16c-.5-1.5-1.5-2.5-4-2.5s-3.5 1-4 2.5" />}
      {type === 'meh'   && <line x1="8" y1="15" x2="16" y2="15" />}
      {type === 'smile' && <path d="M8 14s1.5 2 4 2 4-2 4-2" />}
    </svg>
  );
};

const IconCalendar = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconSearch = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconPencil = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={BRAND.purple}
    strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const { fontFamily } = loadFont('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

// Matches CategoryBadge colors from Journal.tsx exactly
const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Work':          { bg: '#dbeafe', text: '#2563eb', border: '#bfdbfe' },
  'Money':         { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
  'Relationships': { bg: '#fce7f3', text: '#db2777', border: '#fbcfe8' },
  'Health':        { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' },
  'Impulse':       { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' },
  'Social':        { bg: '#fed7aa', text: '#ea580c', border: '#fdba74' },
};

const ENTRIES = [
  {
    date: 'Thursday, Apr 9th',
    mood: 4,
    decisions: [
      { category: 'Social', time: '9:59 PM', intensity: 81, text: 'Getting mad at the game' },
    ]
  },
  {
    date: 'Wednesday, Apr 8th',
    mood: 4,
    decisions: [
      { category: 'Health', time: '9:36 PM', intensity: 80, text: "I shouldn't have gone to the store with my ankle", reason: "My ankle was not ready" },
    ]
  },
  {
    date: 'Wednesday, Apr 8th',
    mood: 4,
    decisions: [
      { category: 'Impulse', time: '8:20 PM', intensity: 60, text: 'Stayed up way too late scrolling' },
    ]
  },
];

const MoodEmoji = ({ score }: { score: number }) => <FaceSVG score={score} size={36} />;

export const SceneJournal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 14 } });
  const e0In    = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const e1In    = spring({ frame: frame - 24, fps, config: { damping: 14 } });
  const e2In    = spring({ frame: frame - 38, fps, config: { damping: 14 } });

  const fadeSlide = (sp: number) => ({
    opacity: sp,
    transform: `translateX(${interpolate(sp, [0, 1], [-24, 0])}px)`,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.yellow, fontFamily }}>
      <AppHeader />

      {/* bg-grid dots */}
      <AbsoluteFill style={{ opacity: 0.15, pointerEvents: 'none', top: 160 }}>
        {Array.from({ length: 20 }).map((_, r) =>
          Array.from({ length: 12 }).map((__, c) => (
            <div key={`${r}-${c}`} style={{
              position: 'absolute', top: r * 100 + 50, left: c * 100 + 50,
              width: 6, height: 6, borderRadius: '50%', backgroundColor: BRAND.black,
            }} />
          ))
        )}
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: 160, bottom: 0, left: 0, right: 0, padding: '44px 52px 280px', display: 'flex', flexDirection: 'column', gap: 36, overflowY: 'hidden' }}>

        {/* Header row — "Your Reflection Log" + entry count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: titleIn, transform: `translateY(${interpolate(titleIn, [0, 1], [-20, 0])}px)` }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: BRAND.black }}>Your Reflection Log</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, color: 'rgba(0,0,0,0.5)' }}>
            <IconCalendar size={30} /> <span>{ENTRIES.length} entries</span>
          </div>
        </div>

        {/* Search bar — matches retro-input */}
        <div style={{
          opacity: titleIn,
          position: 'relative',
          backgroundColor: BRAND.white,
          border: `4px solid ${BRAND.black}`,
          borderRadius: 36,
          padding: '24px 40px 24px 80px',
          fontSize: 28,
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 600,
          boxShadow: '4px 4px 0px rgba(0,0,0,1)',
        }}>
          <span style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.35)' }}><IconSearch size={30} /></span>
          Search decisions, categories, or notes...
        </div>

        {/* Timeline — matches border-l-4 border-black/10 with circle markers */}
        <div style={{ paddingLeft: 52, borderLeft: `8px solid rgba(0,0,0,0.1)`, display: 'flex', flexDirection: 'column', gap: 56 }}>
          {ENTRIES.map((entry, ei) => {
            const spArr = [e0In, e1In, e2In];
            const sp = spArr[ei];
            const badge = BADGE_COLORS[entry.decisions[0].category] || BADGE_COLORS['Work'];

            return (
              <div key={ei} style={{ position: 'relative', ...fadeSlide(sp) }}>
                {/* Circle marker — matches -left-[14px] w-6 h-6 border-4 rounded-full */}
                <div style={{
                  position: 'absolute',
                  left: -76,
                  top: 16,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: BRAND.white,
                  border: `6px solid ${BRAND.black}`,
                  zIndex: 10,
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Date + mood */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.purple }}>{entry.date}</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      backgroundColor: BRAND.white,
                      border: `4px solid ${BRAND.black}`,
                      borderRadius: 20,
                      padding: '10px 20px',
                      boxShadow: '3px 3px 0px rgba(0,0,0,1)',
                    }}>
                      <MoodEmoji score={entry.mood} />
                      <span style={{ fontSize: 28, fontWeight: 700 }}>{entry.mood}/5</span>
                    </div>
                  </div>

                  {/* Decision cards */}
                  {entry.decisions.map((d, di) => (
                    <div key={di} style={{
                      backgroundColor: BRAND.white,
                      border: `5px solid ${BRAND.black}`,
                      borderRadius: 36,
                      boxShadow: '6px 6px 0px rgba(0,0,0,1)',
                      padding: '36px 40px',
                    }}>
                      {/* Category badge + time + intensity */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `2px solid ${badge.border}`,
                            borderRadius: 100,
                            padding: '6px 20px',
                            fontSize: 24,
                            fontWeight: 700,
                          }}>
                            {d.category}
                          </div>
                          <span style={{ fontSize: 22, color: 'rgba(0,0,0,0.4)', fontFamily: 'monospace' }}>{d.time}</span>
                        </div>
                        {/* Intensity bar + % — matches w-24 h-2 bg-gray-100 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 160, height: 12, backgroundColor: '#f3f4f6', borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <div style={{ height: '100%', width: `${d.intensity}%`, backgroundColor: BRAND.pink, borderRadius: 6 }} />
                          </div>
                          <span style={{ fontSize: 22, fontWeight: 700 }}>{d.intensity}%</span>
                        </div>
                      </div>

                      {/* Decision text */}
                      <div style={{ fontSize: 34, fontWeight: 700, color: BRAND.black, marginBottom: 12 }}>{d.text}</div>

                      {/* Reason */}
                      {'reason' in d && d.reason && (
                        <div style={{ fontSize: 24, color: 'rgba(0,0,0,0.4)', fontStyle: 'italic', marginBottom: 20 }}>
                          Reason: {d.reason as string}
                        </div>
                      )}

                      {/* Divider + Revisit */}
                      <div style={{ borderTop: '2px solid rgba(0,0,0,0.05)', paddingTop: 24, marginTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 700, color: BRAND.purple }}>
                          <IconPencil size={26} /> Revisit this decision
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <AppBottomNav active="journal" />
    </AbsoluteFill>
  );
};
