"use client";

import { useState } from "react";
import { Check, BadgeAlert, CircleX, User } from "lucide-react";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import { idValidator } from "@/utils/validators/id_validator";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const loginAction = async (formData) => {
  try {
    const response = await fetch("/api/forward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      const json = await response.json();
      return { success: json.success };
    }

    return {
      success: false,
      error: "Invalid ID or Username",
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message || "Login failed",
    };
  }
};

const validateForm = (formData) => {
  const errors = {};

  if (!usernameValidator(formData.get("username"))) {
    errors.username = "Invalid username";
  }

  if (!idValidator(formData.get("id"))) {
    errors.id = "Invalid ID format";
  }

  return errors;
};

export function LoginForm({ className }) {
  const [state, setState] = useState({
    success: false,
    errors: null,
    pending: false,
  });
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setState({ success: false, errors: errors, pending: false });
      return;
    }

    setState({ success: false, errors: null, pending: true });
    const result = await loginAction(formData);

    if (result.success) {
      setState({ success: true, errors: null, pending: false });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setState({
        success: false,
        errors: { form: result.error },
        pending: false,
      });
    }
  };

  return (
    <div className="min-h-screen w-full md:px-0 px-4 flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <motion.form
        onSubmit={handleSubmit}
        className={`w-full max-w-md space-y-6 backdrop-blur-md bg-black/40 p-6 rounded-xl border border-gray-800/50 ${className}`}
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
                <span>Login successful! Redirecting...</span>
              </div>
              <CircleX
                onClick={() =>
                  setState({ success: false, errors: null, pending: false })
                }
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
                <span>{state.errors.form || "Login failed. Try again!"}</span>
              </div>
              <CircleX
                onClick={() =>
                  setState({ success: false, errors: null, pending: false })
                }
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
        </div>

        <motion.button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={state.pending}
        >
          Login
          {state.pending && (
            <span className="loading loading-spinner loading-sm" />
          )}
        </motion.button>
        
        <div className="text-center mt-4">
            <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              Don't have an account? Sign up
            </a>
          </div>
      </motion.form>
    </div>
  );
}
