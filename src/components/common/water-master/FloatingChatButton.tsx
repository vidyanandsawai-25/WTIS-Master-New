'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Sparkles } from 'lucide-react';
const corporationLogo = '/assets/logo.png';

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FloatingChatButton({ onClick, isOpen }: FloatingChatButtonProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
      className="fixed bottom-6 right-6 z-50 cursor-pointer group"
    >
      {/* Outer Pulsing Ring 1 */}
      <motion.div               
        className="absolute inset-0 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 blur-lg" />
      </motion.div>

      {/* Outer Pulsing Ring 2 */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: [1, 1.7, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-xl" />
      </motion.div>

      {/* Main Button Container */}
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: isOpen ? 0 : [0, -8, 0],
        }}
        transition={{
          y: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Rotating Gradient Border */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-blue-500 p-1 shadow-2xl"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        >
          <div className="w-full h-full rounded-full bg-white" />
        </motion.div>

        {/* Inner Gradient Background */}
        <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-inner overflow-hidden">
          {/* Animated Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 1,
            }}
          />
        </div>

        {/* Logo/Icon Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {!isOpen ? (
              <div className="relative">
                {/* Corporation Logo with Glow */}
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <img
                    src={corporationLogo}
                    alt="Help"
                    className="w-10 h-10 object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Help Icon Badge - Bottom Left */}
                <motion.div
                  className="absolute -bottom-1 -left-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-1.5 shadow-lg border-2 border-white"
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  <HelpCircle className="w-4 h-4 text-white" />
                </motion.div>

                {/* Sparkle - Top Right */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <X className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Floating Particles Around Button */}
      {!isOpen && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [
                  0,
                  Math.cos((i * Math.PI * 2) / 8) * 45,
                  0,
                ],
                y: [
                  0,
                  Math.sin((i * Math.PI * 2) / 8) * 45,
                  0,
                ],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
