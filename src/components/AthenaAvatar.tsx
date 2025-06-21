import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface AthenaAvatarProps {
  isActive: boolean;
  isSpeaking: boolean;
  currentMessage?: string;
}

export default function AthenaAvatar({ isActive, isSpeaking, currentMessage }: AthenaAvatarProps) {
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'speaking' | 'thinking'>('neutral');
  const [isSigningASL, setIsSigningASL] = useState(false);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const { settings } = useAccessibility();

  useEffect(() => {
    if (isSpeaking) {
      setCurrentExpression('speaking');
      if (settings.signLanguage) {
        setIsSigningASL(true);
        // Stop signing after message duration
        const duration = (currentMessage?.length || 50) * 100;
        setTimeout(() => setIsSigningASL(false), duration);
      }
    } else {
      setCurrentExpression('neutral');
      setIsSigningASL(false);
    }
  }, [isSpeaking, currentMessage, settings.signLanguage]);

  // Animate through different sign positions when signing
  useEffect(() => {
    if (isSigningASL && currentMessage) {
      const interval = setInterval(() => {
        setCurrentSignIndex(prev => (prev + 1) % currentMessage.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isSigningASL, currentMessage]);

  // Sign language hand positions for different letters/concepts
  const getSignPosition = () => {
    if (!isSigningASL || !currentMessage) return { leftX: 0, leftY: 0, rightX: 0, rightY: 0, leftRotate: 0, rightRotate: 0 };
    
    const char = currentMessage[currentSignIndex]?.toLowerCase() || 'a';
    
    // Enhanced ASL-inspired hand positions for different letters
    const positions: Record<string, { leftX: number; leftY: number; rightX: number; rightY: number; leftRotate: number; rightRotate: number }> = {
      'a': { leftX: -30, leftY: -10, rightX: 30, rightY: -10, leftRotate: -15, rightRotate: 15 },
      'b': { leftX: -20, leftY: -20, rightX: 40, rightY: -5, leftRotate: 0, rightRotate: 30 },
      'c': { leftX: -40, leftY: 0, rightX: 20, rightY: -15, leftRotate: -30, rightRotate: 0 },
      'd': { leftX: -15, leftY: -25, rightX: 35, rightY: 0, leftRotate: 10, rightRotate: -20 },
      'e': { leftX: -35, leftY: -5, rightX: 25, rightY: -20, leftRotate: -20, rightRotate: 25 },
      'f': { leftX: -25, leftY: -15, rightX: 45, rightY: -10, leftRotate: 5, rightRotate: -15 },
      'g': { leftX: -45, leftY: 5, rightX: 15, rightY: -25, leftRotate: -35, rightRotate: 20 },
      'h': { leftX: -20, leftY: -30, rightX: 40, rightY: 5, leftRotate: 15, rightRotate: -25 },
      'i': { leftX: -10, leftY: -20, rightX: 50, rightY: -15, leftRotate: 25, rightRotate: 10 },
      'j': { leftX: -50, leftY: -10, rightX: 10, rightY: -30, leftRotate: -40, rightRotate: 35 },
      'k': { leftX: -30, leftY: 10, rightX: 30, rightY: -25, leftRotate: -10, rightRotate: 40 },
      'l': { leftX: -15, leftY: -35, rightX: 45, rightY: 10, leftRotate: 30, rightRotate: -30 },
      'm': { leftX: -40, leftY: -15, rightX: 20, rightY: -5, leftRotate: -25, rightRotate: 15 },
      'n': { leftX: -25, leftY: 15, rightX: 35, rightY: -20, leftRotate: 20, rightRotate: -10 },
      'o': { leftX: -35, leftY: -25, rightX: 35, rightY: -25, leftRotate: 0, rightRotate: 0 },
      'p': { leftX: -20, leftY: 20, rightX: 40, rightY: -30, leftRotate: 35, rightRotate: 25 },
      'q': { leftX: -45, leftY: 0, rightX: 15, rightY: 15, leftRotate: -30, rightRotate: -35 },
      'r': { leftX: -30, leftY: -20, rightX: 30, rightY: 10, leftRotate: 10, rightRotate: -40 },
      's': { leftX: -10, leftY: 10, rightX: 50, rightY: -20, leftRotate: 40, rightRotate: 20 },
      't': { leftX: -40, leftY: 15, rightX: 25, rightY: -30, leftRotate: -15, rightRotate: 30 },
      'u': { leftX: -25, leftY: -10, rightX: 35, rightY: 15, leftRotate: 25, rightRotate: -20 },
      'v': { leftX: -35, leftY: 5, rightX: 45, rightY: -25, leftRotate: -20, rightRotate: 35 },
      'w': { leftX: -15, leftY: -15, rightX: 25, rightY: 20, leftRotate: 15, rightRotate: -25 },
      'x': { leftX: -50, leftY: -20, rightX: 50, rightY: -20, leftRotate: -45, rightRotate: 45 },
      'y': { leftX: -30, leftY: 20, rightX: 30, rightY: 20, leftRotate: 30, rightRotate: -30 },
      'z': { leftX: -20, leftY: -25, rightX: 20, rightY: 25, leftRotate: -35, rightRotate: 35 },
      ' ': { leftX: 0, leftY: 0, rightX: 0, rightY: 0, leftRotate: 0, rightRotate: 0 }, // Pause
      default: { leftX: -15, leftY: -10, rightX: 15, rightY: -10, leftRotate: 0, rightRotate: 0 }
    };
    
    return positions[char] || positions.default;
  };

  const signPosition = getSignPosition();

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Avatar */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main avatar circle - Responsive sizing */}
        <motion.div
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 flex items-center justify-center relative overflow-hidden"
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: isSpeaking ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Face features */}
          <div className="absolute inset-2 sm:inset-3 md:inset-4 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 flex items-center justify-center">
            {/* Eyes */}
            <div className="absolute top-6 sm:top-7 md:top-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 md:space-x-4">
              <motion.div
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-white rounded-full"
                animate={{
                  scaleY: currentExpression === 'speaking' ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  repeat: currentExpression === 'speaking' ? Infinity : 0,
                }}
              />
              <motion.div
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-white rounded-full"
                animate={{
                  scaleY: currentExpression === 'speaking' ? [1, 0.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  repeat: currentExpression === 'speaking' ? Infinity : 0,
                }}
              />
            </div>

            {/* Mouth */}
            <motion.div
              className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 transform -translate-x-1/2"
              animate={{
                scaleX: currentExpression === 'speaking' ? [1, 1.3, 0.8, 1] : 1,
                scaleY: currentExpression === 'speaking' ? [1, 0.8, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: currentExpression === 'speaking' ? Infinity : 0,
              }}
            >
              <div className="w-6 h-1.5 sm:w-7 sm:h-1.5 md:w-8 md:h-2 bg-white rounded-full" />
            </motion.div>

            {/* Sign Language Hands - Integrated into main avatar */}
            {settings.signLanguage && (
              <>
                {/* Left Hand */}
                <motion.div
                  className="absolute w-4 h-6 sm:w-5 sm:h-7 md:w-6 md:h-8 bg-blue-200 rounded-full"
                  style={{
                    left: '5%',
                    top: '55%',
                  }}
                  animate={{
                    x: isSigningASL ? signPosition.leftX : 0,
                    y: isSigningASL ? signPosition.leftY : 0,
                    rotate: isSigningASL ? signPosition.leftRotate : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Right Hand */}
                <motion.div
                  className="absolute w-4 h-6 sm:w-5 sm:h-7 md:w-6 md:h-8 bg-blue-200 rounded-full"
                  style={{
                    right: '5%',
                    top: '55%',
                  }}
                  animate={{
                    x: isSigningASL ? signPosition.rightX : 0,
                    y: isSigningASL ? signPosition.rightY : 0,
                    rotate: isSigningASL ? signPosition.rightRotate : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                />
              </>
            )}
          </div>

          {/* Animated particles around avatar */}
          {isActive && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/30 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 60],
                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 60],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Status indicator - Responsive */}
        <motion.div
          className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white rounded-full shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <motion.div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {currentExpression === 'speaking' ? 
                (settings.signLanguage ? `Speaking & Signing (${settings.signLanguageType})` : 'Speaking...') : 
                'Listening'
              }
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Name and title - Responsive */}
      <motion.div
        className="text-center mt-4 sm:mt-6 md:mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white mb-1 sm:mb-2">Athena</h2>
        <p className="text-blue-200 text-sm sm:text-base md:text-lg">Your AI Legal Mentor</p>
        <p className="text-blue-300 text-xs sm:text-sm mt-1">
          Powered by advanced AI • Zero hallucinations
          {settings.signLanguage && ` • ${settings.signLanguageType} Sign Language`}
        </p>
      </motion.div>
    </div>
  );
}