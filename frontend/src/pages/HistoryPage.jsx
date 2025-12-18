import { useState, useEffect } from 'react';
import { History as HistoryIcon, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import FoodCard from '../components/FoodCard';
import api from '../lib/api';

const HistoryPage = () => {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(true); // Always on for convenience or toggleable

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(uploads.map(item => item._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBatchDelete = async () => {
        setDeleteModal({ show: true, isBatch: true, count: selectedIds.length });
    };



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

    const confirmDelete = (id) => {
        setDeleteModal({ show: true, id });
    };

    const handleDelete = async () => {
        if (deleteModal.isBatch) {
            try {
                await api.post('/food/batch-delete', { ids: selectedIds });
                setUploads(uploads.filter(item => !selectedIds.includes(item._id)));
                setSelectedIds([]); // Clear selection
                setDeleteModal({ show: false, id: null, isBatch: false });
            } catch (error) {
                console.error('Batch delete error:', error);
                alert('Failed to delete selected items');
                setDeleteModal({ show: false, id: null });
            }
        } else {
            // Single delete
            const id = deleteModal.id;
            if (!id) return;

            try {
                await api.delete(`/food/${id}`);
                setUploads(uploads.filter(item => item._id !== id));
                setDeleteModal({ show: false, id: null });
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete item');
                setDeleteModal({ show: false, id: null });
            }
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

                {/* Filter & Bulk Actions */}
                <div className="card mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

                    {/* Bulk Actions Toolbar */}
                    <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={uploads.length > 0 && selectedIds.length === uploads.length}
                                onChange={handleSelectAll}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                id="selectAll"
                            />
                            <label htmlFor="selectAll" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                Select All
                            </label>
                        </div>

                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleBatchDelete}
                                className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors text-sm font-bold animate-fade-in"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                <span>Delete ({selectedIds.length})</span>
                            </button>
                        )}
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
                            <div key={food._id} className="relative group">
                                <FoodCard
                                    food={food}
                                    onClick={() => handleSelectOne(food._id)} // Clicking card toggles selection now for better UX
                                    selectionMode={true}
                                    selected={selectedIds.includes(food._id)}
                                    onSelect={handleSelectOne}
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        confirmDelete(food._id);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                                    title="Delete Item"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-up border border-gray-100">
                            <div className="text-center mb-6">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {deleteModal.isBatch ? `Delete ${deleteModal.count} Items?` : 'Delete Item?'}
                                </h3>
                                <p className="text-gray-500">
                                    {deleteModal.isBatch
                                        ? `Are you sure you want to delete these ${deleteModal.count} items? This action cannot be undone.`
                                        : 'Are you sure you want to delete this food item from your history? This action cannot be undone.'
                                    }
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setDeleteModal({ show: false, id: null })}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium border border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 transition-colors font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
