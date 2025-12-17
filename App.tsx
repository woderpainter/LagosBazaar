import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, ViewState, AIResponse } from './types';
import { generateProductContent } from './services/geminiService';
import { ArrowLeft, CheckCircle, Truck, Shield, Clock, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState<AIResponse | null>(null);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  // Navigation Logic
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setAiContent(null); // Reset previous AI content
    setView('PRODUCT_DETAILS');
    window.scrollTo(0, 0);
  };

  const handleAIRequest = async () => {
    if (!selectedProduct) return;
    setAiLoading(true);
    const content = await generateProductContent(selectedProduct.name, selectedProduct.category);
    setAiContent(content);
    setAiLoading(false);
  };

  // Views
  const renderHome = () => {
    const filteredProducts = activeCategory === 'All Categories' 
        ? MOCK_PRODUCTS 
        : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

    return (
        <>
            <Hero />
            
            {/* Note: Categories are now in the Navbar, so we removed the category pills section here for a cleaner look */}

            {/* Featured Products */}
            <div id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {activeCategory === 'All Categories' ? 'Recommended for You' : `${activeCategory}`}
                    </h2>
                    {activeCategory !== 'All Categories' && (
                        <button 
                            onClick={() => setActiveCategory('All Categories')}
                            className="text-sm text-naija-green font-medium hover:underline"
                        >
                            View All Products
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={addToCart}
                            onClick={handleProductClick}
                        />
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products found in this category.
                        </div>
                    )}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center p-4 hover:shadow-lg transition-shadow rounded-lg">
                            <div className="p-3 bg-green-100 rounded-full text-naija-green mb-4">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Nationwide Delivery</h3>
                            <p className="mt-2 text-sm text-gray-500">Fast delivery to all 36 states.</p>
                        </div>
                        <div className="flex flex-col items-center p-4 hover:shadow-lg transition-shadow rounded-lg">
                            <div className="p-3 bg-green-100 rounded-full text-naija-green mb-4">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Secure Payments</h3>
                            <p className="mt-2 text-sm text-gray-500">100% secure checkout with Paystack & Flutterwave.</p>
                        </div>
                        <div className="flex flex-col items-center p-4 hover:shadow-lg transition-shadow rounded-lg">
                            <div className="p-3 bg-green-100 rounded-full text-naija-green mb-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">24/7 Support</h3>
                            <p className="mt-2 text-sm text-gray-500">Our customer care is always active.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
  };

  const renderProductDetails = () => {
    if (!selectedProduct) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button 
                onClick={() => setView('HOME')}
                className="flex items-center text-gray-600 hover:text-naija-green mb-8"
            >
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Store
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-w-1 aspect-h-1 bg-white border border-gray-200 rounded-lg overflow-hidden p-4">
                        <img 
                            src={selectedProduct.image} 
                            alt={selectedProduct.name} 
                            className="w-full h-full object-contain object-center"
                        />
                    </div>
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
                    <div className="mt-4 flex items-center">
                        <div className="flex items-center text-yellow-400">
                             {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xl">{i < Math.floor(selectedProduct.rating) ? '★' : '☆'}</span>
                             ))}
                        </div>
                        <p className="ml-3 text-sm text-gray-500">{selectedProduct.reviews} verified reviews</p>
                    </div>
                    
                    <p className="mt-6 text-3xl font-bold text-gray-900">₦{selectedProduct.price.toLocaleString()}</p>
                    
                    <div className="mt-8 space-y-4">
                        <p className="text-gray-600">{selectedProduct.shortDescription}</p>
                        
                        {/* AI Section */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900 flex items-center">
                                    <Sparkles className="h-5 w-5 text-naija-accent mr-2" /> 
                                    AI Insight
                                </h3>
                                {!aiContent && (
                                    <button 
                                        onClick={handleAIRequest}
                                        disabled={aiLoading}
                                        className="text-sm bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 font-medium text-naija-green disabled:opacity-50"
                                    >
                                        {aiLoading ? 'Thinking...' : 'Generate Description'}
                                    </button>
                                )}
                            </div>
                            
                            {aiLoading && <div className="text-sm text-gray-500 animate-pulse">Consulting the market spirits...</div>}
                            
                            {aiContent && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sales Pitch</h4>
                                        <p className="text-sm text-gray-800 italic mt-1">"{aiContent.salesPitch}"</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Key Features</h4>
                                        <ul className="mt-1 list-disc list-inside text-sm text-gray-700">
                                            {aiContent.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                                        </ul>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {aiContent.seoTags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-white rounded text-xs text-gray-500 border border-gray-200">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!aiContent && !aiLoading && (
                                <p className="text-sm text-gray-500">Want to know what makes this special? Ask our AI!</p>
                            )}
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => addToCart(selectedProduct)}
                                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-naija-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderCheckout = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button 
                onClick={() => setView('HOME')}
                className="flex items-center text-gray-600 hover:text-naija-green mb-8"
            >
                <ArrowLeft className="h-5 w-5 mr-2" /> Cancel Checkout
            </button>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Simulated Form */}
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                         <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">First name</label>
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Last name</label>
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                         <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white">
                                <option>Lagos</option>
                                <option>Abuja</option>
                                <option>Rivers</option>
                                <option>Oyo</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between text-lg font-medium text-gray-900 mb-6">
                            <p>Total due</p>
                            <p>₦{total.toLocaleString()}</p>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 hover:border-blue-500">
                                <span className="text-blue-600 font-bold">Paystack</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 hover:border-yellow-500">
                                <span className="text-yellow-600 font-bold">Flutterwave</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50">
                                <span className="text-gray-600 font-medium">Bank Transfer</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                     <p className="text-sm text-gray-500 flex items-center">
                        <Shield className="h-4 w-4 mr-1" /> Secure Encrypted Payment
                     </p>
                     <button className="bg-naija-green text-white px-6 py-2 rounded-md font-medium hover:bg-green-700">
                        Pay Now
                     </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={() => setView('HOME')}
      />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
            setIsCartOpen(false);
            setView('CHECKOUT');
        }}
      />

      <main>
        {view === 'HOME' && renderHome()}
        {view === 'PRODUCT_DETAILS' && renderProductDetails()}
        {view === 'CHECKOUT' && renderCheckout()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
