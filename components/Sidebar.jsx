"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Target,
  Lightbulb,
  Settings,
  LogOut,
  Zap,
  BarChartIcon as ChartNoAxesColumnIncreasing,
} from "lucide-react"
import handleLogout from "@/utils/handle_logout"

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

export function Sidebar({ isOpen, onItemClick, activeComponent, setActiveComponent }) {
  const items = [
    { name: "Dashboard", icon: <Home className="mr-2" />, component: "dashboard" },
    { name: "Streak", icon: <Zap className="mr-2" />, component: "streak" },
    { name: "Goals", icon: <Target className="mr-2" />, component: "goals" },
    { name: "Tips", icon: <Lightbulb className="mr-2" />, component: "tips" },
    { name: "Settings", icon: <Settings className="mr-2" />, component: "settings" },
    { name: "Graph", icon: <ChartNoAxesColumnIncreasing className="mr-2" />, component: "graph" },
  ]
  const [loggingOut, setLoggingout] = useState(false)

  return (
    <motion.div
      className="fixed top-0 left-0 h-full w-64 z-[99] bg-gradient-to-b from-black via-gray-900 to-black"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/10"></div>

      <motion.div className="relative z-10 h-full flex flex-col p-4">
        <div className="mt-8 mb-12 text-center"></div>

        <motion.ul className="space-y-2 flex-grow">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.li
                key={item.name}
                variants={itemVariants}
                custom={index}
                className={`p-3 rounded-lg cursor-pointer flex items-center transition-all duration-300
                  ${
                    activeComponent === item.component
                      ? "bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      : "text-gray-300 hover:text-blue-400"
                  }`}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  transition: { duration: 0.2 },
                }}
                onClick={() => onItemClick(item.component)}
              >
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 mr-3 ${activeComponent === item.component ? "text-blue-400" : ""}`,
                })}
                <span className="font-medium">{item.name}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <motion.button
          onClick={() => handleLogout(setLoggingout)}
          className={`mt-auto p-3 rounded-lg cursor-pointer flex items-center text-red-400 hover:bg-red-500/10 transition-all duration-300 ${loggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
          variants={itemVariants}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            transition: { duration: 0.2 },
          }}
          disabled={loggingOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
          {loggingOut && <span className="loading loading-spinner ml-10"></span>}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}