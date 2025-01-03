import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const AlertChart = ({ alerts }) => {
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        const ctx = document.getElementById('alertChart').getContext('2d');
        const severityCounts = alerts.reduce(
            (acc, alert) => {
                acc[alert.severity] = (acc[alert.severity] || 0) + 1;
                return acc;
            },
            { Info: 0, Warning: 0, Critical: 0 }
        );

        if (chartInstance) {
            chartInstance.destroy();
        }

        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(severityCounts),
                datasets: [
                    {
                        label: 'Alert Severity Distribution',
                        data: Object.values(severityCounts),
                        backgroundColor: ['#2196f3', '#ffc107', '#f44336'],
                        borderColor: ['#2196f3', '#ffc107', '#f44336'],
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Disable automatic aspect ratio to control size manually
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Severity Levels',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Count',
                        },
                        beginAtZero: true,
                    },
                },
            },
        });

        setChartInstance(newChartInstance);

        return () => {
            if (newChartInstance) {
                newChartInstance.destroy();
            }
        };
    }, [alerts]);

    return (
        <div style={{ width: '400px', height: '300px', marginBottom: '2rem' }}>
            <canvas id="alertChart"></canvas>
        </div>
    );
};

export default AlertChart;
