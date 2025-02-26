"use client";

import { motion } from "framer-motion";
import { Coffee, Heart, Bitcoin } from "lucide-react";
import Toast from "./global/Toast";
import { useState } from "react";

const PayPalIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17.3 5.9C18.7 6.9 19.5 8.5 19.5 10.2C19.5 13.4 16.9 16 13.7 16H9.7L8.2 22H2L6.8 2H15C16 2 16.8 2.3 17.3 2.8C17.8 3.3 18 4 18 4.8C18 5.2 17.9 5.5 17.8 5.8C17.7 5.9 17.5 5.9 17.3 5.9Z" />
        <path d="M18 10.2C18 11.1 17.8 11.9 17.3 12.5C16.8 13.2 16.2 13.7 15.3 14C14.5 14.3 13.5 14.4 12.4 14.4H9.7L8.2 20.4H2.5L7.4 0.4H15.6C16.6 0.4 17.4 0.7 17.9 1.2C18.4 1.7 18.6 2.4 18.6 3.2C18.6 3.6 18.5 3.9 18.4 4.2C18.3 4.3 18.1 4.3 17.9 4.3" />
    </svg>
);

const EthereumIcon = () => (
    <svg
        className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="ethereum"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
    >
        <path
            fill="currentColor"
            d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
        ></path>
    </svg>
);

const SupportComponent = () => {
    
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "info",
        position: "bottom-right",
    });

    const handleToClipboard = (address) => {
        navigator.clipboard.writeText(address)
        
        setNotification({
            show: true,
            message: "Address copied to clipboard",
            type: "info",
            position: "top-center",
        });
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden p-6">
                <motion.div
                    className="backdrop-blur-xl bg-black/40 p-8 rounded-2xl border border-gray-800/50 max-w-3xl mx-auto shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-2xl font-semibold text-blue-400 mb-8 flex items-center gap-3">
                        <Heart size={28} />
                        Support My Work
                    </h2>
                    <div className="space-y-6">
                        <p className="text-gray-300 text-lg">
                            Your support means the world to me and helps me
                            continue creating and improving this project. Here
                            are some ways you can show your support:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a
                                href="https://www.buymeacoffee.com/alisinayousofi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#FFDD00] text-[#000000] hover:bg-[#FFDD00]/90 transition-colors flex items-center justify-center gap-3 text-sm font-medium w-full py-2.5 rounded-lg"
                            >
                                <Coffee size={20} />
                                <span>Buy Me a Coffee</span>
                            </a>
                            <a
                                href="https://www.paypal.com/paypalme/aliyousufi99" // Replace with your actual PayPal.me link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#003087] text-white hover:bg-[#003087]/90 transition-colors flex items-center justify-center gap-3 text-sm font-medium w-full py-2.5 rounded-lg"
                            >
                                <PayPalIcon />
                                <span>Support via PayPal</span>
                            </a>
                            <button
                                type="button"
                                onClick={() => handleToClipboard("bc1qvk4ek3j2dcfx4hu0xaznv263vtjfs228yqz4w6")}
                                className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center w-full"
                            >
                                <Bitcoin size={20} className="mr-2 -ml-1" />
                                Pay with Bitcoin (Trust Wallet)
                            </button>

                            <button
                                type="button"
                                onClick={() => handleToClipboard("0x28BB2F1324Bc37A35016E9339A6e9c8c08B49663")}
                                className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center w-full"
                            >
                                <EthereumIcon />
                                Support with Ethereum (Metamask)
                            </button>
                        </div>
                        <p className="text-gray-400 mt-6">
                            Your generosity allows me to dedicate more time to
                            this project, add new features, and maintain the
                            infrastructure. Every contribution, no matter the
                            size, is deeply appreciated and helps fuel the
                            ongoing development of this web app.
                        </p>
                    </div>
                </motion.div>
            </div>
            <Toast
                show={notification.show}
                message={notification.message}
                type={notification.type}
                position={notification.position}
                onClose={() =>
                    setNotification((prev) => ({ ...prev, show: false }))
                }
            />
        </>
    );
};

export default SupportComponent;
