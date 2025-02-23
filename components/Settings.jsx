"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    User,
    Target,
    MessageSquare,
    AlertCircle,
    Clock,
    AlertTriangle,
    Trash2,
    X,
} from "lucide-react";
import Toast from "./global/Toast";
import RetryButton from "./global/RetryButton";

export default function Settings() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "info",
        position: "bottom-right",
    });

    const [formData, setFormData] = useState({
        username: "",
        goal_days: "",
        motivationalMessage: "",
        timezone: "",
        deleteAccount: false,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user_data");
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setUserData(data);
                console.log(data, ' sett')
                setFormData({
                    username: data.username,
                    goal_days: data.goal_days,
                    motivationalMessage: data.motivationalMessage || "",
                    timezone: data.timezone || "",
                });
            } catch (error) {
                setError("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [refresh]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch("/api/update_settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update settings");

            setNotification({
                show: true,
                message: "Settings updated successfully!",
                type: "success",
                position: "bottom-right",
            });

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
        } catch (error) {
            setError("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch("/api/delete_account", {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete account");

            window.location.href = "/";
        } catch (error) {
            setError("Failed to delete account");
        } finally {
        }
    };

    const DeleteConfirmationModal = () => (
        <AnimatePresence>
            {showDeleteModal && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-black/60 border border-red-500/20 p-8 rounded-xl max-w-md w-full mx-4 backdrop-blur-md"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                                <AlertTriangle size={24} />
                                Delete Account
                            </h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-400 hover:text-gray-300 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-300">
                                Are you sure you want to delete your account?
                                This action cannot be undone and you will lose:
                            </p>
                            <ul className="list-disc list-inside text-gray-400 space-y-2">
                                <li>All your streak history</li>
                                <li>Your goals and progress</li>
                                <li>Your milestones and achievements</li>
                            </ul>

                            <div className="flex items-center justify-end gap-4 mt-8">
                                <motion.button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Delete Account
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const goalOptions = [
        { value: 1, label: "1 day (Trial)" },
        { value: 2, label: "2 days (Getting Started)" },
        { value: 3, label: "3 days (Starter)" },
        { value: 5, label: "5 days (Small Step)" },
        { value: 7, label: "7 days (A Week)" },
        { value: 10, label: "10 days" },
        { value: 14, label: "14 days (Two Weeks)" },
        { value: 21, label: "21 days (Challenge)" },
        { value: 30, label: "30 days (1 Month)" },
        { value: 45, label: "45 days" },
        { value: 60, label: "60 days (2 Months)" },
        { value: 90, label: "90 days (Recommended)" },
        { value: 120, label: "120 days (4 Months)" },
        { value: 180, label: "180 days (6 Months)" },
        { value: 365, label: "365 days (1 Year)" },
    ];


    if (loading) {
        return (
            <div className="h-screen bg-black w-full flex items-center justify-center">
                <span className="loading loading-spinner text-blue-500"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-screen h-screen flex-col flex items-center justify-center bg-black">
                <p className="text-red-500">Error: {error}</p>
                <RetryButton setRefresh={setRefresh} />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden p-6">
            <div className="relative z-10 w-full max-w-2xl mx-auto">
                <motion.h1
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Settings
                </motion.h1>

                <div className="space-y-6">
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="backdrop-blur-md bg-black/40 p-6 rounded-xl border border-gray-800/50">
                            <h2 className="text-xl font-semibold text-blue-400 mb-6 flex items-center gap-2">
                                <User size={20} />
                                Account Settings
                            </h2>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="flex items-center gap-2 text-blue-400 mb-2">
                                        <span>Username</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                username: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="backdrop-blur-md bg-black/40 p-6 rounded-xl border border-gray-800/50">
                            <h2 className="text-xl font-semibold text-blue-400 mb-6 flex items-center gap-2">
                                <Target size={20} />
                                Goal Settings
                            </h2>
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="flex items-center gap-2 text-blue-400 mb-2">
                                        <span>Goal (days)</span>
                                    </label>
                                    <select
                                        value={formData.goal_days}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                goal_days: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                                    >
                                        {
                                            goalOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                                disabled={option.value <= userData?.currentStreak}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="flex items-center gap-2 text-blue-400 mb-2">
                                        <MessageSquare size={20} />
                                        <span>Motivational Message</span>
                                    </label>
                                    <textarea
                                        value={formData.motivationalMessage}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                motivationalMessage:
                                                    e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors h-32 resize-none"
                                        placeholder="Write something to keep yourself motivated..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                <AlertCircle size={16} />
                                <span>Changes will be saved immediately</span>
                            </div>
                            <motion.button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={saving}
                            >
                                <Save size={20} />
                                {saving ? "Saving..." : "Save Changes"}
                            </motion.button>
                        </div>
                    </motion.form>

                    <motion.div
                        className="backdrop-blur-md bg-black/40 p-6 rounded-xl border border-red-900/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-2">
                            <AlertTriangle size={20} />
                            Danger Zone
                        </h2>
                        <div className="space-y-4">
                            <p className="text-gray-400">
                                Once you delete your account, there is no going
                                back. Please be certain.
                            </p>
                            <motion.button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-6 py-3 bg-red-600/20 text-red-400 border border-red-600/50 rounded-lg flex items-center gap-2 hover:bg-red-600/30 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Trash2 size={20} />
                                Delete Account
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <DeleteConfirmationModal />

            <Toast
                show={notification.show}
                message={notification.message}
                type={notification.type}
                position={notification.position}
                onClose={() =>
                    setNotification((prev) => ({ ...prev, show: false }))
                }
            />
        </div>
    );
}
