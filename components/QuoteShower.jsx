"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const quotes = [
  { text: "Self-control is strength. Right thought is mastery. Calmness is power.", author: "James Allen" },
  { text: "Your future self is watching you right now through your memories.", author: "Anonymous" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "A man who conquers himself is greater than one who conquers a thousand men in battle.", author: "Buddha" },
  { text: "If you get tired, learn to rest, not to quit.", author: "Banksy" },
  { text: "Every time you feel like quitting, remember why you started.", author: "Unknown" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The pain of discipline is nothing compared to the pain of regret.", author: "Jim Rohn" },
  { text: "Freedom begins the moment you choose self-control over self-indulgence.", author: "Epictetus" },
  { text: "Your mind is your greatest weapon. Train it well.", author: "Marcus Aurelius" },
  { text: "Nothing worth having comes easy. Keep pushing forward.", author: "Theodore Roosevelt" },
  { text: "You are stronger than your urges. Prove it every day.", author: "Anonymous" },
  { text: "The chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { text: "Mastery over self is the greatest victory.", author: "Plato" },
  { text: "Every small step towards self-improvement leads to a better future.", author: "Napoleon Hill" },
  { text: "Great things take time. Be patient with yourself.", author: "Confucius" },
  { text: "Your future self will thank you for the discipline you practice today.", author: "Dwayne Johnson" },
  { text: "Willpower, like a muscle, grows stronger with use.", author: "Roy Baumeister" },
  { text: "If you control your thoughts, you control your actions. If you control your actions, you control your life.", author: "Brian Tracy" },
  { text: "The best time to start was yesterday. The next best time is now.", author: "Chinese Proverb" }
];

export function QuoteShower() {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      setSaved(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaved(true);
    
    try {
      const response = await fetch("/api/save-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotes[index])
      });

      if (!response.ok) throw new Error("Failed to save quote");
    } catch (error) {
      console.error(error);
      setSaved(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={index}
          className="p-4 text-[#E5E5E5] rounded-lg shadow-md  cursor-pointer"
          onClick={handleClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg sm:text-xl italic">"{quotes[index].text}"</p>
          <footer className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full"
                src={`https://www.gravatar.com/avatar/${btoa(quotes[index].author)}?d=identicon`}
                alt={quotes[index].author}
              />
              <div className="ml-4">
                <div className="text-base font-semibold text-gray-200">{quotes[index].author}</div>
                <div className="text-xs text-gray-500">Source</div>
              </div>
            </div>
            <button
              className={`p-2 rounded-full transition-colors ${
                saved ? "text-red-500" : "text-gray-500 hover:text-red-400"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              
            </button>
          </footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  );
}
