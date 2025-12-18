import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { TrendingUp, Leaf, Package, Trash2 } from 'lucide-react';
import api from '../lib/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [analyticsRes, trendsRes] = await Promise.all([
                api.get('/analytics/personal?period=monthly'),
                api.get('/analytics/trends?days=30'),
            ]);
            setAnalytics(analyticsRes.data.data);
            setTrends(trendsRes.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [
            {
                label: 'Waste Prevented (g)',
                data: trends.map(t => t.prevented),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Wasted (g)',
                data: trends.map(t => t.wasted),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="container-custom py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <span className="gradient-text">Personal Analytics</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Track your food waste reduction progress
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="spinner w-12 h-12" />
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <StatsCard
                                title="Total Uploads"
                                value={analytics?.metrics.totalUploads || 0}
                                icon={Package}
                                color="primary"
                            />
                            <StatsCard
                                title="Waste Prevented"
                                value={`${((analytics?.metrics.wastePreventedGrams || 0) / 1000).toFixed(1)}kg`}
                                icon={Leaf}
                                color="success"
                            />
                            <StatsCard
                                title="Items Reused"
                                value={analytics?.metrics.reusedCount || 0}
                                icon={TrendingUp}
                                color="accent"
                            />
                            <StatsCard
                                title="Items Wasted"
                                value={analytics?.metrics.discardedCount || 0}
                                icon={Trash2}
                                color="secondary"
                            />
                        </div>

                        <div className="card mb-8">
                            <h2 className="text-2xl font-bold mb-6">Waste Trends (Last 30 Days)</h2>
                            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
                        </div>

                        <div className="card">
                            <h2 className="text-2xl font-bold mb-6">Waste Prevention Rate</h2>
                            <div className="text-center">
                                <div className="text-6xl font-bold gradient-text mb-2">
                                    {analytics?.wastePreventionRate || 0}%
                                </div>
                                <p className="text-gray-600">of your food was saved from waste</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
