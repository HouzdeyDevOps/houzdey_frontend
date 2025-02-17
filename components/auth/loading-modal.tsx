import React from 'react';
import { motion } from 'framer-motion';

interface LoadingModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerColor?: string;
}

const LoadingModal = ({ 
  isOpen, 
  title = "Please wait", 
  message = "Processing your request",
  spinnerSize = 'md',
  spinnerColor = 'indigo-600'
}: LoadingModalProps) => {
  if (!isOpen) return null;

  const spinnerSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl w-full max-w-md mx-4 p-6 text-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div 
          className={`${spinnerSizes[spinnerSize]} border-4 border-${spinnerColor} border-t-transparent rounded-full animate-spin mx-auto mb-4`} 
        />
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingModal; 