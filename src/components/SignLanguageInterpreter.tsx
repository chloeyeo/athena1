import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

interface SignLanguageInterpreterProps {
  message: string;
  language: 'ASL' | 'BSL' | 'ISL';
}

export default function SignLanguageInterpreter({ message, language }: SignLanguageInterpreterProps) {
  const [currentGesture, setCurrentGesture] = useState<'neutral' | 'signing' | 'fingerspelling'>('neutral');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (message) {
      setIsActive(true);
      setCurrentGesture('signing');
      
      // Simulate signing animation duration
      const timer = setTimeout(() => {
        setCurrentGesture('neutral');
        setIsActive(false);
      }, message.length * 100);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const getLanguageColor = () => {
    switch (language) {
      case 'ASL': return 'from-blue-400 to-blue-600';
      case 'BSL': return 'from-green-400 to-green-600';
      case 'ISL': return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 w-48 h-40">
      <div className="flex items-center space-x-2 mb-2">
        <Languages className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{language} Interpreter</span>
      </div>
      
      <div className="relative h-24 flex items-center justify-center">
        {/* Sign language avatar */}
        <motion.div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLanguageColor()} flex items-center justify-center relative`}
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Simplified avatar representation */}
          <div className="relative">
            {/* Head */}
            <div className="w-8 h-8 bg-white/80 rounded-full relative">
              {/* Eyes */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
              </div>
              {/* Mouth */}
              <motion.div
                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-gray-700 rounded-full"
                animate={{
                  scaleX: currentGesture === 'signing' ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: currentGesture === 'signing' ? Infinity : 0,
                }}
              />
            </div>
            
            {/* Arms/hands */}
            <motion.div
              className="absolute -bottom-2 -left-4 w-2 h-4 bg-white/60 rounded-full"
              animate={{
                rotate: currentGesture === 'signing' ? [-10, 10, -5, 15, 0] : 0,
                x: currentGesture === 'signing' ? [-2, 2, -1, 1, 0] : 0,
              }}
              transition={{
                duration: 1,
                repeat: currentGesture === 'signing' ? Infinity : 0,
              }}
            />
            <motion.div
              className="absolute -bottom-2 -right-4 w-2 h-4 bg-white/60 rounded-full"
              animate={{
                rotate: currentGesture === 'signing' ? [10, -10, 5, -15, 0] : 0,
                x: currentGesture === 'signing' ? [2, -2, 1, -1, 0] : 0,
              }}
              transition={{
                duration: 1,
                repeat: currentGesture === 'signing' ? Infinity : 0,
                delay: 0.2,
              }}
            />
          </div>
        </motion.div>
        
        {/* Status indicator */}
        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Signing...
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="text-xs text-gray-600 text-center mt-2">
        {isActive ? 'Interpreting message' : 'Ready to interpret'}
      </div>
    </div>
  );
}