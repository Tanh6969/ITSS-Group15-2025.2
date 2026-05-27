import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { modalOverlayVariants, modalContentVariants } from '@/lib/animations';

const Modal = ({ isOpen, onClose, title, description, children, footer, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className={cn("bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]", className)}
            role="dialog"
            variants={modalContentVariants}
          >
            {/* Header */}
            <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md p-1.5 transition-colors focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 border-t dark:border-gray-800">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
