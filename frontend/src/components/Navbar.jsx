import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User, LayoutDashboard, Upload, History, BarChart3, Lightbulb, Shield } from 'lucide-react';
import { getCurrentUser, logout, isAdmin } from '../lib/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-soft sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg group-hover:shadow-glow transition-all">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-display text-xl font-bold gradient-text">
                            FoodSaver
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-1">
                            <NavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/upload" icon={<Upload className="w-4 h-4" />}>
                                Upload
                            </NavLink>
                            <NavLink to="/history" icon={<History className="w-4 h-4" />}>
                                History
                            </NavLink>
                            <NavLink to="/analytics" icon={<BarChart3 className="w-4 h-4" />}>
                                Analytics
                            </NavLink>
                            <NavLink to="/tips" icon={<Lightbulb className="w-4 h-4" />}>
                                Tips
                            </NavLink>
                            {isAdmin() && (
                                <NavLink to="/admin" icon={<Shield className="w-4 h-4" />}>
                                    Admin
                                </NavLink>
                            )}
                        </div>
                    )}

                    {/* User Menu */}
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-gray-500 text-xs">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary flex items-center space-x-2 text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link to="/login" className="btn btn-secondary text-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary text-sm">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, children }) => {
    return (
        <Link
            to={to}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
        >
            {icon}
            <span className="font-medium">{children}</span>
        </Link>
    );
};

export default Navbar;
