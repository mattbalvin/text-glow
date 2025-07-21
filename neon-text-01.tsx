import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface NeonTextProps {
  text?: string
  glowColor?: string
  glowSize?: number
  enableGlow?: boolean
  animateWords?: boolean
  className?: string
  fontSize?: string
  fontWeight?: string
}

interface WordGlowState {
  [key: number]: boolean
}

const NeonText: React.FC<NeonTextProps> = ({
  text = "Sweet Candy Neon Text",
  glowColor = "#ff6b9d",
  glowSize = 20,
  enableGlow = true,
  animateWords = true,
  className = "",
  fontSize = "text-4xl",
  fontWeight = "font-bold"
}) => {
  const words = text.split(' ')
  const [wordGlowStates, setWordGlowStates] = useState<WordGlowState>({})

  useEffect(() => {
    if (!animateWords || !enableGlow) return

    const interval = setInterval(() => {
      const randomWordIndex = Math.floor(Math.random() * words.length)
      setWordGlowStates(prev => ({
        ...prev,
        [randomWordIndex]: !prev[randomWordIndex]
      }))
    }, 800)

    return () => clearInterval(interval)
  }, [words.length, animateWords, enableGlow])

  const getGlowStyle = (isWordGlowing: boolean = false) => {
    if (!enableGlow && !isWordGlowing) return {}
    
    const shouldGlow = animateWords ? isWordGlowing : enableGlow
    
    return shouldGlow ? {
      textShadow: `
        0 0 ${glowSize * 0.3}px ${glowColor},
        0 0 ${glowSize * 0.6}px ${glowColor},
        0 0 ${glowSize}px ${glowColor},
        0 0 ${glowSize * 1.5}px ${glowColor},
        0 0 ${glowSize * 2}px ${glowColor}
      `,
      color: glowColor,
    } : {
      color: 'inherit'
    }
  }

  if (animateWords) {
    return (
      <div className={`${fontSize} ${fontWeight} ${className}`}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            style={getGlowStyle(wordGlowStates[index])}
            animate={{
              scale: wordGlowStates[index] ? 1.05 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </div>
    )
  }

  return (
    <div 
      className={`${fontSize} ${fontWeight} ${className}`}
      style={getGlowStyle()}
    >
      {text}
    </div>
  )
}

const NeonTextDemo: React.FC = () => {
  const [text, setText] = useState("Sweet Candy Dreams")
  const [glowColor, setGlowColor] = useState("#ff6b9d")
  const [glowSize, setGlowSize] = useState([20])
  const [enableGlow, setEnableGlow] = useState(true)
  const [animateWords, setAnimateWords] = useState(true)

  const candyColors = [
    { name: "Cotton Candy Pink", value: "#ff6b9d" },
    { name: "Bubblegum Blue", value: "#4ecdc4" },
    { name: "Lemon Drop", value: "#ffe66d" },
    { name: "Grape Soda", value: "#a8e6cf" },
    { name: "Orange Crush", value: "#ffa726" },
    { name: "Strawberry", value: "#ff5722" },
    { name: "Mint Green", value: "#00e676" },
    { name: "Lavender", value: "#ba68c8" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Neon Text Component
          </h1>
          <p className="text-xl text-gray-300">
            Create stunning neon text effects with candy-inspired colors
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-background/10 backdrop-blur-sm border-border/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Controls</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="text-input" className="text-white mb-2 block">
                    Text Content
                  </Label>
                  <input
                    id="text-input"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-3 py-2 bg-background/20 border border-border/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your text..."
                  />
                </div>

                <Separator className="bg-border/30" />

                <div className="flex items-center justify-between">
                  <Label htmlFor="glow-toggle" className="text-white">
                    Enable Glow Effect
                  </Label>
                  <Switch
                    id="glow-toggle"
                    checked={enableGlow}
                    onCheckedChange={setEnableGlow}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="animate-toggle" className="text-white">
                    Animate Individual Words
                  </Label>
                  <Switch
                    id="animate-toggle"
                    checked={animateWords}
                    onCheckedChange={setAnimateWords}
                  />
                </div>

                <Separator className="bg-border/30" />

                <div>
                  <Label className="text-white mb-3 block">
                    Glow Size: {glowSize[0]}px
                  </Label>
                  <Slider
                    value={glowSize}
                    onValueChange={setGlowSize}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-white mb-3 block">
                    Candy Colors
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {candyColors.map((color) => (
                      <Button
                        key={color.value}
                        variant={glowColor === color.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGlowColor(color.value)}
                        className="h-12 p-0 border-2"
                        style={{
                          backgroundColor: color.value,
                          borderColor: glowColor === color.value ? '#fff' : color.value,
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-color" className="text-white mb-2 block">
                    Custom Color
                  </Label>
                  <input
                    id="custom-color"
                    type="color"
                    value={glowColor}
                    onChange={(e) => setGlowColor(e.target.value)}
                    className="w-full h-12 rounded-md border border-border/30 bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 bg-background/10 backdrop-blur-sm border-border/20 h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-8">Preview</h3>
                <div className="min-h-[200px] flex items-center justify-center">
                  <NeonText
                    text={text}
                    glowColor={glowColor}
                    glowSize={glowSize[0]}
                    enableGlow={enableGlow}
                    animateWords={animateWords}
                    className="text-center"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-6 bg-background/10 backdrop-blur-sm border-border/20">
            <h3 className="text-2xl font-semibold text-white mb-6">Examples</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-background/5 rounded-lg">
                <NeonText
                  text="Candy Shop"
                  glowColor="#ff6b9d"
                  glowSize={15}
                  fontSize="text-2xl"
                  animateWords={false}
                />
              </div>
              <div className="text-center p-4 bg-background/5 rounded-lg">
                <NeonText
                  text="Neon Dreams"
                  glowColor="#4ecdc4"
                  glowSize={25}
                  fontSize="text-2xl"
                  animateWords={true}
                />
              </div>
              <div className="text-center p-4 bg-background/5 rounded-lg">
                <NeonText
                  text="Sweet Vibes"
                  glowColor="#ffe66d"
                  glowSize={20}
                  fontSize="text-2xl"
                  animateWords={false}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default NeonTextDemo