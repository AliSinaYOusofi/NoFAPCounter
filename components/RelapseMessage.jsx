"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function RelapseMessage() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 flex justify-between items-center shadow-md z-50"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-medium ml-10 text-center"
          >
            <p> Your streak was reset due to inactivity.</p>
            <p> Starting from day one again !!!</p>
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(false)}
            className="hover:bg-red-600 p-1 rounded transition-colors duration-200"
            aria-label="Close message"
          >
            <X size={24} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

