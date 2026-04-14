import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type MollyExpression = 'neutral' | 'surprised' | 'thinking' | 'happy' | 'sleepy';

interface MollyCharacterProps {
  className?: string;
  size?: number;
  expression?: MollyExpression;
  color?: string;
}

export default function MollyCharacter({
  className,
  size = 100,
  expression = 'neutral',
  color = '#FDEE88',
}: MollyCharacterProps) {

  // Body float — [0, val, 0] ensures seamless loop (first === last keyframe)
  const bodyAnim = () => {
    switch (expression) {
      case 'happy':
        return {
          animate: { y: [0, -10, 0], rotate: [0, 4, 0] },
          transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'surprised':
        return {
          animate: { y: [0, -4, 0] },
          transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'thinking':
        return {
          animate: { y: [0, -5, 0], rotate: [0, -3, 0] },
          transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const },
        };
      case 'sleepy':
        return {
          animate: { y: [0, 4, 0, -2, 0], rotate: [0, 3, 0, -1, 0] },
          transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const, times: [0, 0.3, 0.5, 0.75, 1] },
        };
      default:
        return {
          animate: { y: [0, -6, 0] },
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
        };
    }
  };

  // Blink config — scaleY from [1 → 0.08 → 1], fast snap
  const blinkAnim = {
    scaleY: [1, 1, 0.08, 1, 1] as number[],
  };
  const blinkTransition = {
    duration: 4.5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    times: [0, 0.44, 0.47, 0.53, 1],
  };

  // Sleepy droop — slowly closes, briefly flutters open (fighting sleep), closes again
  const sleepyAnim = {
    scaleY: [0.35, 0.15, 0.35, 0.12, 0.9, 0.35] as number[],
  };
  const sleepyTransition = {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    times: [0, 0.2, 0.4, 0.55, 0.75, 1],
  };

  const body = bodyAnim();

  // Eye state per expression
  const eyeState = {
    leftScale: expression === 'surprised' ? 1.2 : 1,
    rightScale: expression === 'surprised' ? 1.15 : 1,
    sleepy: expression === 'sleepy',
    blink: expression !== 'sleepy' && expression !== 'surprised',
    leftPupilCy: expression === 'sleepy' ? 44 : 40,
    leftPupilCx: expression === 'thinking' ? 44 : 42,
    rightPupilCy: expression === 'sleepy' ? 47 : 42,
    rightPupilCx: expression === 'thinking' ? 69 : 67,
  };

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, willChange: 'transform' }}
      animate={body.animate}
      transition={body.transition}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        overflow="visible"
      >
        {/* Body */}
        <path
          d="M20 40C20 20 40 10 55 10C75 10 85 25 85 45C85 70 75 90 50 90C25 90 15 75 15 55C15 50 18 45 20 40Z"
          fill={color}
          stroke="black"
          strokeWidth="4"
        />

        {/* Left Eye — group scaled from eye center so blink stays in place */}
        <motion.g
          style={{ transformOrigin: '40px 45px' }}
          animate={
            eyeState.sleepy
              ? sleepyAnim
              : eyeState.blink
              ? blinkAnim
              : { scaleY: 1, scale: eyeState.leftScale }
          }
          transition={
            eyeState.sleepy
              ? sleepyTransition
              : eyeState.blink
              ? blinkTransition
              : { duration: 0.3, ease: 'easeOut' }
          }
        >
          <circle cx="40" cy="45" r="10" fill="white" stroke="black" strokeWidth="3" />
          <motion.circle
            cx="42" cy="40" r="4" fill="black"
            animate={{ cy: eyeState.leftPupilCy, cx: eyeState.leftPupilCx }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
          <circle cx="45" cy="38" r="1.5" fill="white" />
        </motion.g>

        {/* Right Eye — group scaled from eye center, slight blink delay */}
        <motion.g
          style={{ transformOrigin: '65px 48px' }}
          animate={
            eyeState.sleepy
              ? { scaleY: 0.3, scale: 1 }
              : eyeState.blink
              ? blinkAnim
              : { scaleY: 1, scale: eyeState.rightScale }
          }
          transition={
            eyeState.blink
              ? { ...blinkTransition, delay: 0.06 }
              : { duration: 0.3, ease: 'easeOut' }
          }
        >
          <circle cx="65" cy="48" r="12" fill="white" stroke="black" strokeWidth="3" />
          <motion.circle
            cx="67" cy="42" r="5" fill="black"
            animate={{ cy: eyeState.rightPupilCy, cx: eyeState.rightPupilCx }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
          <circle cx="71" cy="40" r="2" fill="white" />
        </motion.g>

        {/* Mouth */}
        <AnimatePresence mode="wait">
          {expression === 'happy' ? (
            <motion.path
              key="happy-mouth"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                d: [
                  'M40 65C40 65 45 72 55 65',
                  'M40 65C40 65 45 76 55 65',
                  'M40 65C40 65 45 72 55 65',
                ],
              }}
              exit={{ opacity: 0 }}
              d="M40 65C40 65 45 72 55 65"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
              transition={{
                opacity: { duration: 0.2 },
                d: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          ) : expression === 'thinking' ? (
            <motion.path
              key="thinking-mouth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              d="M40 68H55"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          ) : (
            <motion.ellipse
              key="default-mouth"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                ry: expression === 'surprised' ? 9 : 6,
                rx: expression === 'surprised' ? 7 : 4,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              cx="45" cy="65" rx="4" ry="6"
              fill="black"
              style={{ transformOrigin: '45px 65px' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Sparkle */}
        <motion.path
          d="M75 25L78 32L85 35L78 38L75 45L72 38L65 35L72 32L75 25Z"
          fill="white"
          style={{ transformOrigin: '75px 35px' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Sleepy ZZZs — float up and fade out */}
        {expression === 'sleepy' && [
          { delay: 0,   x: 82, startY: 8,  endY: -22, size: 7  },
          { delay: 1.6, x: 89, startY: 2,  endY: -30, size: 10 },
          { delay: 3.2, x: 76, startY: -2, endY: -38, size: 13 },
        ].map((z, i) => (
          <motion.text
            key={i}
            x={z.x}
            fontFamily="Arial Black, sans-serif"
            fontWeight="900"
            fontSize={z.size}
            fill="black"
            textAnchor="middle"
            initial={{ y: z.startY, opacity: 0 }}
            animate={{
              y: [z.startY, z.startY - 8, z.endY],
              opacity: [0, 0.85, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: z.delay,
              ease: 'easeInOut',
              times: [0, 0.25, 1],
            }}
          >
            Z
          </motion.text>
        ))}
      </svg>
    </motion.div>
  );
}
