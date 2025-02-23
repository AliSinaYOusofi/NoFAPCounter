"use client"

import { useState, useCallback } from "react"
import { Maximize, X, Clipboard, ClipboardCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function TipsCard({ title, description, number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(description)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }, [description])

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="backdrop-blur-xl bg-black/40 border border-gray-600 text-white p-8 rounded-2xl shadow-2xl flex flex-col items-start space-y-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-auto"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cardVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-full flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <p className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full text-xl font-bold">
                    {number}
                  </p>
                  <h3 className="text-2xl font-bold text-blue-400">{title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? <ClipboardCheck className="w-5 h-5 mr-2" /> : <Clipboard className="w-5 h-5 mr-2" />}
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <X
                      className="w-8 h-8 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
                      onClick={toggleExpand}
                    />
                  </motion.div>
                </div>
              </div>
              <div className="text-lg text-gray-300 leading-relaxed">
                <p className="mt-6">{description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="w-full max-w-md backdrop-blur-md bg-black/40 border border-gray-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4 hover:shadow-2xl transition-shadow duration-300"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <p className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold">
              {number}
            </p>
            <h3 className="text-lg font-bold text-blue-400">{title}</h3>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Maximize
              className="w-6 h-6 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
              onClick={toggleExpand}
            />
          </motion.div>
        </div>
        <div className="text-sm text-gray-300">
          <p className="mb-2 line-clamp-2">{description}</p>
        </div>
      </motion.div>
    </>
  )
}