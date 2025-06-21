import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subtitles } from 'lucide-react';

interface LiveTranscriptProps {
  currentMessage: string;
  speaker: 'user' | 'athena';
}

export default function LiveTranscript({ currentMessage, speaker }: LiveTranscriptProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!currentMessage) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');

    let index = 0;
    const timer = setInterval(() => {
      if (index < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [currentMessage]);

  return (
    <AnimatePresence>
      {currentMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-black/80 backdrop-blur-sm text-white p-3 sm:p-4 rounded-lg max-w-full sm:max-w-2xl mx-auto"
        >
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <Subtitles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <span className={`text-xs sm:text-sm font-medium ${
                  speaker === 'athena' ? 'text-blue-400' : 'text-green-400'
                }`}>
                  {speaker === 'athena' ? 'Athena' : 'You'}
                </span>
                <div className="text-xs text-gray-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              
              <div className="text-white leading-relaxed text-sm sm:text-base break-words">
                {displayedText}
                {isTyping && (
                  <motion.span
                    className="inline-block w-0.5 h-4 sm:h-5 bg-white ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}