import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, History, BarChart3, Leaf, TrendingUp, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import FoodCard from '../components/FoodCard';
import api from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const DashboardPage = () => {
    const user = getCurrentUser();
    const [recentUploads, setRecentUploads] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch recent uploads
            const uploadsRes = await api.get('/food/history?limit=3');
            setRecentUploads(uploadsRes.data.data);

            // Fetch analytics
            const analyticsRes = await api.get('/analytics/personal?period=monthly');
            setAnalytics(analyticsRes.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="container-custom py-8">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        Welcome back, <span className="gradient-text">{user?.name}</span>! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Track your food waste reduction journey and make a positive impact
                    </p>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="spinner w-12 h-12" />
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
                            <StatsCard
                                title="Total Uploads"
                                value={analytics?.metrics.totalUploads || 0}
                                subtitle="This month"
                                icon={Package}
                                color="primary"
                            />
                            <StatsCard
                                title="Waste Prevented"
                                value={`${((analytics?.metrics.wastePreventedGrams || 0) / 1000).toFixed(1)}kg`}
                                subtitle="Food saved"
                                icon={Leaf}
                                color="success"
                                trend="up"
                                trendValue={`${analytics?.wastePreventionRate || 0}% rate`}
                            />
                            <StatsCard
                                title="Items Reused"
                                value={analytics?.metrics.reusedCount || 0}
                                subtitle="Creative reuse"
                                icon={TrendingUp}
                                color="accent"
                            />
                            <StatsCard
                                title="Items Donated"
                                value={analytics?.metrics.donatedCount || 0}
                                subtitle="Helping others"
                                icon={BarChart3}
                                color="secondary"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Link to="/upload" className="card group hover:scale-105 transition-transform">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-xl group-hover:shadow-glow transition-all">
                                        <Upload className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Upload Food</h3>
                                        <p className="text-gray-600 text-sm">Analyze leftover food</p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/history" className="card group hover:scale-105 transition-transform">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-accent-500 to-accent-700 p-4 rounded-xl group-hover:shadow-glow transition-all">
                                        <History className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">View History</h3>
                                        <p className="text-gray-600 text-sm">Past uploads</p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/analytics" className="card group hover:scale-105 transition-transform">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl group-hover:shadow-glow transition-all">
                                        <BarChart3 className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Analytics</h3>
                                        <p className="text-gray-600 text-sm">View insights</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Recent Uploads */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
                                <Link to="/history" className="text-primary-600 hover:text-primary-700 font-medium">
                                    View All →
                                </Link>
                            </div>

                            {recentUploads.length === 0 ? (
                                <div className="text-center py-12">
                                    <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No uploads yet</p>
                                    <Link to="/upload" className="btn btn-primary">
                                        Upload Your First Food Item
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {recentUploads.map((food) => (
                                        <FoodCard key={food._id} food={food} onClick={() => { }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
