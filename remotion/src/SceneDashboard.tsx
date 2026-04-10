import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Fredoka';
import { BRAND } from './brand';
import { AppHeader } from './AppHeader';
import { AppBottomNav } from './AppBottomNav';

// Lucide-style SVG icons
const IconTrendingDown = ({ size = 28, color = BRAND.purple }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const IconPieChart = ({ size = 28, color = BRAND.pink }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

const IconActivity = ({ size = 28, color = BRAND.purple }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconSparkles = ({ size = 28, color = BRAND.black }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);

const IconFlame = ({ size = 28, color = BRAND.black }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const IconZap = ({ size = 28, color = BRAND.white }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const { fontFamily } = loadFont('normal', { weights: ['400', '600', '700'], subsets: ['latin'] });

// retro-card style matching the app exactly
const card: React.CSSProperties = {
  backgroundColor: BRAND.white,
  border: `5px solid ${BRAND.black}`,
  borderRadius: 44,
  boxShadow: '8px 8px 0px rgba(0,0,0,1)',
  padding: '44px 48px',
};

// Regret Decay — matches app's AreaChart: purple stroke, gradient fill, dotted grid, pink active dot
const DecayChart: React.FC<{ progress: number }> = ({ progress }) => {
  const W = 900, H = 360;
  const padL = 60, padR = 24, padT = 20, padB = 50;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  // Flat near zero, spike at Apr 09, then drops — matches real app screenshot
  const DATA = [2, 3, 2, 4, 3, 2, 3, 5, 4, 3, 4, 3, 5, 4, 3, 4, 5, 4, 3, 5, 4, 3, 4, 3, 4, 82, 70, 12, 6, 3];
  //             Mar12            Mar19            Mar26            Apr02            Apr09
  const DATES = ['Mar 12','','','','','','','Mar 19','','','','','','','Mar 26','','','','','','','Apr 02','','','','','','','Apr 09',''];

  const vis = Math.max(2, Math.round(progress * DATA.length));
  const slice = DATA.slice(0, vis);

  const tx = (i: number) => padL + (i / (DATA.length - 1)) * cW;
  const ty = (v: number) => padT + ((100 - v) / 100) * cH;

  const pts = slice.map((v, i) => `${tx(i)},${ty(v)}`).join(' ');
  const area = `${tx(0)},${H - padB} ${pts} ${tx(slice.length - 1)},${H - padB}`;

  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor={BRAND.purple} stopOpacity={0.3} />
          <stop offset="95%" stopColor={BRAND.purple} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Grid — matches CartesianGrid strokeDasharray="3 3" vertical={false} */}
      {[25, 50, 75, 100].map(v => (
        <line key={v} x1={padL} x2={W - padR} y1={ty(v)} y2={ty(v)}
          stroke="#eeeeee" strokeWidth={2} strokeDasharray="3 3" />
      ))}
      {/* Y axis — 0, 25, 50, 75, 100 */}
      {[0, 25, 50, 75, 100].map(v => (
        <text key={v} x={padL - 10} y={ty(v) + 6} fontSize={20} textAnchor="end" fill="#aaa" fontFamily={fontFamily}>{v}</text>
      ))}
      {/* X axis dates — every 7 points: Mar 12, Mar 19, Mar 26, Apr 02, Apr 09 */}
      {DATES.map((d, i) => d ? (
        <text key={i} x={tx(i)} y={H - 8} fontSize={19} textAnchor="middle" fill="#aaa" fontFamily={fontFamily}>{d}</text>
      ) : null)}
      {/* Area fill */}
      {slice.length > 1 && <polygon points={area} fill="url(#aG)" />}
      {/* Line — strokeWidth={4} stroke="#4C22ED" */}
      {slice.length > 1 && (
        <polyline points={pts} fill="none" stroke={BRAND.purple} strokeWidth={5}
          strokeLinejoin="round" strokeLinecap="round" />
      )}
      {/* Active dot — r={6} fill="#F310F6" stroke="#000" strokeWidth={2} */}
      {slice.length > 0 && (
        <circle cx={tx(slice.length - 1)} cy={ty(slice[slice.length - 1])}
          r={10} fill={BRAND.pink} stroke={BRAND.black} strokeWidth={3} />
      )}
    </svg>
  );
};

// Regret Categories — thick bars, rounded right ends only, no % labels
const CategoryBars: React.FC<{ progress: number }> = ({ progress }) => {
  const cats = [
    { name: 'Social', pct: 85, color: BRAND.purple },
    { name: 'Health', pct: 72, color: BRAND.pink },
    { name: 'Work',   pct: 50, color: BRAND.yellow },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {cats.map((c, i) => {
        const w = interpolate(progress, [i * 0.15, i * 0.15 + 0.4], [0, c.pct], { extrapolateRight: 'clamp' });
        return (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 120, textAlign: 'right', fontSize: 28, fontWeight: 700, color: BRAND.black, flexShrink: 0 }}>{c.name}</div>
            {/* Track — left-rounded */}
            <div style={{ flex: 1, height: 56, backgroundColor: '#f0f0f0', borderRadius: '8px 28px 28px 8px', overflow: 'hidden', border: '2px solid #e0e0e0' }}>
              {/* Fill — left-square, right-rounded */}
              <div style={{
                height: '100%', width: `${w}%`, backgroundColor: c.color,
                borderRadius: '0 28px 28px 0',
                border: c.color === BRAND.yellow ? `3px solid ${BRAND.black}` : 'none',
                boxSizing: 'border-box',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Regret Intensity Mapping — with D3 ENGINE badge and % axis
const IntensityBars: React.FC<{ progress: number }> = ({ progress }) => {
  const cats = [
    { name: 'Social', pct: 85, color: BRAND.purple },
    { name: 'Health', pct: 50, color: BRAND.pink },
    { name: 'Work',   pct: 50, color: BRAND.yellow },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {cats.map((c, i) => {
          const w = interpolate(progress, [i * 0.15, i * 0.15 + 0.4], [0, c.pct], { extrapolateRight: 'clamp' });
          return (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 120, textAlign: 'right', fontSize: 28, fontWeight: 700, color: BRAND.black, flexShrink: 0 }}>{c.name}</div>
              <div style={{ flex: 1, height: 48, backgroundColor: '#f0f0f0', borderRadius: '8px 24px 24px 8px', overflow: 'hidden', border: '2px solid #e0e0e0' }}>
                <div style={{ height: '100%', width: `${w}%`, backgroundColor: c.color,
                  borderRadius: '0 24px 24px 0',
                  border: c.color === BRAND.yellow ? `3px solid ${BRAND.black}` : 'none',
                  boxSizing: 'border-box',
                }} />
              </div>
              <div style={{ width: 68, fontSize: 26, fontWeight: 700, color: BRAND.black }}>{Math.round(w)}%</div>
            </div>
          );
        })}
      </div>
      {/* X axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingLeft: 140 }}>
        {['0%', '25%', '50%', '75%', '100%'].map(l => (
          <span key={l} style={{ fontSize: 20, color: '#aaa', fontFamily, fontWeight: 600 }}>{l}</span>
        ))}
      </div>
    </>
  );
};

export const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (f: number, d = 0) => spring({ frame: frame - d, fps, config: { damping: 14 } });

  const titleIn   = s(frame, 0);
  const statsIn   = s(frame, 8);
  const insightIn = s(frame, 16);
  const decayIn   = s(frame, 24);
  const catIn     = s(frame, 36);
  const intIn     = s(frame, 48);

  const chartProg = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });
  const barProg   = interpolate(frame, [50, 100], [0, 1], { extrapolateRight: 'clamp' });

  const fadeSlide = (sp: number) => ({
    opacity: sp,
    transform: `translateY(${interpolate(sp, [0, 1], [32, 0])}px)`,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.yellow, fontFamily }}>
      <AppHeader />

      {/* Dotted bg-grid */}
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

      {/* Scrollable content area */}
      <div style={{ position: 'absolute', top: 160, bottom: 0, left: 0, right: 0, padding: '44px 52px 280px', display: 'flex', flexDirection: 'column', gap: 36, overflowY: 'hidden' }}>

        {/* "Dashboard" heading + subtitle */}
        <div style={fadeSlide(titleIn)}>
          <div style={{ fontSize: 80, fontWeight: 700, color: BRAND.black, lineHeight: 1 }}>Dashboard</div>
          <div style={{ fontSize: 30, color: 'rgba(0,0,0,0.5)', marginTop: 8 }}>Your emotional patterns at a glance.</div>
        </div>

        {/* Stat cards row — Today's Ritual + Streak */}
        <div style={{ display: 'flex', gap: 28, ...fadeSlide(statsIn) }}>
          {/* Today's Ritual */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24,
            ...card, padding: '28px 32px', borderRadius: 36, boxShadow: '5px 5px 0px rgba(0,0,0,1)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: `4px solid ${BRAND.black}`,
              backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconSparkles size={36} color={BRAND.black} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 2 }}>Today's Ritual</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: BRAND.black }}>Pending</div>
            </div>
          </div>
          {/* Streak */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 24,
            ...card, padding: '28px 32px', borderRadius: 36, boxShadow: '5px 5px 0px rgba(0,0,0,1)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: `4px solid ${BRAND.black}`,
              backgroundColor: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconFlame size={36} color={BRAND.black} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 2 }}>Current Streak</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: BRAND.black }}>2 Days</div>
            </div>
          </div>
        </div>

        {/* Insight card — purple, matches retro-card bg-brand-purple */}
        <div style={{
          ...fadeSlide(insightIn),
          backgroundColor: BRAND.purple,
          border: `5px solid ${BRAND.purple}`,
          borderRadius: 44,
          boxShadow: '8px 8px 0px rgba(0,0,0,1)',
          padding: '40px 48px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 32,
          color: BRAND.white,
        }}>
          <div style={{ width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconZap size={40} color={BRAND.white} />
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>A gentle observation...</div>
            <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
              Next time you're about to make a social decision, remember that these tend to stay with you longer (avg. 85% regret). Worth a second thought?
            </div>
          </div>
        </div>

        {/* Regret Decay chart */}
        <div style={{ ...card, ...fadeSlide(decayIn) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.black, display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconTrendingDown size={40} color={BRAND.purple} /> Regret Decay (30d)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* "?" help button — matches app's HelpCircle button */}
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                border: `3px solid ${BRAND.black}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 700, color: 'rgba(0,0,0,0.5)',
              }}>?</div>
              <div style={{ fontSize: 18, fontWeight: 700, backgroundColor: BRAND.black, color: BRAND.white,
                padding: '6px 16px', borderRadius: 8, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 2 }}>
                30D
              </div>
            </div>
          </div>
          <DecayChart progress={chartProg} />
        </div>

        {/* Regret Categories */}
        <div style={{ ...card, ...fadeSlide(catIn) }}>
          <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.black, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconPieChart size={40} color={BRAND.pink} /> Regret Categories
          </div>
          <CategoryBars progress={barProg} />
        </div>

        {/* Regret Intensity Mapping */}
        <div style={{ ...card, ...fadeSlide(intIn) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.black, display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconActivity size={40} color={BRAND.purple} /> Regret Intensity Mapping
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.5)', color: BRAND.white,
              padding: '6px 16px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: 2 }}>
              D3 ENGINE
            </div>
          </div>
          <IntensityBars progress={barProg} />
        </div>

      </div>

      <AppBottomNav active="insights" />
    </AbsoluteFill>
  );
};
