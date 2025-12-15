import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react';
import { login } from '../lib/auth';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 group">
                        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-3 rounded-xl group-hover:shadow-glow transition-all">
                            <Leaf className="w-8 h-8 text-white" />
                        </div>
                        <span className="font-display text-2xl font-bold gradient-text">
                            FoodSaver
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold mt-6 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to continue reducing food waste</p>
                </div>

                {/* Login Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                                <p className="text-secondary-800 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input pl-10"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full justify-center"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 card-glass text-sm">
                    <p className="font-medium text-gray-700 mb-2">Demo Credentials:</p>
                    <p className="text-gray-600">
                        <strong>Admin:</strong> admin@foodwaste.com / Admin@123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
