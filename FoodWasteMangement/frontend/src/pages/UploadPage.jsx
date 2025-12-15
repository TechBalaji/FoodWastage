import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../lib/api';

const UploadPage = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({
        quantity: '',
        notes: '',
        foodType: '',
    });

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        const formDataToSend = new FormData();
        formDataToSend.append('image', selectedFile);
        if (formData.quantity) formDataToSend.append('quantity', formData.quantity);
        if (formData.notes) formDataToSend.append('notes', formData.notes);
        if (formData.foodType) formDataToSend.append('foodType', formData.foodType);

        try {
            const response = await api.post('/food/upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(response.data.data);
            setUploading(false);
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message || 'Failed to upload food image');
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <div className="container-custom py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-4xl font-display font-bold mb-2">
                            <span className="gradient-text">Upload Food</span> for Analysis
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Take a photo or upload an image of your leftover food for AI-powered analysis
                        </p>
                    </div>

                    {!result ? (
                        <div className="card animate-slide-up">
                            <form onSubmit={handleSubmit}>
                                {/* File Upload Area */}
                                {!preview ? (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <div className="bg-gradient-to-br from-primary-500 to-primary-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-10 h-10 text-white" />
                                            </div>
                                            <p className="text-xl font-semibold text-gray-900 mb-2">
                                                Drop your image here, or click to browse
                                            </p>
                                            <p className="text-gray-600">
                                                Supports: JPG, PNG, GIF, WebP (Max 5MB)
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div>
                                        {/* Image Preview */}
                                        <div className="relative mb-6">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-96 object-cover rounded-xl"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearFile}
                                                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <X className="w-5 h-5 text-gray-700" />
                                            </button>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Food Type (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.foodType}
                                                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                                    className="input"
                                                    placeholder="e.g., Rice, Vegetables"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Quantity (grams)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.quantity}
                                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                    className="input"
                                                    placeholder="e.g., 500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notes (Optional)
                                            </label>
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                className="input"
                                                rows="3"
                                                placeholder="Any additional information..."
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="btn btn-primary w-full justify-center text-lg"
                                        >
                                            {uploading ? (
                                                <>
                                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                                    Analyzing with AI...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-5 h-5 mr-2" />
                                                    Analyze Food
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    ) : (
                        /* Analysis Results */
                        <div className="space-y-6 animate-slide-up">
                            {/* Success Message */}
                            <div className="card bg-gradient-to-r from-primary-50 to-green-50 border-2 border-primary-200">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-8 h-8 text-primary-600" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Analysis Complete!</h3>
                                        <p className="text-gray-600">Your food has been analyzed successfully</p>
                                    </div>
                                </div>
                            </div>

                            {/* Edibility Status */}
                            <div className="card">
                                <h3 className="text-2xl font-bold mb-4">Edibility Status</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className={`badge text-lg px-4 py-2 ${result.analysis.edibilityStatus === 'safe' ? 'badge-success' :
                                                result.analysis.edibilityStatus === 'questionable' ? 'badge-warning' :
                                                    'badge-danger'
                                            }`}>
                                            {result.analysis.edibilityStatus.toUpperCase()}
                                        </span>
                                        <p className="text-gray-600 mt-2">
                                            Confidence: {result.analysis.confidence}%
                                        </p>
                                    </div>
                                    {result.analysis.estimatedShelfLife && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Shelf Life</p>
                                            <p className="font-semibold text-gray-900">{result.analysis.estimatedShelfLife}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI Summary */}
                            {result.analysis.aiResponse && (
                                <div className="card">
                                    <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
                                    <p className="text-gray-700 leading-relaxed">{result.analysis.aiResponse}</p>
                                </div>
                            )}

                            {/* Reuse Ideas */}
                            {result.suggestions.reuseIdeas?.length > 0 && (
                                <div className="card">
                                    <h3 className="text-2xl font-bold mb-4">💡 Reuse Ideas</h3>
                                    <ul className="space-y-2">
                                        {result.suggestions.reuseIdeas.map((idea, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{idea}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recipes */}
                            {result.suggestions.recipes?.length > 0 && (
                                <div className="card">
                                    <h3 className="text-2xl font-bold mb-4">🍳 Recipe Suggestions</h3>
                                    <ul className="space-y-2">
                                        {result.suggestions.recipes.map((recipe, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{recipe}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Storage Tips */}
                            {result.suggestions.storageTips?.length > 0 && (
                                <div className="card">
                                    <h3 className="text-2xl font-bold mb-4">📦 Storage Tips</h3>
                                    <ul className="space-y-2">
                                        {result.suggestions.storageTips.map((tip, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => navigate('/history')}
                                    className="btn btn-primary flex-1"
                                >
                                    View History
                                </button>
                                <button
                                    onClick={() => {
                                        setResult(null);
                                        clearFile();
                                    }}
                                    className="btn btn-secondary flex-1"
                                >
                                    Upload Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
