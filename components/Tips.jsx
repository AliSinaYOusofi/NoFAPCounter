import React from "react";
import { Lightbulb } from "lucide-react";
import TipsCard from "./TipsCard";

const noFapTips = [
    {
        title: "Avoid triggers",
        description:
            "Stay away from explicit content and environments that encourage temptation. Triggers can come in many forms, such as social media, certain websites, or specific people. Identifying these triggers will help you avoid situations where you might feel tempted. It's important to remove or avoid them to build stronger self-control. This helps you stay focused on your goal to quit.",
    },
    {
        title: "Keep yourself busy",
        description:
            "Engage in productive activities to keep your mind occupied. Boredom often leads to temptation, so make sure you stay engaged with tasks that contribute to your well-being. Consider hobbies like reading, writing, or pursuing creative activities. The more occupied you are, the less likely you'll find yourself slipping into old habits. Find activities that are fulfilling and rewarding to keep yourself busy.",
    },
    {
        title: "Work out daily",
        description:
            "Redirect your energy into something positive by exercising regularly. Physical activity helps reduce stress, release endorphins, and provide a healthy outlet for your energy. Whether it's jogging, weightlifting, yoga, or even just a walk, exercising daily will help you manage cravings. Exercise also boosts your mood and mental clarity, making it easier to stay disciplined. Incorporating daily workouts into your routine can also improve your overall health.",
    },
    {
        title: "Meditate",
        description:
            "Improve self-control and awareness through daily meditation. Meditation helps calm your mind, improves your focus, and enhances emotional regulation. It teaches you to be more mindful of your thoughts and urges. With regular practice, you'll become more aware of your impulses and better able to resist them. Meditation can be a powerful tool for building mental strength and resilience.",
    },
    {
        title: "Set clear goals",
        description:
            "Define why you want to quit and use it as motivation. Having a clear vision of your goals will give you the drive to stick with your commitment. Whether it's for personal growth, improving relationships, or achieving better health, knowing your 'why' is crucial. Write down your reasons and remind yourself of them regularly to stay motivated. Tracking your progress will also help you stay focused on your end goal.",
    },
    
];

export default function Tips() {
    return (
        <div className="w-full h-full bg-black text-white p-4 flex flex-col items-center text-center">
            <div className="mt-4 space-y-2 text-gray-300 flex flex-wrap gap-10 items-center justify-center">
                {noFapTips.map((tip, index) => (
                    <TipsCard
                        key={index}
                        title={tip.title}
                        description={tip.description}
                        number={index + 1}
                    />
                ))}
            </div>
        </div>
    );
}
