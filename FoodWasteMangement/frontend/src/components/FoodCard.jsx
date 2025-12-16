import { Calendar, Leaf, AlertCircle, CheckCircle } from 'lucide-react';

const FoodCard = ({ food, onClick }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'safe':
                return 'badge-success';
            case 'questionable':
                return 'badge-warning';
            case 'spoiled':
                return 'badge-danger';
            default:
                return 'badge-info';
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'reused':
            case 'donated':
            case 'stored':
                return 'badge-success';
            case 'discarded':
                return 'badge-danger';
            default:
                return 'badge-info';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div
            onClick={onClick}
            className="card cursor-pointer hover:scale-102 transition-transform"
        >
            {/* Image */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
                <img
                    src={`http://localhost:5000${food.imageUrl}`}
                    alt={food.foodType || 'Food'}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                    <span className={`badge ${getStatusColor(food.analysis.edibilityStatus)}`}>
                        {food.analysis.edibilityStatus}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
                {/* Food Type */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-primary-600" />
                        {food.foodType || 'Unknown Food'}
                    </h3>
                    {food.quantity && (
                        <span className="text-sm text-gray-600">{food.quantity}g</span>
                    )}
                </div>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(food.createdAt)}
                </div>

                {/* AI Summary */}
                {food.analysis.aiResponse && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {food.analysis.aiResponse}
                    </p>
                )}

                {/* Action Status */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`badge ${getActionColor(food.userAction)}`}>
                        {food.userAction}
                    </span>
                </div>

                {/* Confidence */}
                {food.analysis.confidence && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">AI Confidence:</span>
                        <span className="font-medium text-gray-900">
                            {food.analysis.confidence}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodCard;
