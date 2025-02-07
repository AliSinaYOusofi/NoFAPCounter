"use client";

import { useState } from "react";
import { Check, BadgeAlert, CircleX, Router } from "lucide-react";
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
            localStorage.setItem("token", json.token);
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
    const router = useRouter()
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            setState({ success: false, errors, pending: false });
            return;
        }

        setState({ success: false, errors: null, pending: true });
        const result = await loginAction(formData);

        if (result.success) {
            setState({ success: true, errors: null, pending: false });
            router.push('/dashboard')
        } else {
            setState({
                success: false,
                errors: { form: result.error },
                pending: false,
            });
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4d4855] to-black text-white">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`card w-full max-w-md bg-white ${className || ""}`}
            >
                <div className="card-body">
                    <h2 className="card-title text-center mx-auto tracking-widest text-gray-900">
                        Login
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <AnimatePresence>
                            {state.success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="alert alert-success"
                                >
                                    <Check className="w-8 h-8 text-gray-200" />
                                    <span className="text-gray-100 cursor-pointer">
                                        Login successful!
                                    </span>
                                    <CircleX
                                        onClick={() =>
                                            setState({
                                                success: false,
                                                errors: null,
                                                pending: false,
                                            })
                                        }
                                        className="w-8 h-8 cursor-pointer text-gray-600 bg-gray-50 p-1 rounded-full"
                                    />
                                </motion.div>
                            )}

                            {state.errors && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="alert alert-error"
                                >
                                    <BadgeAlert className="w-8 h-8 text-gray-200" />
                                    <span className="text-gray-100">
                                        {state.errors.form || "Login failed"}
                                    </span>
                                    <CircleX
                                        onClick={() =>
                                            setState({
                                                success: false,
                                                errors: null,
                                                pending: false,
                                            })
                                        }
                                        className="w-8 h-8 cursor-pointer text-gray-600 bg-gray-50 p-1 rounded-full"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="form-control">
                            <label className="label" htmlFor="username">
                                <span className="label-text text-gray-700">
                                    Username
                                </span>
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

                        <div className="form-control mt-4">
                            <label className="label" htmlFor="id">
                                <span className="label-text text-gray-700">
                                    ID
                                </span>
                            </label>
                            <input
                                type="text"
                                id="id"
                                name="id"
                                placeholder="Enter your ID"
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

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`bg-black p-3 rounded-md flex items-center justify-center font-normal text-white`}
                                disabled={state.pending}
                            >
                                Login
                                {state.pending && (
                                    <span className="loading ml-5 loading-spinner loading-sm"></span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
