import { useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-72 px-4 py-3 text-sm bg-white rounded-lg shadow-lg border bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2"
          >
            {content}
            <div className="absolute w-3 h-3 bg-white border-b border-r transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1.5"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 