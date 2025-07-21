import React, { useState, useEffect, useRef } from 'react';
import { motion, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

export type GlowEffectProps = {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  mode?:
    | 'rotate'
    | 'pulse'
    | 'breathe'
    | 'colorShift'
    | 'flowHorizontal'
    | 'static';
  blur?:
    | number
    | 'softest'
    | 'soft'
    | 'medium'
    | 'strong'
    | 'stronger'
    | 'strongest'
    | 'none';
  transition?: Transition;
  scale?: number;
  duration?: number;
};

export function GlowEffect({
  className,
  style,
  colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'],
  mode = 'rotate',
  blur = 'medium',
  transition,
  scale = 1,
  duration = 5,
}: GlowEffectProps) {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: duration,
    ease: 'linear',
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(', ')})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(', ')})`,
      ],
      transition: {
        ...(transition ?? BASE_TRANSITION),
      },
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    breathe: {
      background: [
        ...colors.map(
          (color) =>
            `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
        ),
      ],
      scale: [1 * scale, 1.05 * scale, 1 * scale],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    colorShift: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    flowHorizontal: {
      background: colors.map((color) => {
        const nextColor = colors[(colors.indexOf(color) + 1) % colors.length];
        return `linear-gradient(to right, ${color}, ${nextColor})`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    },
  };

  const getBlurClass = (blur: GlowEffectProps['blur']) => {
    if (typeof blur === 'number') {
      return `blur-[${blur}px]`;
    }

    const presets = {
      softest: 'blur-sm',
      soft: 'blur',
      medium: 'blur-md',
      strong: 'blur-lg',
      stronger: 'blur-xl',
      strongest: 'blur-xl',
      none: 'blur-none',
    };

    return presets[blur as keyof typeof presets];
  };

  return (
    <motion.div
      style={
        {
          ...style,
          '--scale': scale,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        } as React.CSSProperties
      }
      animate={animations[mode]}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        'scale-[var(--scale)] transform-gpu',
        getBlurClass(blur),
        className
      )}
    />
  );
}

interface NeonTextProps {
  text?: string;
  glowColor?: string;
  glowSize?: 'sm' | 'md' | 'lg' | 'xl';
  glowIntensity?: number;
  enableGlow?: boolean;
  animateWords?: boolean;
  animationDelay?: number;
  className?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  onWordClick?: (word: string, index: number) => void;
}

const NeonText: React.FC<NeonTextProps> = ({
  text = "Sweet Candy Neon Text ✨",
  glowColor = "#FF69B4",
  glowSize = "md",
  glowIntensity = 1,
  enableGlow = true,
  animateWords = true,
  animationDelay = 200,
  className = "",
  textColor = "#FFFFFF",
  fontSize = "text-4xl",
  fontWeight = "font-bold",
  onWordClick,
}) => {
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);
  const [clickedWords, setClickedWords] = useState<Set<number>>(new Set());
  const words = text.split(' ');

  const glowSizeMap = {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px'
  };

  const candyColors = [
    '#FF69B4', // Hot Pink
    '#FF1493', // Deep Pink
    '#FF6347', // Tomato
    '#FFB6C1', // Light Pink
    '#FFA500', // Orange
    '#FF4500', // Orange Red
    '#DA70D6', // Orchid
    '#BA55D3', // Medium Orchid
    '#9370DB', // Medium Purple
    '#8A2BE2', // Blue Violet
    '#7B68EE', // Medium Slate Blue
    '#00CED1', // Dark Turquoise
    '#00BFFF', // Deep Sky Blue
    '#1E90FF', // Dodger Blue
    '#32CD32', // Lime Green
    '#00FF7F', // Spring Green
    '#ADFF2F', // Green Yellow
    '#FFD700', // Gold
    '#FFA500', // Orange
    '#FF8C00', // Dark Orange
  ];

  const getRandomCandyColor = () => {
    return candyColors[Math.floor(Math.random() * candyColors.length)];
  };

  const getGlowStyle = (wordIndex: number, isHovered: boolean, isClicked: boolean) => {
    if (!enableGlow) return {};

    const currentGlowColor = isHovered || isClicked ? getRandomCandyColor() : glowColor;
    const intensity = (isHovered ? glowIntensity * 1.5 : glowIntensity) * (isClicked ? 2 : 1);
    const size = glowSizeMap[glowSize];

    return {
      textShadow: `
        0 0 ${size} ${currentGlowColor}${Math.round(intensity * 80).toString(16).padStart(2, '0')},
        0 0 ${parseInt(size) * 2}px ${currentGlowColor}${Math.round(intensity * 60).toString(16).padStart(2, '0')},
        0 0 ${parseInt(size) * 3}px ${currentGlowColor}${Math.round(intensity * 40).toString(16).padStart(2, '0')},
        0 0 ${parseInt(size) * 4}px ${currentGlowColor}${Math.round(intensity * 20).toString(16).padStart(2, '0')}
      `,
      filter: isHovered || isClicked ? `brightness(1.3) saturate(1.2)` : 'none',
    };
  };

  const handleWordClick = (word: string, index: number) => {
    setClickedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    onWordClick?.(word, index);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn("relative z-10", fontSize, fontWeight)} style={{ color: textColor }}>
        {words.map((word, index) => {
          const isHovered = hoveredWordIndex === index;
          const isClicked = clickedWords.has(index);
          
          return (
            <motion.span
              key={index}
              className="inline-block cursor-pointer select-none"
              style={getGlowStyle(index, isHovered, isClicked)}
              initial={animateWords ? { opacity: 0, y: 20, scale: 0.8 } : {}}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: animateWords ? (index * animationDelay) / 1000 : 0,
                ease: "easeOut"
              }}
              whileHover={{
                scale: 1.1,
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
              onMouseEnter={() => setHoveredWordIndex(index)}
              onMouseLeave={() => setHoveredWordIndex(null)}
              onClick={() => handleWordClick(word, index)}
            >
              {word}
              {index < words.length - 1 && <span className="mr-2"></span>}
            </motion.span>
          );
        })}
      </div>
      
      {enableGlow && (
        <div className="absolute inset-0 pointer-events-none">
          <GlowEffect
            colors={candyColors.slice(0, 6)}
            mode="colorShift"
            blur="soft"
            duration={3}
            className="opacity-20"
          />
        </div>
      )}
    </div>
  );
};

