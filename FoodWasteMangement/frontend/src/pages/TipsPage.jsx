import { Lightbulb, Leaf, Refrigerator, Users, Recycle } from 'lucide-react';
import Navbar from '../components/Navbar';

const TipsPage = () => {
    const tips = [
        {
            category: 'Storage',
            icon: Refrigerator,
            color: 'from-blue-500 to-blue-700',
            items: [
                'Store fruits and vegetables separately to prevent premature ripening',
                'Keep herbs fresh by storing them in water like flowers',
                'Use airtight containers to extend shelf life of leftovers',
                'Label containers with dates to track freshness',
                'Store bread in a cool, dry place, not the refrigerator',
            ],
        },
        {
            category: 'Reuse Ideas',
            icon: Recycle,
            color: 'from-green-500 to-green-700',
            items: [
                'Turn stale bread into croutons or breadcrumbs',
                'Use vegetable scraps to make homemade stock',
                'Blend overripe fruits into smoothies or freeze for later',
                'Repurpose leftover rice into fried rice or rice pudding',
                'Transform wilted vegetables into soups or stews',
            ],
        },
        {
            category: 'Donation',
            icon: Users,
            color: 'from-purple-500 to-purple-700',
            items: [
                'Contact local food banks for donation opportunities',
                'Share excess produce with neighbors or community groups',
                'Use apps to connect with people who need food',
                'Donate to homeless shelters and community kitchens',
                'Organize food sharing events in your community',
            ],
        },
        {
            category: 'Sustainability',
            icon: Leaf,
            color: 'from-primary-500 to-primary-700',
            items: [
                'Plan meals ahead to reduce overbuying',
                'Compost food scraps to create nutrient-rich soil',
                'Buy only what you need and check expiration dates',
                'Practice FIFO (First In, First Out) in your pantry',
                'Freeze foods before they spoil for future use',
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="container-custom py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-display font-bold mb-2">
                        <span className="gradient-text">Food Waste Tips</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Learn how to reduce food waste and make a positive impact
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {tips.map((section, index) => (
                        <div key={index} className="card">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className={`bg-gradient-to-br ${section.color} p-3 rounded-xl`}>
                                    <section.icon className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{section.category}</h2>
                            </div>
                            <ul className="space-y-3">
                                {section.items.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-start space-x-3">
                                        <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Impact Section */}
                <div className="mt-8 card bg-gradient-to-r from-primary-50 to-accent-50">
                    <h2 className="text-2xl font-bold mb-4">Did You Know?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary-600 mb-2">1.3B</p>
                            <p className="text-gray-700">Tons of food wasted globally each year</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary-600 mb-2">30%</p>
                            <p className="text-gray-700">Of all food produced is wasted</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary-600 mb-2">8%</p>
                            <p className="text-gray-700">Of global greenhouse gases from food waste</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TipsPage;
