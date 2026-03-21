import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { 
  Search, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Wrench,
  Sparkles,
  Zap,
  Paintbrush,
  Scissors,
  Package,
  Car,
  Laptop,
  Users,
  Calendar,
  MessageCircle
} from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          publicAPI.getCategories(),
          publicAPI.getServices({ limit: 8 })
        ]);
        setCategories(catRes.data.categories || []);
        setServices(servRes.data.services || []);
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Category icons mapping
  const categoryIcons = [
    <Wrench className="w-6 h-6" />,
    <Sparkles className="w-6 h-6" />,
    <Zap className="w-6 h-6" />,
    <Paintbrush className="w-6 h-6" />,
    <Scissors className="w-6 h-6" />,
    <Package className="w-6 h-6" />,
    <Car className="w-6 h-6" />,
    <Laptop className="w-6 h-6" />
  ];

  // Quick category pills
  const quickCategories = ['Furniture Assembly', 'Home Repairs', 'Help Moving', 'Cleaning', 'Electrical'];

  // Testimonials data
  const testimonials = [
    { name: 'Priya Sharma', handle: '@priyasharma', text: '"Amazing service! The professional was punctual, friendly, and did an excellent job with my home repairs."', category: 'Home Repairs' },
    { name: 'Rahul Verma', handle: '@rahulv', text: '"Found the perfect cleaning service. Will definitely book again!"', category: 'Cleaning' },
    { name: 'Anita Desai', handle: '@anitad', text: '"Quick response and professional work. Highly recommended!"', category: 'Electrical' },
    { name: 'Vikram Singh', handle: '@vikrams', text: '"The furniture assembly was done perfectly. Great attention to detail."', category: 'Assembly' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="float-orb absolute top-20 left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
        <div className="float-orb absolute bottom-20 right-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="relative z-10">
              <span className="animate-fade-up inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-6">
                ON-DEMAND SERVICE PLATFORM
              </span>
              
              <h1 className="animate-fade-up-delay-1 text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                On-demand home services are just{' '}
                <span className="text-purple-600">24 hours</span> away!
              </h1>
              
              <p className="animate-fade-up-delay-2 text-lg text-gray-600 mb-8 max-w-lg">
                Enjoy quick, reliable solutions when you need them most with our on-demand services.
              </p>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="animate-fade-up-delay-3 flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="I need help with..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="hover-glow w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  type="submit"
                  className="hover-glow px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-200"
                >
                  Get help today
                </button>
              </form>

              {/* Quick Category Pills */}
              <div className="flex flex-wrap gap-2">
                {quickCategories.map((cat, index) => (
                  <Link
                    key={index}
                    to={`/services?search=${encodeURIComponent(cat)}`}
                    className="hover-glow px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600 transition"
                  >
                    {cat}
                  </Link>
                ))}
                <Link to="/categories" className="px-4 py-2 text-sm text-purple-600 font-medium hover:underline flex items-center gap-1">
                  See More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right side - Hero Image */}
            <div className="animate-fade-up-delay-2 relative hidden lg:block">
              <div className="relative">
                {/* Main image - Professional workers collage */}
                <div className="interactive-card w-full h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-8 flex flex-col justify-between">
                  {/* Top row of worker avatars */}
                  <div className="flex justify-center gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">👨‍🔧</div>
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">👩‍⚕️</div>
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">👨‍🍳</div>
                  </div>
                  {/* Center text */}
                  <div className="text-center">
                    <p className="text-white/90 text-xl font-bold">Trusted Professionals</p>
                    <p className="text-white/70 text-sm mt-1">Verified & Background Checked</p>
                  </div>
                  {/* Bottom row */}
                  <div className="flex justify-center gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">🧹</div>
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">🔌</div>
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">🪚</div>
                  </div>
                  {/* Stats overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs font-medium">⭐ 4.9 Avg Rating</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs font-medium">✅ 10K+ Tasks Done</div>
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-2xl font-bold shadow-lg transform rotate-6">
                  ServiceHub!
                </div>
                
                {/* Decorative curve */}
                <svg className="absolute -bottom-8 -left-8 w-24 h-24 text-pink-300" viewBox="0 0 100 100" fill="none">
                  <path d="M10 90 Q 50 10 90 50" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-purple-600 py-6 animate-fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              <div>
                <span className="text-3xl font-bold">10,000+</span>
                <span className="ml-2 text-purple-100">Happy Customers</span>
              </div>
            </div>
            <div className="text-purple-200 text-sm">
              In categories: <span className="text-white font-medium">
                {categories.slice(0, 3).map(c => c.category_name).join(', ') || 'Home Services, Repairs, and More'}
              </span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                App Store
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                Google Play
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Everyday Life Made Easier Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everyday life made <span className="text-purple-600">easier</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              When life gets busy, you don't have to tackle it alone. Get time back for what you love without breaking the bank.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="interactive-card bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Professional</h3>
              <p className="text-gray-600">
                Take the hassle out of life by choosing one of our talented professionals who can do it for you!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="interactive-card bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Schedule When It Works</h3>
              <p className="text-gray-600">
                Book services as early as today. Flexible scheduling that fits your busy lifestyle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="interactive-card bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Customer Support</h3>
              <p className="text-gray-600">
                Our support team is on hand to help you out - whatever the issue, day or night.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Our <span className="text-purple-600">Featured Services</span>
              </h2>
              <p className="text-gray-600">Quality services from verified professionals</p>
            </div>
            <Link 
              to="/services" 
              className="hidden md:flex items-center gap-2 text-purple-600 font-semibold hover:underline"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services available yet</h3>
              <p className="text-gray-600">Check back soon for amazing services!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Link 
                  to={`/services/${service.service_id}`} 
                  key={service.service_id}
                  className="group"
                >
                  <div className={`bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-purple-200 hover:shadow-lg transition-all ${
                    index === 0 ? 'border-t-4 border-t-purple-400' :
                    index === 1 ? 'border-t-4 border-t-teal-400' :
                    index === 2 ? 'border-t-4 border-t-yellow-400' :
                    'border-t-4 border-t-pink-400'
                  }`}>
                    <div className="p-6">
                      {/* Service provider placeholder */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {categoryIcons[index % categoryIcons.length]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{service.merchant_name || 'Professional'}</p>
                          <p className="text-xs text-gray-500">{service.category_name || 'Service'}</p>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition line-clamp-1">
                        {service.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-2xl font-bold text-purple-600">₹{service.price}</span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:underline"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse by <span className="text-purple-600">Category</span>
            </h2>
            <p className="text-gray-600">Find the perfect service for your needs</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category, index) => (
                <Link 
                  to={`/services?category=${category.category_id}`} 
                  key={category.category_id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:border-purple-200 border-2 border-transparent transition-all">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                      index % 4 === 0 ? 'bg-purple-100 text-purple-600' :
                      index % 4 === 1 ? 'bg-teal-100 text-teal-600' :
                      index % 4 === 2 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-pink-100 text-pink-600'
                    }`}>
                      {categoryIcons[index % categoryIcons.length]}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                      {category.category_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description || 'Quality services'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-600 hover:text-white transition"
            >
              View All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our customers are living life with a{' '}
              <span className="text-purple-600">smile</span> on their faces!
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.handle}</p>
                  </div>
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm mb-3">{testimonial.text}</p>
                <span className="text-purple-600 text-sm font-medium">{testimonial.category}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/services" className="text-purple-600 font-semibold hover:underline">
              Check all reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder */}
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-purple-100 to-blue-50 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-gray-500">Professional Team Image</p>
                </div>
              </div>
              {/* Decorative curve */}
              <svg className="absolute -bottom-4 -left-4 w-16 h-16 text-teal-300" viewBox="0 0 100 100" fill="none">
                <path d="M10 90 Q 50 10 90 50" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Having a reliable team of{' '}
                <span className="text-purple-600">professionals</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Build your team of local, background-checked professionals to help with — and for — life. Whatever you need, they've got it covered.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">Compare reviews, ratings, and prices</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">Choose and connect with the best person for the job</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">Save your favorites to book again and again</span>
                </li>
              </ul>

              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 mt-8 text-purple-600 font-semibold hover:underline"
              >
                See how it works <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Get more done <span className="font-normal text-purple-200">on the go</span>
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Need something done fast? Book your professional, message them quickly and even send photos with ease - make it happen now!
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </button>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-2xl font-bold">
              Service<span className="text-purple-400">Hub</span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-8 text-gray-400">
              <Link to="/" className="hover:text-white transition">About</Link>
              <Link to="/services" className="hover:text-white transition">Services</Link>
              <Link to="/categories" className="hover:text-white transition">Categories</Link>
              <Link to="/register" className="hover:text-white transition">Become a Provider</Link>
            </nav>

            <div className="flex gap-4">
              <button onClick={() => {}} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/></svg>
              </button>
              <button onClick={() => {}} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
              </button>
              <button onClick={() => {}} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/></svg>
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 ServiceHub. All Rights Reserved</p>
            <div className="flex gap-6">
              <button onClick={() => {}} className="hover:text-white transition">Privacy Policy</button>
              <button onClick={() => {}} className="hover:text-white transition">Terms & Conditions</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
