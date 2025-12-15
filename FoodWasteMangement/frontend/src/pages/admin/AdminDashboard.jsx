import { useState, useEffect } from 'react';
import { Users, Upload, TrendingUp, Leaf } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import api from '../../lib/api';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics?period=monthly');
            setAnalytics(response.data.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="spinner w-12 h-12" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">System Overview</h1>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Users"
                    value={analytics?.metrics.totalUsers || 0}
                    subtitle={`${analytics?.metrics.activeUsers || 0} active`}
                    icon={Users}
                    color="primary"
                />
                <StatsCard
                    title="Total Uploads"
                    value={analytics?.metrics.totalUploads || 0}
                    subtitle="This month"
                    icon={Upload}
                    color="accent"
                />
                <StatsCard
                    title="Waste Prevented"
                    value={`${((analytics?.metrics.wastePreventedGrams || 0) / 1000).toFixed(1)}kg`}
                    subtitle="Total saved"
                    icon={Leaf}
                    color="success"
                />
                <StatsCard
                    title="Reuse Rate"
                    value={`${Math.round((analytics?.metrics.reusedCount || 0) / (analytics?.metrics.totalUploads || 1) * 100)}%`}
                    subtitle="Items reused"
                    icon={TrendingUp}
                    color="secondary"
                />
            </div>

            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Top Contributors</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4">Name</th>
                                <th className="text-left py-3 px-4">Email</th>
                                <th className="text-left py-3 px-4">Uploads</th>
                                <th className="text-left py-3 px-4">Waste Prevented</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.topContributors?.map((user) => (
                                <tr key={user._id} className="border-b border-gray-100">
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">{user.stats.totalUploads}</td>
                                    <td className="py-3 px-4">{((user.stats.totalWastePrevented || 0) / 1000).toFixed(1)}kg</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
