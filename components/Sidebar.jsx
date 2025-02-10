'use client'

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, BarChart, Award, Target, Users, BookOpen, Lightbulb, Heart, Settings, LogOut, Zap, GitGraph } from "lucide-react"
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

export function Sidebar({ isOpen, setIsOpen, onItemClick, activeComponent }) {
  const items = [
    { name: "Dashboard", icon: <Home className="mr-2" />, component: 'dashboard' },
    { name: "Streak", icon: <Zap className="mr-2" />, component: 'streak' },
    { name: "Progress", icon: <BarChart className="mr-2" />, component: 'progress' },
    // { name: "Achievements", icon: <Award className="mr-2" />, component: 'achievements' },
    { name: "Goals", icon: <Target className="mr-2" />, component: 'goals' },
    { name: "Community", icon: <Users className="mr-2" />, component: 'community' },
    { name: "Resources", icon: <BookOpen className="mr-2" />, component: 'resources' },
    { name: "Tips", icon: <Lightbulb className="mr-2" />, component: 'tips' },
    // { name: "Motivation", icon: <Heart className="mr-2" />, component: 'motivation' },
    { name: "Settings", icon: <Settings className="mr-2" />, component: 'settings' },
    { name: "graph", icon: <GitGraph className="mr-2" />, component: 'graph' },

  ]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 p-4 bg-black h-full w-64 text-gray-300 z-10 flex flex-col"
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="hidden"
        variants={sidebarVariants}
      >
        <motion.ul className="space-y-2 mt-16 flex-grow" variants={sidebarVariants}>
          {items.map((item, index) => (
            <motion.li
              key={index}
              className={`p-2 rounded-lg cursor-pointer flex items-center transition-colors ${activeComponent === item.component ? "bg-blue-600" : ""}`} // Apply active style
              variants={itemVariants}
              whileHover="hover"
              onClick={() => onItemClick(item.component)}
            >
              {React.cloneElement(item.icon, { className: "w-5 h-5 mr-3" })}
              {item.name}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div onClick={handleLogout} className="mt-auto" variants={itemVariants} whileHover="hover">
          <motion.li className="p-2 rounded-lg cursor-pointer flex items-center transition-colors">
            <LogOut  className="w-5 h-5 mr-3" />
            Logout
          </motion.li>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
