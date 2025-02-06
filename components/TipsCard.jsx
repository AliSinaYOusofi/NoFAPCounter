import React, { useState } from "react";
import { CloudSnowIcon, Maximize, PanelTopClose, X } from "lucide-react";
import { motion } from "framer-motion";

export default function TipsCard({ title, description, number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <motion.div
                        className="w-full h-full flex justify-center items-center"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="bg-gray-800 text-white p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4 max-w-full h-full overflow-auto"
                            style={{
                                maxWidth: "50%",
                                maxHeight: "50%",
                            }}
                        >
                            <div className="w-full flex justify-between items-center">
                                <div className="flex gap-4">

                                    <p className="px-2 bg-white text-black rounded-full">{number}</p>
                                    <h3 className="text-lg font-semibold">{title}</h3>
                                </div>
                                <X
                                    className="cursor-pointer transition-all duration-200 hover:-translate-y-1"
                                    onClick={toggleExpand}
                                />
                            </div>

                            <div className="text-xl text-gray-300 ">
                                <p className="mb-2">{description}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {!isExpanded && (
                <div
                    className="w-full max-w-md border border-gray-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4"
                >
                    {/* Flex container for number and maximize icon */}
                    <div className="w-full flex justify-between items-center">
                        <p className="px-2 bg-white text-black rounded-full">{number}</p>
                        <Maximize
                            className="cursor-pointer transition-all duration-200 hover:-translate-y-1"
                            onClick={toggleExpand}
                        />
                    </div>

                    {/* Title and description */}
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="text-sm text-gray-300">
                        <p className="mb-2 line-clamp-2">{description}</p>
                    </div>
                </div>
            )}
        </>
    );
}
