import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { 
  Wrench, Sparkles, Zap, Paintbrush, Scissors, Package, 
  Car, Laptop, Home, Settings, Smartphone, Leaf, ArrowRight
} from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons = [
    <Wrench className="w-8 h-8" />,
    <Sparkles className="w-8 h-8" />,
    <Zap className="w-8 h-8" />,
    <Paintbrush className="w-8 h-8" />,
    <Scissors className="w-8 h-8" />,
    <Package className="w-8 h-8" />,
    <Car className="w-8 h-8" />,
    <Laptop className="w-8 h-8" />,
    <Home className="w-8 h-8" />,
    <Settings className="w-8 h-8" />,
    <Smartphone className="w-8 h-8" />,
    <Leaf className="w-8 h-8" />
  ];

  const colorClasses = [
    'bg-purple-100 text-purple-600',
    'bg-teal-100 text-teal-600',
    'bg-yellow-100 text-yellow-600',
    'bg-pink-100 text-pink-600',
    'bg-blue-100 text-blue-600',
    'bg-orange-100 text-orange-600',
    'bg-green-100 text-green-600',
    'bg-indigo-100 text-indigo-600'
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicAPI.getCategories();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Service Categories</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Explore our wide range of professional services. Find exactly what you need from our trusted providers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories available</h3>
            <p className="text-gray-600">Categories will be added soon</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                to={`/services?category=${category.category_id}`} 
                key={category.category_id}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all h-full">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${colorClasses[index % colorClasses.length]}`}>
                    {categoryIcons[index % categoryIcons.length]}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                    {category.category_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description || 'Professional services for your needs'}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-purple-600 font-medium text-sm group-hover:gap-2 transition-all">
                    <span>View Services</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Let us know what service you need, and we'll help you find the right professional.
          </p>
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-200"
          >
            Browse All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
