import { Link } from 'react-router-dom';
import { Leaf, Upload, BarChart3, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
            <Navbar />

            {/* Hero Section */}
            <section className="container-custom py-20">
                <div className="text-center max-w-4xl mx-auto animate-fade-in">
                    <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                        <span className="text-primary-700 font-medium">Smart Food Waste Management</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
                        Transform Your{' '}
                        <span className="gradient-text">Leftover Food</span>
                        {' '}Into Opportunities
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Use AI-powered analysis to reduce food waste, discover creative reuse ideas,
                        and contribute to a sustainable future. Join thousands making a difference.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link to="/register" className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2">
                            <span>Get Started Free</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container-custom py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-bold mb-4">
                        Powerful Features for{' '}
                        <span className="gradient-text">Waste Reduction</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to manage leftover food intelligently
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<Upload className="w-8 h-8" />}
                        title="AI Image Analysis"
                        description="Upload food images and get instant AI-powered analysis on edibility and freshness"
                        color="primary"
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-8 h-8" />}
                        title="Smart Suggestions"
                        description="Receive creative reuse ideas, recipes, and storage tips tailored to your food"
                        color="accent"
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-8 h-8" />}
                        title="Personal Analytics"
                        description="Track your waste reduction progress and environmental impact over time"
                        color="success"
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8" />}
                        title="Admin Dashboard"
                        description="Monitor users, analyze trends, and generate sustainability reports"
                        color="secondary"
                    />
                </div>
            </section>

            {/* Impact Section */}
            <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-20">
                <div className="container-custom">
                    <div className="text-center text-white mb-12">
                        <h2 className="text-4xl font-display font-bold mb-4">
                            Making Real Impact
                        </h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Join our community in the fight against food waste
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                        <div className="card-glass">
                            <p className="text-5xl font-bold mb-2">10K+</p>
                            <p className="text-lg opacity-90">Food Items Analyzed</p>
                        </div>
                        <div className="card-glass">
                            <p className="text-5xl font-bold mb-2">5 Tons</p>
                            <p className="text-lg opacity-90">Waste Prevented</p>
                        </div>
                        <div className="card-glass">
                            <p className="text-5xl font-bold mb-2">2K+</p>
                            <p className="text-lg opacity-90">Active Users</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="container-custom py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-display font-bold mb-6">
                            Why Choose{' '}
                            <span className="gradient-text">FoodSaver</span>?
                        </h2>
                        <div className="space-y-4">
                            <BenefitItem text="AI-powered food analysis with 95% accuracy" />
                            <BenefitItem text="Personalized waste reduction recommendations" />
                            <BenefitItem text="Track your environmental impact in real-time" />
                            <BenefitItem text="Contribute to sustainability goals" />
                            <BenefitItem text="Free to use, no hidden costs" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl p-8 shadow-soft">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                            <p className="text-gray-600 mb-6">
                                Join our community and start making a difference today. It's completely free!
                            </p>
                            <Link to="/register" className="btn btn-primary w-full justify-center flex items-center space-x-2">
                                <span>Create Free Account</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container-custom text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Leaf className="w-6 h-6 text-primary-400" />
                        <span className="font-display text-xl font-bold">FoodSaver</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Smart Leftover Food Management & Waste Reduction Platform
                    </p>
                    <p className="text-gray-500 text-sm">
                        © 2025 FoodSaver. Making India sustainable, one meal at a time.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, color }) => {
    const colorClasses = {
        primary: 'from-primary-500 to-primary-700',
        secondary: 'from-secondary-500 to-secondary-700',
        accent: 'from-accent-500 to-accent-700',
        success: 'from-green-500 to-green-700',
    };

    return (
        <div className="card text-center group">
            <div className={`bg-gradient-to-br ${colorClasses[color]} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all`}>
                <div className="text-white">{icon}</div>
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};

const BenefitItem = ({ text }) => (
    <div className="flex items-start space-x-3">
        <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
        <span className="text-gray-700 text-lg">{text}</span>
    </div>
);

export default LandingPage;
