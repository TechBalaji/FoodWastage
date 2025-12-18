import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Shield, X, Check, AlertTriangle, User, Calendar } from 'lucide-react';

const AdminFlagged = () => {
    const [activeTab, setActiveTab] = useState('unresolved');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sidebar State (User Details)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchFlaggedContent();
    }, [activeTab]);

    const fetchFlaggedContent = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/admin/flagged?status=${activeTab}`);
            setItems(res.data.data);
        } catch (error) {
            console.error('Failed to fetch flagged content', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (itemId, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this flag?`)) return;
        try {
            await api.put(`/api/admin/flagged/${itemId}/resolve`, { action });
            fetchFlaggedContent(); // Refresh list
        } catch (error) {
            console.error('Failed to resolve flag', error);
        }
    };

    const openIdxSidebar = async (userId) => {
        try {
            const res = await api.get(`/api/admin/users/${userId}`);
            setSelectedUser(res.data.data);
            setSidebarOpen(true);
        } catch (error) {
            console.error('Failed to fetch user details', error);
        }
    };

    return (
        <div className="relative min-h-screen">
            <div className="mb-6 flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('unresolved')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'unresolved' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Unresolved Flags
                </button>
                <button
                    onClick={() => setActiveTab('resolved')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'resolved' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Resolved History
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
            ) : items.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                    <Shield className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No {activeTab} flagged content found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="card overflow-hidden border border-red-100 shadow-sm relative group">
                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={item.imageUrl}
                                    alt="Flagged content"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold flex items-center">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Flagged
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 mb-1">Reason:</h3>
                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                        {item.moderation?.flagReason || "AI detected inappropriate content"}
                                    </p>
                                </div>

                                <div className="text-xs text-gray-500 mb-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(item.uploadDate).toLocaleDateString()}
                                    </div>
                                    <button
                                        onClick={() => openIdxSidebar(item.userId._id)}
                                        className="flex items-center hover:text-primary-600 transition-colors"
                                    >
                                        <User className="w-3 h-3 mr-1" />
                                        {item.userId?.name || 'Unknown User'}
                                    </button>
                                </div>

                                {activeTab === 'unresolved' && (
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={() => handleResolve(item._id, 'dismiss')}
                                            className="flex-1 btn bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2"
                                        >
                                            Dismiss (Safe)
                                        </button>
                                        <button
                                            onClick={() => handleResolve(item._id, 'confirm')} // 'Confirm' means action taken, but here just resolves it
                                            className="flex-1 btn bg-red-600 hover:bg-red-700 text-white text-sm py-2"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reused User Sidebar Drawer */}
            {sidebarOpen && selectedUser && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto border-l border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-xl font-bold">Uploader Details</h2>
                        <button onClick={() => setSidebarOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                    </div>

                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl font-bold text-primary-700">{selectedUser.name.charAt(0)}</span>
                            </div>
                            <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                            <p className="text-sm text-gray-500">{selectedUser.email}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700 mb-2">Warnings/Stats</h4>
                            <ul className="text-sm space-y-2">
                                <li className="flex justify-between">
                                    <span>Requests Today:</span>
                                    <span className="font-bold">{selectedUser.usage?.dailyRequests || 0}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Acct Status:</span>
                                    <span className={selectedUser.status?.isSuspended ? 'text-red-600 font-bold' : 'text-green-600'}>
                                        {selectedUser.status?.isSuspended ? 'Suspended' : 'Active'}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="text-xs text-gray-400 text-center mt-8">
                            To take action on this user (Suspend/Ban), please go to the User Management page.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFlagged;
