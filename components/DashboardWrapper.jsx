"use client";

import ShowStreakDaysOnly from "@/components/ShowStreakDaysOnly";
import { Sidebar } from "./Sidebar";
import { UserDashBoard } from "@/components/UserDashBoard";
import { useState } from "react";
import { Menu } from "lucide-react";
import Tips from "@/components/Tips";
import Goals from "@/components/Goals";
import ContributionGraph from "@/components/global/Contribution";
import Settings from "./Settings";
import ContributionWrapper from "./global/ContributionWrapper";
import FeedbackComponent from "./Feedback";
import Hamburger from "hamburger-react";
import SupportComponent from "./SupportComponent";

export default function DashboardWrapper() {
    const [isOpen, setIsOpen] = useState(true);
    const [activeComponent, setActiveComponent] = useState("streak");

    const handleSidebarClick = (componentName) => {
        setActiveComponent(componentName);
    };

    return (
        <div className="min-h-screen relative flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed z-[100]   border-white   rounded-full text-white"
            >
                <Hamburger size={20} toggled={isOpen} toggle={setIsOpen} />
            </button>
            <div className="flex flex-1 overflow-hidden">
                {isOpen && (
                    <div className=" md:flex md:w-60 bg-gradient-to-b from-black via-gray-900 to-black">
                        <Sidebar
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            onItemClick={handleSidebarClick}
                            activeComponent={activeComponent}
                            setActiveComponent={setActiveComponent}
                        />
                    </div>
                )}
                <div
                    className={`flex-1 ${isOpen ? "md:w-[calc(100%-15rem)]" : "w-full"} flex items-center justify-center`}
                >
                    {activeComponent === "streak" && (
                        <ShowStreakDaysOnly key="streak" />
                    )}
                    {activeComponent === "dashboard" && (
                        <UserDashBoard key="dashboard" />
                    )}
                    {activeComponent === "tips" && <Tips key="tips" />}
                    {activeComponent === "goals" && <Goals key="goals" />}
                    {activeComponent === "graph" && (
                        <ContributionWrapper key="graph" />
                    )}
                    {activeComponent === 'settings' && <Settings />}
                    {activeComponent === 'feedback' && <FeedbackComponent />}
                    {activeComponent === 'support' && <SupportComponent />}
                </div>
            </div>
        </div>
    );
}
