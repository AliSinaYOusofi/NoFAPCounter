"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configure default options
ChartJS.defaults.color = "rgba(255, 255, 255, 0.7)";
ChartJS.defaults.borderColor = "rgba(255, 255, 255, 0.1)";
ChartJS.defaults.font.family = "Inter, sans-serif";

export default ChartJS; 