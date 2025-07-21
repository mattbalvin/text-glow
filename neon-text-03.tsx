import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonTextProps {
  text: string;
  glowColor?: string;
  glowSize?: number;
  enableGlow?: boolean;
  animateWords?: boolean;
  className?: string;
  wordDelay?: number;
  glowIntensity?: number;
}

const candyColors = [
  '#FF69B4', // Hot Pink
  '#FF1493', // Deep Pink
  '#FF6347', // Tomato
  '#FFB6C1', // Light Pink
  '#FFA500', // Orange
  '#FF4500', // Orange Red
  '#32CD32', // Lime Green
  '#00FF7F', // Spring Green
  '#00CED1', // Dark Turquoise
  '#1E90FF', // Dodger Blue
  '#9370DB', // Medium Purple
  '#DA70D6', // Orchid
];

const NeonText: React.FC<NeonTextProps> = ({
  text = "Sweet Candy Text",
  glowColor = '#FF69B4',
  glowSize = 20,
  enableGlow = true,
  animateWords = true,
  className = '',
  wordDelay = 0.2,
  glowIntensity = 0.8,
}) => {
  const [animatedWords, setAnimatedWords] = useState<Set<number>>(new Set());
  const words = text.split(' ');

  useEffect(() => {
    if (!animateWords) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * words.length);
      setAnimatedWords(prev => {
        const newSet = new Set(prev);
        if (newSet.has(randomIndex)) {
          newSet.delete(randomIndex);
        } else {
          newSet.add(randomIndex);
        }
        return newSet;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length, animateWords]);

  const getRandomCandyColor = () => {
    return candyColors[Math.floor(Math.random() * candyColors.length)];
  };

  const getGlowStyle = (isAnimated: boolean, wordIndex: number) => {
    const currentGlowColor = isAnimated ? getRandomCandyColor() : glowColor;
    const currentGlowSize = isAnimated ? glowSize * 1.5 : glowSize;
    const currentIntensity = isAnimated ? glowIntensity * 1.2 : glowIntensity;

    if (!enableGlow && !isAnimated) return {};

    return {
      textShadow: `
        0 0 ${currentGlowSize * 0.2}px ${currentGlowColor}${Math.floor(currentIntensity * 255).toString(16).padStart(2, '0')},
        0 0 ${currentGlowSize * 0.4}px ${currentGlowColor}${Math.floor(currentIntensity * 200).toString(16).padStart(2, '0')},
        0 0 ${currentGlowSize * 0.6}px ${currentGlowColor}${Math.floor(currentIntensity * 150).toString(16).padStart(2, '0')},
        0 0 ${currentGlowSize}px ${currentGlowColor}${Math.floor(currentIntensity * 100).toString(16).padStart(2, '0')},
        0 0 ${currentGlowSize * 1.5}px ${currentGlowColor}${Math.floor(currentIntensity * 50).toString(16).padStart(2, '0')}
      `,
      color: isAnimated ? currentGlowColor : 'inherit',
    };
  };

  return (
    <div className={cn('flex flex-wrap gap-2 justify-center items-center', className)}>
      {words.map((word, index) => {
        const isAnimated = animatedWords.has(index);
        
        return (
          <motion.span
            key={`${word}-${index}`}
            className="inline-block font-bold text-4xl md:text-6xl lg:text-7xl"
            style={getGlowStyle(isAnimated, index)}
            initial={{ scale: 1 }}
            animate={{
              scale: isAnimated ? [1, 1.1, 1] : 1,
              rotate: isAnimated ? [0, 2, -2, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              delay: index * wordDelay,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isAnimated ? 'animated' : 'static'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        );
      })}
    </div>
  );
};

const Demo = () => {
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [glowColor, setGlowColor] = useState('#FF69B4');
  const [glowSize, setGlowSize] = useState(20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center space-y-6">
        <NeonText
          text="Sweet Candy Glow"
          glowColor={glowColor}
          glowSize={glowSize}
          enableGlow={glowEnabled}
          animateWords={animationEnabled}
          className="mb-8"
        />
        
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 space-y-4 max-w-md mx-auto">
          <h3 className="text-white text-lg font-semibold mb-4">Controls</h3>
          
          <div className="flex items-center justify-between">
            <label className="text-white text-sm">Enable Glow</label>
            <button
              onClick={() => setGlowEnabled(!glowEnabled)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors duration-200",
                glowEnabled ? "bg-pink-500" : "bg-gray-600"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform duration-200",
                  glowEnabled ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-white text-sm">Animate Words</label>
            <button
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className={cn(
                "w-12 h-6 rounded-full transition-colors duration-200",
                animationEnabled ? "bg-pink-500" : "bg-gray-600"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform duration-200",
                  animationEnabled ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-white text-sm">Glow Color</label>
            <div className="flex gap-2 flex-wrap">
              {candyColors.slice(0, 6).map((color) => (
                <button
                  key={color}
                  onClick={() => setGlowColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-200",
                    glowColor === color ? "border-white scale-110" : "border-gray-400"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-white text-sm">Glow Size: {glowSize}px</label>
            <input
              type="range"
              min="5"
              max="50"
              value={glowSize}
              onChange={(e) => setGlowSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;