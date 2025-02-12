"use client";

import { useState } from "react";
import {
  Check,
  CircleChevronUp,
  CircleChevronDown,
  BadgeAlert,
  CircleX,
} from "lucide-react";
import { usernameValidator } from "@/utils/validators/usernameValidator";
import { currentSreakValidator } from "@/utils/validators/currentStreakValidator";
import { dateValidator } from "@/utils/validators/dateValidator";
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
      console.log(json, 'what the fuck')
      const token = json.token;

      localStorage.setItem("token", token);
      
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

  if (!dateValidator(formData.get("startDate"))) {
    errors.startDate = "Either today or earlier date";
  }

  if (!currentSreakValidator(formData.get("currentStreak"))) {
    errors.currentStreak = "Current streak should be a number";
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

  const loaderVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className={`card w-full max-w-md bg-white ${className || ""}`}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="card-body">
        <h2 className="card-title text-center mx-auto tracking-widest text-gray-900">
          NoFAP Tracker
        </h2>
        <p className="text-gray-700">
          Track your NoFap journey and stay motivated!
        </p>
        <form onSubmit={handleSubmit}>
          <AnimatePresence>
            {state.success && (
              <motion.div
                className="alert alert-success"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Check className="w-8 h-8 text-gray-200" />
                <span className="text-gray-100 cursor-pointer">
                  Your progress has been saved. Keep going strong!
                </span>
                <CircleX
                  onClick={() => {
                    setState({ success: false, errors: null, pending: false });
                  }}
                  className="w-8 h-8 cursor-pointer text-gray-600 bg-gray-50 p-1 rounded-full"
                />
              </motion.div>
            )}

            {state.errors && (
              <motion.div
                className="alert alert-error"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <BadgeAlert className="w-8 h-8 text-gray-200" />
                <span className="text-gray-100">
                  {state.errors.form || "Failed to save info. Try again!"}
                </span>
                <CircleX
                  onClick={() => {
                    setState({ success: false, errors: null, pending: false });
                  }}
                  className="w-8 h-8 cursor-pointer text-gray-600 bg-gray-50 p-1 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-control">
            <label className="label" htmlFor="username">
              <span className="label-text text-gray-700">Username</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="JohnDoe123"
              className="input input-bordered bg-gray-100 text-gray-700"
              required
              disabled={state.pending}
            />
            {state.errors?.username && (
              <p className="text-red-500 text-sm mt-2">
                {state.errors.username}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="id">
              <span className="label-text text-gray-700">ID</span>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="number or text"
              className="input input-bordered bg-gray-100 text-gray-700"
              required
              disabled={state.pending}
            />
            {state.errors?.id && (
              <p className="text-red-500 text-sm mt-2">
                {state.errors.id}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="startDate">
              <span className="label-text text-gray-700">Start Date</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="input input-bordered bg-gray-100 text-gray-700"
              required
              disabled={state.pending}
            />
            {state.errors?.startDate && (
              <p className="text-red-500 text-sm mt-2">
                {state.errors.startDate}
              </p>
            )}
          </div>

          <div className="flex relative flex-row items-center justify-between mt-5">
            <div className="flex-grow mr-2">
              <label className="label" htmlFor="currentStreak">
                <span className="label-text text-gray-700">Current streak</span>
              </label>
              <input
                id="currentStreak"
                name="currentStreak"
                min="0"
                className="input input-bordered bg-gray-100 text-gray-700 w-full"
                required
                disabled={state.pending}
              />
              {state.errors?.currentStreak && (
                <p className="text-red-500 text-sm mt-2">
                  {state.errors.currentStreak}
                </p>
              )}
            </div>

            <div className="absolute flex top-5 translate-y-[50%] right-5 flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("currentStreak");
                  input.value = Number.parseInt(input.value) + 1;
                }}
                className=""
                disabled={state.pending}
              >
                <CircleChevronUp className="w-5 h-5 text-gray-600" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("currentStreak");
                  if (input.value > 0) {
                    input.value = Number.parseInt(input.value) - 1;
                  }
                }}
                className=""
                disabled={state.pending}
              >
                <CircleChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="motivationalMessage">
              <span className="label-text text-gray-700">
                Motivational Message
              </span>
            </label>
            <textarea
              id="motivationalMessage"
              name="motivationalMessage"
              placeholder="Write a message to keep yourself motivated..."
              className="textarea textarea-bordered h-24 bg-gray-100 text-gray-700"
              disabled={state.pending}
            ></textarea>
          </div>
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`bg-black p-3 rounded-md flex items-center justify-center font-normal text-white`}
              disabled={state.pending}
            >
              Save Progress
              {state.pending && (
                <motion.span
                  className="loading ml-5 loading-spinner loading-sm"
                  variants={loaderVariants}
                  initial="hidden"
                  animate="visible"
                />
              )}
            </button>
          </div>
        </form>
        <a href="/forward" className="text-black mt-4 hover:text-blue-500 hover:underline">Already Have an account</a>
      </div>
    </motion.div>
  );
}
