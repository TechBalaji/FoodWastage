import { useState, useEffect } from 'react';
import { History as HistoryIcon, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import api from '../lib/api';

const HistoryPage = () => {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchHistory();
    }, [filter]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const params = filter !== 'all' ? `?action=${filter}` : '';
            const response = await api.get(`/food/history${params}`);
            setUploads(response.data.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="container-custom py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <span className="gradient-text">Food History</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        View all your uploaded food items and their analysis
                    </p>
                </div>

                {/* Filter */}
                <div className="card mb-6">
                    <div className="flex items-center space-x-4">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input max-w-xs"
                        >
                            <option value="all">All Items</option>
                            <option value="reused">Reused</option>
                            <option value="donated">Donated</option>
                            <option value="stored">Stored</option>
                            <option value="discarded">Discarded</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* History Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="spinner w-12 h-12" />
                    </div>
                ) : uploads.length === 0 ? (
                    <div className="card text-center py-12">
                        <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No food items found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {uploads.map((food) => (
                            <FoodCard key={food._id} food={food} onClick={() => { }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
