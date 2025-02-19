import React from "react";
import { Lightbulb } from "lucide-react";
import TipsCard from "./TipsCard";
import { motion } from "framer-motion";
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
    {
        title: "Practice cold showers",
        description:
            "Take cold showers to build mental toughness and reduce urges. Cold showers are a form of discomfort that can help you practice self-discipline. They also reduce stress and improve circulation, which can help you feel more energized and focused. Over time, cold showers can train your mind to handle discomfort, making it easier to resist temptations.",
    },
    {
        title: "Limit screen time",
        description:
            "Reduce the amount of time you spend on devices, especially before bed. Excessive screen time, particularly on social media or websites with explicit content, can increase the likelihood of relapse. Set boundaries for your device usage and consider using apps that block distracting or harmful content. This will help you stay focused and avoid unnecessary triggers.",
    },
    {
        title: "Join a support group",
        description:
            "Connect with others who are also on the NoFap journey. Being part of a community can provide accountability, encouragement, and motivation. Sharing your struggles and successes with others can make the process feel less isolating. Online forums, social media groups, or local meetups can be great places to find support.",
    },
    {
        title: "Practice gratitude",
        description:
            "Focus on the positive aspects of your life to shift your mindset. Gratitude helps you appreciate what you have rather than dwelling on what you're trying to avoid. Start a daily gratitude journal where you write down things you're thankful for. This practice can improve your mental health and reduce the urge to seek temporary pleasures.",
    },
    {
        title: "Get enough sleep",
        description:
            "Prioritize rest to maintain emotional and mental balance. Lack of sleep can weaken your self-control and make you more susceptible to cravings. Aim for 7-9 hours of quality sleep each night to ensure your mind and body are functioning optimally. A well-rested brain is better equipped to resist temptations.",
    },
    {
        title: "Learn to say no",
        description:
            "Practice setting boundaries and refusing temptations. Saying no to small temptations can strengthen your willpower over time. Whether it's declining an invitation to a triggering environment or refusing to engage in harmful thoughts, learning to say no is a critical skill for success in NoFap.",
    },
    {
        title: "Track your progress",
        description:
            "Use a journal or app to monitor your NoFap journey. Tracking your progress helps you stay accountable and provides a sense of accomplishment as you reach milestones. Reflecting on your successes and challenges can also help you identify patterns and areas for improvement.",
    },
    {
        title: "Focus on self-improvement",
        description:
            "Invest time in personal growth and development. Whether it's learning a new skill, improving your career, or working on your physical health, focusing on self-improvement can give you a sense of purpose. This will help you stay motivated and reduce the likelihood of relapse.",
    },
    {
        title: "Practice deep breathing",
        description:
            "Use deep breathing techniques to manage stress and cravings. When you feel an urge, take slow, deep breaths to calm your mind and body. Deep breathing can help you regain control and refocus your energy on your goals.",
    },
    {
        title: "Visualize success",
        description:
            "Imagine yourself achieving your NoFap goals and enjoying the benefits. Visualization can help you stay motivated and reinforce your commitment. Picture yourself as a stronger, more disciplined person who has overcome challenges and achieved success.",
    },
    {
        title: "Avoid late-night browsing",
        description:
            "Stay off the internet late at night when willpower is often weakest. Late-night browsing can lead to mindless scrolling and exposure to triggering content. Establish a bedtime routine that doesn't involve screens to reduce the risk of relapse.",
    },
    {
        title: "Reward yourself",
        description:
            "Celebrate milestones and achievements along the way. Rewarding yourself for progress can help you stay motivated and reinforce positive behavior. Choose non-triggering rewards, such as treating yourself to a favorite meal or buying something you've been wanting.",
    },
    {
        title: "Seek professional help if needed",
        description:
            "Consider therapy or counseling if you're struggling to overcome addiction. A mental health professional can provide guidance, support, and strategies tailored to your specific needs. There's no shame in seeking help, and it can make a significant difference in your journey.",
    },
    {
        title: "Practice mindfulness",
        description:
            "Stay present and aware of your thoughts and actions. Mindfulness helps you recognize urges without acting on them. By staying in the moment, you can better manage your emotions and avoid impulsive decisions.",
    },
    {
        title: "Surround yourself with positivity",
        description:
            "Spend time with people who uplift and inspire you. Positive influences can help you stay motivated and focused on your goals. Avoid individuals or environments that encourage negative behaviors or temptations.",
    },
    {
        title: "Educate yourself",
        description:
            "Learn about the benefits of NoFap and the harms of excessive indulgence. Understanding the science behind addiction and the positive effects of abstaining can reinforce your commitment. Read books, watch videos, or listen to podcasts on the topic to stay informed and motivated.",
    },
    {
        title: "Be patient with yourself",
        description:
            "Understand that progress takes time and setbacks are part of the journey. Don't be too hard on yourself if you slip up. Instead, learn from the experience and recommit to your goals. Persistence and self-compassion are key to long-term success.",
    },
];

export default function Tips() {
    return (
        <div className="w-full h-full bg-gradient-to-r from-black via-gray-900 to-black text-white p-4 flex flex-col items-center text-center">
            <div className="mt-4 space-y-2 text-gray-300 flex flex-wrap gap-10 items-center justify-center">
                {noFapTips.map((tip, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <TipsCard
                            title={tip.title}
                            description={tip.description}
                            number={index + 1}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
