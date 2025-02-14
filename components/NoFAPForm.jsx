"use client";

import { useState } from "react";
import {
  Check,
  CircleChevronUp,
  CircleChevronDown,
  BadgeAlert,
  CircleX,
  User,
  Target,
  MessageSquare,
} from "lucide-react";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import { motion, AnimatePresence } from "framer-motion";
import { idValidator } from "@/utils/validators/id_validator";
import { useRouter } from "next/navigation";


const saveNofapDataAction = async (formData) => {
  try {
    const response = await fetch("/api/submit_form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      const json = await response.json()
      return { success: json.success };
    }

    if (response.status === 409) {
      return {
        success: false,
        error: "Username or ID already exists !",
      };
    }

    else if (response.status === 401) {
      return {
        success: false,
        error: "ID already exists !",
      };
    }
    return {
      success: false,
      error: "Failed to submit form",
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "Failed to submit form",
    };
  }
};

const validateForm = (formData) => {
  const errors = {};

  if (!usernameValidator(formData.get("username"))) {
    errors.username = "Username is required";
  }

  if (! idValidator(formData.get("id"))) {
    errors.id  = "Max 12, Min 1, no special chars"
  }

  return errors;
};

export function NofapForm({ className }) {
  const [state, setState] = useState({
    success: false,
    errors: null,
    pending: false,
  });

  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setState({ success: false, errors: errors, pending: false });
      return;
    }

    setState({ success: false, errors: null, pending: true });

    const result = await saveNofapDataAction(formData);

    if (result.success) {
      setState({ success: result.success, errors: null, pending: false });
      
      setTimeout( () => {
        router.push("/dashboard")
      }, 1000)
    } else {
      setState({
        success: false,
        errors: { form: result.error },
        pending: false,
      });
    }
  };

  return (
    
      

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        

        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6 backdrop-blur-md bg-black/40 p-6 rounded-xl border border-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence>
            {state.success && (
              <motion.div
                className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Your progress has been saved. Keep going strong!</span>
                </div>
                <CircleX
                  onClick={() => setState({ success: false, errors: null, pending: false })}
                  className="w-5 h-5 cursor-pointer hover:text-green-300 transition-colors"
                />
              </motion.div>
            )}

            {state.errors && (
              <motion.div
                className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-2">
                  <BadgeAlert className="w-5 h-5" />
                  <span>{state.errors.form || "Failed to save info. Try again!"}</span>
                </div>
                <CircleX
                  onClick={() => setState({ success: false, errors: null, pending: false })}
                  className="w-5 h-5 cursor-pointer hover:text-red-300 transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="form-control">
              <label className="flex items-center gap-2 text-blue-400 mb-2">
                <User size={20} />
                <span>ID</span>
              </label>
              <input
                type="text"
                name="id"
                placeholder="Enter your unique ID"
                className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                required
                disabled={state.pending}
              />
              {state.errors?.id && (
                <p className="mt-2 text-red-400 text-sm">{state.errors.id}</p>
              )}
            </div>

            <div className="form-control">
              <label className="flex items-center gap-2 text-blue-400 mb-2">
                <User size={20} />
                <span>Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                required
                disabled={state.pending}
              />
              {state.errors?.username && (
                <p className="mt-2 text-red-400 text-sm">{state.errors.username}</p>
              )}
            </div>

            <div className="form-control">
              <label className="flex items-center gap-2 text-blue-400 mb-2">
                <Target size={20} />
                <span>Your Goal (days)</span>
              </label>
              <select
                name="goal_days"
                className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                disabled={state.pending}
                defaultValue="90"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days (Recommended)</option>
                <option value="180">180 days</option>
                <option value="365">365 days</option>
              </select>
            </div>

            <div className="form-control">
              <label className="flex items-center gap-2 text-blue-400 mb-2">
                <MessageSquare size={20} />
                <span>Motivational Message</span>
              </label>
              <textarea
                name="motivationalMessage"
                placeholder="Write something to keep yourself motivated..."
                className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors h-32 resize-none"
                disabled={state.pending}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={state.pending}
          >
            Start Your Journey
            {state.pending && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </motion.button>

          <div className="text-center mt-4">
            <a href="/forward" className="text-blue-400 hover:text-blue-300 transition-colors">
              Already have an account? Sign in
            </a>
          </div>
        </motion.form>
      </div>
    
  );
}
