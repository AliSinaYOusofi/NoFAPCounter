"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart,
  Award,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  Heart,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

const sidebarVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: {
      duration: 0.2,
    },
  },
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const items = [
    { name: "Dashboard", icon: <Home className="mr-2" /> },
    { name: "Progress", icon: <BarChart className="mr-2" /> },
    { name: "Achievements", icon: <Award className="mr-2" /> },
    { name: "Goals", icon: <Target className="mr-2" /> },
    { name: "Community", icon: <Users className="mr-2" /> },
    { name: "Resources", icon: <BookOpen className="mr-2" /> },
    { name: "Tips", icon: <Lightbulb className="mr-2" /> },
    { name: "Motivation", icon: <Heart className="mr-2" /> },
    { name: "Settings", icon: <Settings className="mr-2" /> },
    { name: "Logout", icon: <LogOut className="mr-2" /> },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-20 p-2 bg-[#3d3845] rounded-full text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 p-4 bg-[#3d3845] h-full w-64 text-gray-300 z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
          >
            <motion.ul className="space-y-2 mt-16" variants={sidebarVariants}>
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  className="p-2 rounded-lg cursor-pointer flex items-center transition-colors"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
                  {item.name}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
