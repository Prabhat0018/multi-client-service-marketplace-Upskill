import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { 
  Search, Filter, X, Star, Clock, MapPin, ChevronDown,
  Wrench, Sparkles, Zap, Paintbrush, Scissors, Package, Car, Laptop, Grid, List
} from 'lucide-react';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [viewMode, setViewMode] = useState('grid');

  const categoryIcons = [
    <Wrench className="w-5 h-5" />,
    <Sparkles className="w-5 h-5" />,
    <Zap className="w-5 h-5" />,
    <Paintbrush className="w-5 h-5" />,
    <Scissors className="w-5 h-5" />,
    <Package className="w-5 h-5" />,
    <Car className="w-5 h-5" />,
    <Laptop className="w-5 h-5" />
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicAPI.getCategories();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = {};
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        
        if (search) params.search = search;
        if (category) params.category_id = category;

        const response = await publicAPI.getServices(params);
        setServices(response.data.services || []);
      } catch (err) {
        console.error('Failed to fetch services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (categoryId) params.set('category', categoryId);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchParams({});
  };

  const getSelectedCategoryName = () => {
    const cat = categories.find(c => c.category_id === selectedCategory);
    return cat ? cat.category_name : 'All Services';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {selectedCategory ? getSelectedCategoryName() : 'Browse Services'}
          </h1>
          <p className="text-gray-600">
            Find the perfect professional for your needs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="animate-fade-up-delay-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hover-glow w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="hover-glow w-full md:w-48 pl-12 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="hover-glow w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-200"
              >
                Search
              </button>
              {(searchQuery || selectedCategory) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="hover-glow w-full sm:w-auto px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category Pills */}
        <div className="animate-fade-up-delay-2 flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryFilter('')}
            className={`hover-glow shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              !selectedCategory
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'
            }`}
          >
            All
          </button>
          {categories.slice(0, 6).map((cat, index) => (
            <button
              key={cat.category_id}
              onClick={() => handleCategoryFilter(cat.category_id)}
              className={`hover-glow shrink-0 px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
                selectedCategory === cat.category_id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'
              }`}
            >
              {categoryIcons[index % categoryIcons.length]}
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${services.length} service(s) found`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
            >
              View All Services
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link 
                to={`/services/${service.service_id}`} 
                key={service.service_id}
                className="group animate-fade-up"
              >
                <div className={`interactive-card bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-purple-200 hover:shadow-lg transition-all h-full ${
                  index % 4 === 0 ? 'border-t-4 border-t-purple-400' :
                  index % 4 === 1 ? 'border-t-4 border-t-teal-400' :
                  index % 4 === 2 ? 'border-t-4 border-t-yellow-400' :
                  'border-t-4 border-t-pink-400'
                }`}>
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full mb-4">
                      {service.category_name || 'Service'}
                    </span>

                    {/* Service Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition line-clamp-1">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>4.8</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-2xl font-bold text-purple-600">₹{service.price}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {categoryIcons[index % categoryIcons.length]}
                        </div>
                        <span className="text-sm text-gray-600">{service.merchant_name || 'Professional'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {services.map((service, index) => (
              <Link 
                to={`/services/${service.service_id}`} 
                key={service.service_id}
                className="group block animate-fade-up"
              >
                <div className="interactive-card bg-white rounded-xl border border-gray-100 p-5 sm:p-6 hover:border-purple-200 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    index % 4 === 0 ? 'bg-purple-100 text-purple-600' :
                    index % 4 === 1 ? 'bg-teal-100 text-teal-600' :
                    index % 4 === 2 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    {categoryIcons[index % categoryIcons.length]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md mb-2">
                          {service.category_name || 'Service'}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition">
                          {service.title}
                        </h3>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-purple-600 flex-shrink-0">₹{service.price}</span>
                    </div>

                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>4.8</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.merchant_name || 'Professional'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
