import React from 'react';
import { motion, AnimatePresence, Transition } from 'motion/react';

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
  color = '#FDEE88'
}: MollyCharacterProps) {
  const getIdleAnimation = () => {
    switch (expression) {
      case 'happy':
        return {
          y: [0, -12, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.08, 1]
        };
      case 'surprised':
        return {
          y: [0, -4, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0]
        };
      case 'thinking':
        return {
          y: [0, -5, 0],
          rotate: [-3, 3, -3],
        };
      case 'sleepy':
        return {
          y: [0, -3, 0],
          scale: [1, 0.97, 1],
        };
      default:
        return {
          y: [0, -6, 0],
          rotate: [0, 2, -2, 0]
        };
    }
  };

  const getTransition = (): Transition => {
    switch (expression) {
      case 'happy':
        return { duration: 1.5, repeat: Infinity, ease: "easeInOut" };
      case 'sleepy':
        return { duration: 8, repeat: Infinity, ease: "easeInOut" };
      case 'surprised':
        return { duration: 0.8, repeat: Infinity, ease: "backOut" };
      case 'thinking':
        return { duration: 5, repeat: Infinity, ease: "easeInOut" };
      default:
        return { duration: 4, repeat: Infinity, ease: "easeInOut" };
    }
  };

  return (
    <motion.div 
      className={className}
      style={{ width: size, height: size }}
      animate={getIdleAnimation()}
      transition={getTransition()}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
      >
        {/* Body */}
        <path 
          d="M20 40C20 20 40 10 55 10C75 10 85 25 85 45C85 70 75 90 50 90C25 90 15 75 15 55C15 50 18 45 20 40Z" 
          fill={color} 
          stroke="black" 
          strokeWidth="4"
        />
        
        {/* Eyes */}
        <g className="eyes">
          {/* Left Eye */}
          <motion.circle 
            cx="40" cy="45" r="10" fill="white" stroke="black" strokeWidth="3" 
            animate={{ 
              scale: expression === 'surprised' ? 1.2 : 1,
              scaleY: [1, 1, 0.1, 1, 1] 
            }}
            transition={{ 
              scaleY: { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] },
              scale: { duration: 0.3 }
            }}
          />
          <motion.circle 
            cx="42" cy="40" r="4" fill="black" 
            animate={{ 
              cy: expression === 'sleepy' ? 45 : 40, 
              cx: expression === 'thinking' ? 44 : 42,
              scaleY: expression === 'sleepy' ? 0.2 : [1, 1, 0, 1, 1]
            }}
            transition={{ 
              scaleY: { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] },
              cx: { duration: 0.3 },
              cy: { duration: 0.3 }
            }}
          />
          
          {/* Right Eye */}
          <motion.circle 
            cx="65" cy="48" r="12" fill="white" stroke="black" strokeWidth="3" 
            animate={{ 
              scale: expression === 'surprised' ? 1.15 : 1,
              scaleY: [1, 1, 0.1, 1, 1] 
            }}
            transition={{ 
              scaleY: { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1], delay: 0.1 },
              scale: { duration: 0.3 }
            }}
          />
          <motion.circle 
            cx="67" cy="42" r="5" fill="black" 
            animate={{ 
              cy: expression === 'sleepy' ? 48 : 42, 
              cx: expression === 'thinking' ? 69 : 67,
              scaleY: expression === 'sleepy' ? 0.2 : [1, 1, 0, 1, 1]
            }}
            transition={{ 
              scaleY: { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1], delay: 0.1 },
              cx: { duration: 0.3 },
              cy: { duration: 0.3 }
            }}
          />
        </g>

        {/* Mouth */}
        <AnimatePresence mode="wait">
          {expression === 'happy' ? (
            <motion.path 
              key="happy-mouth"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                d: ["M40 65C40 65 45 72 55 65", "M40 65C40 65 45 75 55 65", "M40 65C40 65 45 72 55 65"] 
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              d="M40 65C40 65 45 72 55 65" 
              stroke="black" 
              strokeWidth="4" 
              strokeLinecap="round"
              transition={{ 
                d: { duration: 2, repeat: Infinity },
                default: { duration: 0.2 }
              }}
            />
          ) : expression === 'thinking' ? (
            <motion.path 
              key="thinking-mouth"
              initial={{ opacity: 0, x: -2 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 2 }}
              d="M40 68H55" 
              stroke="black" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
          ) : (
            <motion.ellipse 
              key="default-mouth"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                ry: expression === 'surprised' ? 9 : 6, 
                rx: expression === 'surprised' ? 7 : 4 
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              cx="45" cy="65" rx="4" ry="6" fill="black" 
            />
          )}
        </AnimatePresence>

        {/* Shine/Sparkle */}
        <motion.path 
          d="M75 25L78 32L85 35L78 38L75 45L72 38L65 35L72 32L75 25Z" 
          fill="white" 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}