const CandyNeonTextDemo = () => {
  const [selectedGlowSize, setSelectedGlowSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex flex-col items-center justify-center p-8 space-y-8">
      {/* Main Demo */}
      <div className="text-center space-y-8">
        <NeonText
          text="🍭 Sweet Candy Neon Magic ✨"
          glowColor="#FF69B4"
          glowSize={selectedGlowSize}
          glowIntensity={1.2}
          enableGlow={glowEnabled}
          animateWords={animationEnabled}
          animationDelay={150}
          fontSize="text-5xl md:text-6xl"
          fontWeight="font-extrabold"
          className="mb-8"
          onWordClick={(word, index) => console.log(`Clicked: ${word} at index ${index}`)}
        />

        <NeonText
          text="Click words to toggle their glow!"
          glowColor="#00BFFF"
          glowSize="sm"
          glowIntensity={0.8}
          enableGlow={glowEnabled}
          animateWords={animationEnabled}
          animationDelay={100}
          fontSize="text-xl"
          fontWeight="font-medium"
          className="opacity-80"
        />
      </div>

      {/* Controls */}
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-white text-lg font-semibold mb-4">Controls</h3>
        
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={glowEnabled}
              onChange={(e) => setGlowEnabled(e.target.checked)}
              className="rounded"
            />
            <span>Enable Glow</span>
          </label>

          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={animationEnabled}
              onChange={(e) => setAnimationEnabled(e.target.checked)}
              className="rounded"
            />
            <span>Enable Animation</span>
          </label>

          <div className="flex items-center space-x-2 text-white">
            <span>Glow Size:</span>
            <select
              value={selectedGlowSize}
              onChange={(e) => setSelectedGlowSize(e.target.value as 'sm' | 'md' | 'lg' | 'xl')}
              className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="text-center">
          <NeonText
            text="🌈 Rainbow Vibes"
            glowColor="#FFD700"
            glowSize="lg"
            glowIntensity={1.5}
            enableGlow={true}
            animateWords={true}
            animationDelay={200}
            fontSize="text-3xl"
            fontWeight="font-bold"
          />
        </div>

        <div className="text-center">
          <NeonText
            text="💫 Cosmic Energy"
            glowColor="#9370DB"
            glowSize="xl"
            glowIntensity={2}
            enableGlow={true}
            animateWords={true}
            animationDelay={100}
            fontSize="text-3xl"
            fontWeight="font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default CandyNeonTextDemo;