import React from 'react';
import { motion } from 'motion/react';

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
  return (
    <motion.div 
      className={className}
      style={{ width: size, height: size }}
      animate={{ 
        y: [0, -5, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
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
          <circle cx="40" cy="45" r="10" fill="white" stroke="black" strokeWidth="3" />
          <motion.circle 
            cx="42" cy="40" r="4" fill="black" 
            animate={{ 
              cy: expression === 'sleepy' ? 45 : [40, 38, 40], 
              cx: [42, 43, 42],
              scaleY: expression === 'sleepy' ? 0.2 : 1
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Right Eye */}
          <circle cx="65" cy="48" r="12" fill="white" stroke="black" strokeWidth="3" />
          <motion.circle 
            cx="67" cy="42" r="5" fill="black" 
            animate={{ 
              cy: expression === 'sleepy' ? 48 : [42, 40, 42], 
              cx: [67, 68, 67],
              scaleY: expression === 'sleepy' ? 0.2 : 1
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
          />
        </g>

        {/* Mouth */}
        {expression === 'happy' ? (
          <path d="M40 65C40 65 45 72 55 65" stroke="black" strokeWidth="4" strokeLinecap="round" />
        ) : expression === 'thinking' ? (
          <path d="M40 68H55" stroke="black" strokeWidth="4" strokeLinecap="round" />
        ) : (
          <motion.ellipse 
            cx="45" cy="65" rx="4" ry="6" fill="black" 
            animate={expression === 'surprised' ? { ry: 8, rx: 6 } : { ry: 6, rx: 4 }}
          />
        )}

        {/* Shine/Sparkle */}
        <path 
          d="M75 25L78 32L85 35L78 38L75 45L72 38L65 35L72 32L75 25Z" 
          fill="white" 
          className="animate-pulse"
        />
      </svg>
    </motion.div>
  );
}
