import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Palette, Type, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeonTextProps {
  children: string;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  enableGlow?: boolean;
  animateWords?: boolean;
  wordDelay?: number;
  highlightWord?: number; // nth word to highlight (1-indexed)
  highlightColor?: string;
  enableHover?: boolean;
  enableScale?: boolean;
  as?: React.ElementType;
}

const candyColors = {
  'bubblegum-pink': '#FF69B4',
  'cotton-candy': '#FFB6C1',
  'mint-green': '#98FB98',
  'lemon-yellow': '#FFFF00',
  'grape-purple': '#9370DB',
  'orange-crush': '#FFA500',
  'cherry-red': '#DC143C',
  'blueberry': '#4169E1',
  'lime-green': '#32CD32',
  'strawberry': '#FF1493',
  'lavender': '#E6E6FA',
  'peach': '#FFCBA4'
};

function NeonText({
  children,
  className,
  glowColor = candyColors['bubblegum-pink'],
  glowSize = 10,
  enableGlow = true,
  animateWords = false,
  wordDelay = 0.2,
  highlightWord,
  highlightColor = candyColors['lemon-yellow'],
  enableHover = false,
  enableScale = false,
  as: Component = 'span',
}: NeonTextProps) {
  const words = children.split(' ');
  const [animatedWords, setAnimatedWords] = useState<boolean[]>(new Array(words.length).fill(false));

  useEffect(() => {
    if (animateWords) {
      const timeouts: number[] = [];
      words.forEach((_, index) => {
        const timeout = setTimeout(() => {
          setAnimatedWords(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * wordDelay * 1000);
        timeouts.push(timeout);
      });

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [animateWords, wordDelay, words.length]);

  const glowStyle = enableGlow ? {
    textShadow: `
      0 0 ${glowSize}px ${glowColor},
      0 0 ${glowSize * 2}px ${glowColor},
      0 0 ${glowSize * 3}px ${glowColor},
      0 0 ${glowSize * 4}px ${glowColor}
    `,
    color: glowColor,
  } : {};

  const getWordStyle = (index: number) => {
    const isHighlighted = highlightWord && index === highlightWord - 1;
    const currentColor = isHighlighted ? highlightColor : glowColor;
    
    if (enableGlow || isHighlighted) {
      return {
        textShadow: `
          0 0 ${glowSize}px ${currentColor},
          0 0 ${glowSize * 2}px ${currentColor},
          0 0 ${glowSize * 3}px ${currentColor},
          0 0 ${glowSize * 4}px ${currentColor}
        `,
        color: currentColor,
      };
    }
    return {};
  };

  const getHoverStyle = (index: number) => {
    const isHighlighted = highlightWord && index === highlightWord - 1;
    const currentColor = isHighlighted ? highlightColor : glowColor;
    
    return {
      textShadow: enableHover ? `
        0 0 ${glowSize * 1.5}px ${currentColor},
        0 0 ${glowSize * 3}px ${currentColor},
        0 0 ${glowSize * 4.5}px ${currentColor},
        0 0 ${glowSize * 6}px ${currentColor}
      ` : undefined,
      color: enableHover ? currentColor : undefined,
    };
  };

  if (animateWords || enableHover || enableScale || highlightWord) {
    return (
      <Component className={cn('inline-block', className)}>
        {words.map((word, index) => {
          const isHighlighted = highlightWord && index === highlightWord - 1;
          const currentColor = isHighlighted ? highlightColor : glowColor;
          
          return (
            <motion.span
              key={index}
              className="inline-block mr-2 cursor-default"
              initial={{ opacity: animateWords ? 0.3 : 1 }}
              animate={{
                opacity: animateWords ? (animatedWords[index] ? 1 : 0.3) : 1,
                textShadow: animateWords ? (
                  animatedWords[index] && (enableGlow || isHighlighted) ? [
                    `0 0 ${glowSize}px ${currentColor}`,
                    `0 0 ${glowSize * 2}px ${currentColor}`,
                    `0 0 ${glowSize * 3}px ${currentColor}`,
                    `0 0 ${glowSize * 4}px ${currentColor}`
                  ].join(', ') : 'none'
                ) : (enableGlow || isHighlighted) ? [
                  `0 0 ${glowSize}px ${currentColor}`,
                  `0 0 ${glowSize * 2}px ${currentColor}`,
                  `0 0 ${glowSize * 3}px ${currentColor}`,
                  `0 0 ${glowSize * 4}px ${currentColor}`
                ].join(', ') : 'none',
                color: animateWords ? (
                  animatedWords[index] && (enableGlow || isHighlighted) ? currentColor : 'inherit'
                ) : (enableGlow || isHighlighted) ? currentColor : 'inherit'
              }}
              whileHover={enableHover ? {
                scale: enableScale ? 1.1 : 1,
                textShadow: [
                  `0 0 ${glowSize * 1.5}px ${currentColor}`,
                  `0 0 ${glowSize * 3}px ${currentColor}`,
                  `0 0 ${glowSize * 4.5}px ${currentColor}`,
                  `0 0 ${glowSize * 6}px ${currentColor}`
                ].join(', '),
                color: currentColor
              } : enableScale ? { scale: 1.1 } : {}}
              transition={{ 
                duration: animateWords ? 0.3 : 0.2,
                type: "spring",
                stiffness: 300
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </Component>
    );
  }

  return (
    <Component
      className={cn('inline-block', className)}
      style={glowStyle}
    >
      {children}
    </Component>
  );
}

function CandyNeonTextDemo() {
  const [selectedColor, setSelectedColor] = useState('bubblegum-pink');
  const [glowSize, setGlowSize] = useState([15]);
  const [enableGlow, setEnableGlow] = useState(true);
  const [animateWords, setAnimateWords] = useState(false);
  const [wordDelay, setWordDelay] = useState([0.3]);
  const [demoText, setDemoText] = useState('Sweet Dreams Are Made of Candy');
  const [highlightWord, setHighlightWord] = useState<number | undefined>(undefined);
  const [enableHover, setEnableHover] = useState(false);
  const [enableScale, setEnableScale] = useState(false);

  const presetTexts = [
    'Sweet Dreams Are Made of Candy',
    'Sugar Rush Paradise',
    'Neon Candy Wonderland',
    'Electric Cotton Candy',
    'Glowing Gummy Bears',
    'Sparkle Pop Magic'
  ];

  const triggerAnimation = () => {
    setAnimateWords(false);
    setTimeout(() => setAnimateWords(true), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Candy Neon Text Generator
            </h1>
          </motion.div>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Create stunning neon text effects with sweet candy-inspired colors and customizable glow animations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-300">
                  <Type className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription className="text-purple-200">
                  See your neon text effect in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Preview */}
                <div className="bg-black/60 rounded-xl p-8 min-h-[200px] flex items-center justify-center border border-purple-500/20">
                  <NeonText
                    glowColor={candyColors[selectedColor as keyof typeof candyColors]}
                    glowSize={glowSize[0]}
                    enableGlow={enableGlow}
                    animateWords={animateWords}
                    wordDelay={wordDelay[0]}
                    highlightWord={highlightWord}
                    enableHover={enableHover}
                    enableScale={enableScale}
                    className="text-3xl md:text-4xl font-bold text-center"
                  >
                    {demoText}
                  </NeonText>
                </div>

                {/* Preset Text Options */}
                <div className="space-y-3">
                  <Label className="text-purple-200">Quick Text Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {presetTexts.map((text) => (
                      <Button
                        key={text}
                        variant={demoText === text ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDemoText(text)}
                        className={cn(
                          "text-xs",
                          demoText === text 
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
                            : "border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
                        )}
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Animation Controls */}
                <div className="flex gap-3">
                  <Button
                    onClick={triggerAnimation}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Trigger Animation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Color Selection */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-300">
                  <Palette className="w-5 h-5" />
                  Candy Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(candyColors).map(([name, color]) => (
                    <motion.button
                      key={name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(name)}
                      className={cn(
                        "w-12 h-12 rounded-xl border-2 transition-all duration-200",
                        selectedColor === name 
                          ? "border-white shadow-lg scale-110" 
                          : "border-purple-500/30 hover:border-purple-400"
                      )}
                      style={{ backgroundColor: color }}
                      title={name.replace('-', ' ')}
                    />
                  ))}
                </div>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="bg-black/40 border-purple-500/30 text-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30">
                    {Object.keys(candyColors).map((color) => (
                      <SelectItem key={color} value={color} className="text-purple-200">
                        {color.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Glow Settings */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-pink-300">Glow Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-purple-200">Enable Glow</Label>
                  <Button
                    variant={enableGlow ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEnableGlow(!enableGlow)}
                    className={enableGlow 
                      ? "bg-gradient-to-r from-pink-500 to-purple-600" 
                      : "border-purple-500/30 text-purple-200"
                    }
                  >
                    {enableGlow ? 'ON' : 'OFF'}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-200">Glow Size</Label>
                    <span className="text-sm text-purple-300">{glowSize[0]}px</span>
                  </div>
                  <Slider
                    value={glowSize}
                    onValueChange={setGlowSize}
                    max={30}
                    min={5}
                    step={1}
                    className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-pink-500 [&_[role=slider]]:to-purple-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Animation Settings */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-pink-300">Animation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-purple-200">Word Animation</Label>
                  <Button
                    variant={animateWords ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnimateWords(!animateWords)}
                    className={animateWords 
                      ? "bg-gradient-to-r from-pink-500 to-purple-600" 
                      : "border-purple-500/30 text-purple-200"
                    }
                  >
                    {animateWords ? 'ON' : 'OFF'}
                  </Button>
                </div>

                {animateWords && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-purple-200">Word Delay</Label>
                      <span className="text-sm text-purple-300">{wordDelay[0]}s</span>
                    </div>
                    <Slider
                      value={wordDelay}
                      onValueChange={setWordDelay}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-pink-500 [&_[role=slider]]:to-purple-600"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-purple-200">Highlight Word (nth)</Label>
                  <Select value={highlightWord?.toString() || 'none'} onValueChange={(value) => setHighlightWord(value === 'none' ? undefined : parseInt(value))}>
                    <SelectTrigger className="bg-black/40 border-purple-500/30 text-purple-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-500/30">
                      <SelectItem value="none" className="text-purple-200">None</SelectItem>
                      {demoText.split(' ').map((word, index) => (
                        <SelectItem key={index} value={(index + 1).toString()} className="text-purple-200">
                          {index + 1}. {word}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-200 text-sm">Hover Effect</Label>
                    <Button
                      variant={enableHover ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEnableHover(!enableHover)}
                      className={enableHover 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600" 
                        : "border-purple-500/30 text-purple-200"
                      }
                    >
                      {enableHover ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-200 text-sm">Scale Effect</Label>
                    <Button
                      variant={enableScale ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEnableScale(!enableScale)}
                      className={enableScale 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600" 
                        : "border-purple-500/30 text-purple-200"
                      }
                    >
                      {enableScale ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Examples Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-pink-300">More Examples</CardTitle>
              <CardDescription className="text-purple-200">
                Different text sizes and styles with neon effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/60 rounded-xl p-6 border border-purple-500/20">
                  <NeonText
                    glowColor={candyColors['mint-green']}
                    glowSize={8}
                    enableHover={true}
                    enableScale={true}
                    className="text-xl font-semibold"
                  >
                    Mint Fresh Vibes
                  </NeonText>
                </div>
                <div className="bg-black/60 rounded-xl p-6 border border-purple-500/20">
                  <NeonText
                    glowColor={candyColors['cherry-red']}
                    glowSize={12}
                    highlightWord={2}
                    className="text-2xl font-bold"
                  >
                    Cherry Bomb!
                  </NeonText>
                </div>
                <div className="bg-black/60 rounded-xl p-6 border border-purple-500/20">
                  <NeonText
                    glowColor={candyColors['lemon-yellow']}
                    glowSize={6}
                    enableHover={true}
                    highlightWord={3}
                    highlightColor={candyColors['orange-crush']}
                    className="text-lg"
                  >
                    Lemon Drop Sunshine
                  </NeonText>
                </div>
                <div className="bg-black/60 rounded-xl p-6 border border-purple-500/20">
                  <NeonText
                    glowColor={candyColors['grape-purple']}
                    glowSize={14}
                    enableHover={true}
                    enableScale={true}
                    highlightWord={1}
                    className="text-3xl font-extrabold"
                  >
                    Grape Escape
                  </NeonText>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CandyNeonTextDemo;