import { Calendar, Leaf, AlertCircle, CheckCircle } from 'lucide-react';

const FoodCard = ({ food, onClick, selected, onSelect, selectionMode }) => {
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
            className={`card cursor-pointer transition-all ${selected ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:scale-102'}`}
        >
            {/* Selection Checkbox Overlay */}
            {selectionMode && (
                <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onSelect(food._id)}
                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                </div>
            )}

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

                {/* Confidence & Sustainability */}
                {(food.analysis.confidence || food.analysis.sustainabilityScore) && (
                    <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-2 mt-2">
                        {food.analysis.confidence && (
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-1">AI:</span>
                                <span className="font-medium text-gray-900">{food.analysis.confidence}%</span>
                            </div>
                        )}

                        {food.analysis.sustainabilityScore && (
                            <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full" title="Sustainability Score">
                                <span className="mr-1">🌱</span>
                                <span className="font-medium">{food.analysis.sustainabilityScore}/10</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodCard;
