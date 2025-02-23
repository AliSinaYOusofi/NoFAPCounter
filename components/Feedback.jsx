"use client"
import { motion } from "framer-motion"
import { Mail, MessageCircle, MessageCircleHeart } from "lucide-react"

const FeedbackComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden p-6">

        <motion.div
        className="backdrop-blur-xl bg-black/40 p-8 rounded-2xl border border-gray-800/50 max-w-3xl mx-auto shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        >
        <h2 className="text-2xl font-semibold text-blue-400 mb-8 flex items-center gap-3">
            <MessageCircleHeart size={28} />
            Contact Us
        </h2>
        <div className="space-y-6">
            <p className="text-gray-300 text-lg">
            We appreciate the time you take to give us feedback.  Feel free to reach out through any of the following
            methods:
            </p>
            <div className="flex flex-col space-y-4">
            <a
                href="mailto:tinayousofiali@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-3 text-xl"
            >
                <Mail size={24} />
                <span>Email: tinayousofiali@gmail.com</span>
            </a>
            <a
                href="https://wa.me/93749109897"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-3 text-xl"
            >
                <MessageCircle size={24} />
                <span>WhatsApp: +93749109897</span>
            </a>
            </div>
            <p className="text-gray-400 mt-6">
            We're committed to providing you with the best possible experience and support. Don't hesitate to get in touch
            with any questions, suggestions, or concerns you may have. Also provide us with featuers you think this web app lacks.
            </p>
        </div>
        </motion.div>
    </div>
  )
}

export default FeedbackComponent

