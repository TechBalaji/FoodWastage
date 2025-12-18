import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
        primary: 'from-primary-500 to-primary-700',
        secondary: 'from-secondary-500 to-secondary-700',
        accent: 'from-accent-500 to-accent-700',
        success: 'from-green-500 to-green-700',
        warning: 'from-yellow-500 to-yellow-700',
    };

    return (
        <div className="card group hover:scale-105">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}

                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                                <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            <span className="font-medium">{trendValue}</span>
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg group-hover:shadow-glow transition-all`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
