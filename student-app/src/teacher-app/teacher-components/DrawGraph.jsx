import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
// Declare the module for compatibility with TypeScript
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    TimeScale // Register time scale
);

const DrawGraph = ({ title, datasets }) => {
    const data = {
        datasets: datasets.map((dataset) => ({
            label: dataset.label, // Dataset label
            data: dataset.data,  // Data points for the dataset
            borderColor: dataset.borderColor || "rgba(75,192,192,1)", // Line color
            backgroundColor: dataset.backgroundColor || "rgba(75,192,192,0.2)", // Fill color
            tension: dataset.tension || 0.4, // Line smoothness
            borderWidth: dataset.borderWidth || 2, // Line thickness
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: title, // Graph title
            },
        },
        scales: {
            x: {
                type: "time", // Use time scale for x-axis
                time: {
                    tooltipFormat: "MMM d, yyyy, h:mm a", // Tooltip format
                    displayFormats: {
                        minute: "h:mm a", // Minute granularity
                        hour: "MMM d, h a", // Hourly granularity
                        day: "MMM d, yyyy", // Daily granularity
                    },
                },
                title: {
                    display: true,
                    text: "Date & Time", // X-axis label
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Score (%)", // Y-axis label
                },
                ticks: {
                    beginAtZero: true,
                },
            },
        },
    };

    return (
        <div style={{ width: "100", margin: "auto" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default DrawGraph;
