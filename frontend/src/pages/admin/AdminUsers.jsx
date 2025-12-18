import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Search, MoreVertical, X, Shield, Clock, Activity, Ban } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Action States
    const [limitInput, setLimitInput] = useState(10);
    const [suspendDays, setSuspendDays] = useState('');
    const [suspendReason, setSuspendReason] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const res = await api.get(`/admin/users/${userId}`);
            setSelectedUser(res.data.data);
            setLimitInput(res.data.data.usage?.maxDailyRequests || 10);
            setSidebarOpen(true);
        } catch (error) {
            console.error('Failed to fetch user details', error);
        }
    };

    const handleUpdateLimit = async () => {
        try {
            await api.put(`/admin/users/${selectedUser._id}/limit`, { maxDailyRequests: limitInput });
            fetchUserDetails(selectedUser._id); // Refresh details
            fetchUsers(); // Refresh list
            alert('Limit updated!');
        } catch (error) {
            console.error('Failed to update limit', error);
        }
    };

    const handleSuspend = async () => {
        try {
            await api.put(`/admin/users/${selectedUser._id}/suspend`, { days: suspendDays, reason: suspendReason });
            fetchUserDetails(selectedUser._id); // Refresh details
            fetchUsers(); // Refresh list
            setSuspendDays('');
            setSuspendReason('');
            alert('User suspension status updated!');
        } catch (error) {
            console.error('Failed to suspend user', error);
        }
    };

    return (
        <div className="relative min-h-screen">
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 input bg-gray-50 max-w-xs"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-sm">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Requests Today</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                                    <td className="py-3 px-4 font-medium">{user.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {user.usage?.dailyRequests || 0} / {user.usage?.maxDailyRequests || 10}
                                    </td>
                                    <td className="py-3 px-4">
                                        {user.status?.isSuspended ? (
                                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Suspended</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Active</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => fetchUserDetails(user._id)}
                                            className="text-primary-600 hover:text-primary-800"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Sidebar Drawer */}
            {sidebarOpen && selectedUser && (
                <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto border-l border-gray-200">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Usage Stats Block */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                                <Activity className="w-4 h-4 mr-2" /> Current Activity
                            </h3>
                            <div className="space-y-2 text-sm text-blue-800">
                                <div className="flex justify-between">
                                    <span>Requests Today:</span>
                                    <span className="font-bold">{selectedUser.usage?.dailyRequests || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Daily Limit:</span>
                                    <span className="font-bold">{selectedUser.usage?.maxDailyRequests || 10}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Limit Resets:</span>
                                    <span>Midnight</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-blue-200 text-xs">
                                    Last Active: {selectedUser.usage?.lastRequestDate ? new Date(selectedUser.usage.lastRequestDate).toLocaleString() : 'Never'}
                                </div>
                            </div>
                        </div>

                        {/* Actions Block */}
                        <div className="space-y-6">
                            {/* Update Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Update Daily Request Limit</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={limitInput}
                                        onChange={(e) => setLimitInput(parseInt(e.target.value))}
                                        className="input flex-1"
                                    />
                                    <button onClick={handleUpdateLimit} className="btn btn-primary whitespace-nowrap">
                                        Update
                                    </button>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Suspend Account */}
                            <div>
                                <label className="block text-sm font-medium text-red-700 mb-1 flex items-center">
                                    <Ban className="w-4 h-4 mr-1" /> Suspend Account
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        placeholder="Days (e.g. 7)"
                                        value={suspendDays}
                                        onChange={(e) => setSuspendDays(e.target.value)}
                                        className="input w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Reason for suspension..."
                                        value={suspendReason}
                                        onChange={(e) => setSuspendReason(e.target.value)}
                                        className="input w-full"
                                    />
                                    <button
                                        onClick={handleSuspend}
                                        className="btn bg-red-600 text-white w-full hover:bg-red-700"
                                    >
                                        Apply Suspension
                                    </button>
                                </div>
                            </div>

                            {/* Unsuspend Option if suspended */}
                            {selectedUser.status?.isSuspended && (
                                <div className="bg-red-50 p-3 rounded text-sm text-red-800">
                                    <p className="font-bold">Currently Suspended until {new Date(selectedUser.status.suspensionEndDate).toLocaleDateString()}</p>
                                    <p className="mb-2">Reason: {selectedUser.status.notes}</p>
                                    <button
                                        onClick={() => {
                                            setSuspendDays('0'); // 0 days logic to unsupend
                                            setSuspendReason('Admin lifted suspension');
                                            handleSuspend();
                                        }}
                                        className="text-red-700 underline text-xs"
                                    >
                                        Lift Suspension Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
