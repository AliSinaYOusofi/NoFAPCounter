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
    scale: 1.05,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: {
      duration: 0.2,
    },
  },
}

export function Sidebar({ isOpen, onItemClick, activeComponent, setActiveComponent }) {

  const items = [
    { name: "Dashboard", icon: <Home className="mr-2" />, component: 'dashboard' },
    { name: "Streak", icon: <Zap className="mr-2" />, component: 'streak' },
    { name: "Progress", icon: <BarChart className="mr-2" />, component: 'progress' },
    { name: "Goals", icon: <Target className="mr-2" />, component: 'goals' },
    { name: "Tips", icon: <Lightbulb className="mr-2" />, component: 'tips' },
    { name: "Settings", icon: <Settings className="mr-2" />, component: 'settings' },
    { name: "graph", icon: <ChartNoAxesColumnIncreasing className="mr-2" />, component: 'graph' },
  ]

  return (
    <AnimatePresence >
      
      <motion.div
        className="fixed  top-0 left-0 p-4 bg-black h-full w-64 text-gray-300 z-[99] flex flex-col"
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="hidden"
        variants={sidebarVariants}
      >
        <motion.ul className="space-y-2 mt-16 flex-grow" variants={sidebarVariants}>
          {items.map((item, index) => (
            <motion.li
              key={index}
              className={`p-2 rounded-lg cursor-pointer flex items-center transition-colors ${activeComponent === item.component ? "bg-blue-600" : ""}`}
              variants={itemVariants}
              whileHover="hover"
              onClick={() =>  onItemClick(item.component)}
            >
              {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
              {item.name}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div onClick={handleLogout} className="mt-auto rounded-lg" variants={itemVariants} whileHover="hover">
          <motion.li className="p-2 cursor-pointer flex items-center transition-colors">
            <LogOut  className="w-5 h-5 mr-3" />
            Logout
          </motion.li>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
