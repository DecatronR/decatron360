"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

/**
 * A generic Google-style floating action menu component.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.trigger - The trigger element for desktop dropdown mode.
 * @param {Array<{label: string, icon?: React.ReactNode, onClick: () => void, color?: string}>} props.items - The menu items.
 * @param {string} props.position - Position of the menu ('bottom-right', 'bottom-left', 'top-right', 'top-left').
 * @param {string} props.theme - Theme color ('primary', 'secondary', 'success', 'warning', 'error').
 * @param {boolean} props.isFloating - Whether to use floating FAB mode (true) or dropdown mode (false).
 */
const FloatingActionMenu = ({
  trigger,
  items = [],
  position = "bottom-right",
  theme = "primary",
  isFloating = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Theme colors
  const themeColors = {
    primary: "bg-primary-500 hover:bg-primary-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    success: "bg-green-500 hover:bg-green-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    error: "bg-red-500 hover:bg-red-600",
  };

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-20 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (onClick) => {
    onClick();
    setIsOpen(false);
  };

  // Floating FAB Mode (Mobile)
  if (isFloating) {
    return (
      <div className={`fixed ${positionClasses[position]} z-[9999] md:hidden`}>
        {/* Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute bottom-12 right-0 z-[9999]">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.3,
                    y: 20,
                    rotate: -180,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.3,
                    y: 20,
                    rotate: 180,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.1,
                  }}
                  className="absolute"
                  style={{
                    bottom: `${(index + 1) * 60}px`,
                    right: 0,
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-end"
                  >
                    {/* Item Label */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                      className="bg-white rounded-full px-4 py-2 mr-3 shadow-lg border border-gray-100"
                    >
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        {item.label}
                      </span>
                    </motion.div>

                    {/* Item Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleItemClick(item.onClick)}
                      className={`w-12 h-12 rounded-full ${
                        item.color || themeColors[theme]
                      } shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:shadow-xl`}
                      style={{
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      {item.icon}
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            console.log("Mobile FAB clicked, isOpen:", !isOpen);
            handleToggle();
          }}
          className={`w-14 h-14 rounded-full ${themeColors[theme]} shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:shadow-xl z-[9999]`}
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    );
  }

  // Desktop Mode - Navbar button with circular menu
  return (
    <div className="relative">
      {/* Trigger Button */}
      <div onClick={handleToggle}>{trigger}</div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Circular Menu Items (same as mobile) */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute top-full right-0 mt-4 z-50">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  scale: 0.3,
                  y: 20,
                  rotate: -180,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.3,
                  y: 20,
                  rotate: 180,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1,
                }}
                className="mb-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-end"
                >
                  {/* Item Label */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="bg-white rounded-full px-4 py-2 mr-3 shadow-lg border border-gray-100"
                  >
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>

                  {/* Item Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleItemClick(item.onClick)}
                    className={`w-12 h-12 rounded-full ${
                      item.color || themeColors[theme]
                    } shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:shadow-xl`}
                    style={{
                      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    {item.icon}
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;
