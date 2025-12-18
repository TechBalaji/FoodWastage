import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Upload, BarChart3, FileText, Menu, X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../../lib/auth';

const AdminLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'User Management' },
        { path: '/admin/flagged', icon: AlertTriangle, label: 'Flagged Content' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} z-50`}>
                <div className="p-4 flex items-center justify-between border-b border-gray-800">
                    {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg">
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-primary-600 text-white'
                                : 'hover:bg-gray-800 text-gray-300'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <header className="bg-white shadow-sm p-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                    <button onClick={logout} className="btn btn-secondary text-sm">
                        Logout
                    </button>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
