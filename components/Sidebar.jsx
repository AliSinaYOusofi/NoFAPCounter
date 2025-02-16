'use client'

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BarChart, Target, Users, BookOpen, Lightbulb, Settings, LogOut, Zap, ChartNoAxesColumnIncreasing, Menu } from "lucide-react"
import handleLogout from "@/utils/handle_logout"

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
}

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
    scale: 1.02,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    transition: {
      duration: 0.2,
    },
  },
}

export function Sidebar({ isOpen, onItemClick, activeComponent, setActiveComponent }) {
  const items = [
    { name: "Dashboard", icon: <Home className="mr-2" />, component: 'dashboard' },
    { name: "Streak", icon: <Zap className="mr-2" />, component: 'streak' },
    // { name: "Progress", icon: <BarChart className="mr-2" />, component: 'progress' },
    { name: "Goals", icon: <Target className="mr-2" />, component: 'goals' },
    { name: "Tips", icon: <Lightbulb className="mr-2" />, component: 'tips' },
    { name: "Settings", icon: <Settings className="mr-2" />, component: 'settings' },
    { name: "Graph", icon: <ChartNoAxesColumnIncreasing className="mr-2" />, component: 'graph' },
  ]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 h-full w-64 z-[99] backdrop-blur-md bg-black/80"
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="hidden"
        variants={sidebarVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/10"></div>
        <motion.div className="relative z-10 h-full flex flex-col p-4">
          <div className="mt-8 mb-12 text-center">
            
          </div>

          <motion.ul className="space-y-2 flex-grow" variants={sidebarVariants}>
            {items.map((item, index) => (
              <motion.li
                key={index}
                className={`p-3 rounded-lg cursor-pointer flex items-center transition-all duration-300
                  ${activeComponent === item.component 
                    ? "bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]" 
                    : "text-gray-300 hover:text-blue-400"}`}
                variants={itemVariants}
                whileHover="hover"
                onClick={() => onItemClick(item.component)}
              >
                {React.cloneElement(item.icon, { 
                  className: `w-5 h-5 mr-3 ${activeComponent === item.component ? "text-blue-400" : ""}` 
                })}
                <span className="font-medium">{item.name}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div 
            onClick={handleLogout} 
            className="mt-auto p-3 rounded-lg cursor-pointer flex items-center text-red-400 hover:bg-red-500/10 transition-all duration-300"
            variants={itemVariants}
            whileHover="hover"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
