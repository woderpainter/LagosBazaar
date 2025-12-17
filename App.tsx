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
            
            {/* Featured Products */}
            <div id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-text">
                        {activeCategory === 'All Categories' ? 'Recommended for You' : `${activeCategory}`}
                    </h2>
                    {activeCategory !== 'All Categories' && (
                        <button 
                            onClick={() => setActiveCategory('All Categories')}
                            className="text-sm text-primary font-medium hover:underline"
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
                        <div className="col-span-full text-center py-12 text-text-subdued">
                            No products found in this category.
                        </div>
                    )}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-surface py-12 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center p-4 hover:shadow-lg transition-shadow rounded-lg">
                            <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-text">Nationwide Delivery</h3>
                            <p className="mt-2 text-sm text-text-subdued">Fast delivery to all 36 states.</p>
                        </div>
                        <div className="flex flex-col items-center p-4 hover:shadow-lg transition-shadow rounded-lg">
                            <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-text">Secure Payments</h3>
                            <p className="mt-2 text-sm text-text-subdued">100% secure checkout with Paystack & Flutterwave.</p>
                        </div>
                        <div className="flex flex-col items-center p-4 hover:shadow-lg transition-shadow rounded-lg">
                            <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-text">24/7 Support</h3>
                            <p className="mt-2 text-sm text-text-subdued">Our customer care is always active.</p>
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
                className="flex items-center text-text-subdued hover:text-primary mb-8"
            >
                <ArrowLeft className="h-5 w-5 mr-2" /> Back to Store
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-w-1 aspect-h-1 bg-surface border border-border rounded-lg overflow-hidden p-4">
                        <img 
                            src={selectedProduct.image} 
                            alt={selectedProduct.name} 
                            className="w-full h-full object-contain object-center"
                        />
                    </div>
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-3xl font-bold text-text">{selectedProduct.name}</h1>
                    <div className="mt-4 flex items-center">
                        <div className="flex items-center text-yellow-400">
                             {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xl">{i < Math.floor(selectedProduct.rating) ? '★' : '☆'}</span>
                             ))}
                        </div>
                        <p className="ml-3 text-sm text-text-subdued">{selectedProduct.reviews} verified reviews</p>
                    </div>
                    
                    <p className="mt-6 text-3xl font-bold text-text">₦{selectedProduct.price.toLocaleString()}</p>
                    
                    <div className="mt-8 space-y-4">
                        <p className="text-text">{selectedProduct.shortDescription}</p>
                        
                        {/* AI Section */}
                        <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-text flex items-center">
                                    <Sparkles className="h-5 w-5 text-accent mr-2" /> 
                                    AI Insight
                                </h3>
                                {!aiContent && (
                                    <button 
                                        onClick={handleAIRequest}
                                        disabled={aiLoading}
                                        className="text-sm bg-surface border border-border px-3 py-1.5 rounded-md hover:bg-gray-50 font-medium text-primary disabled:opacity-50"
                                    >
                                        {aiLoading ? 'Thinking...' : 'Generate Description'}
                                    </button>
                                )}
                            </div>
                            
                            {aiLoading && <div className="text-sm text-text-subdued animate-pulse">Consulting the market spirits...</div>}
                            
                            {aiContent && (
                                <div className="space-y-4 animate-fadeIn">
                                    <div>
                                        <h4 className="text-xs font-bold text-text-subdued uppercase tracking-wide">Sales Pitch</h4>
                                        <p className="text-sm text-text italic mt-1">"{aiContent.salesPitch}"</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-text-subdued uppercase tracking-wide">Key Features</h4>
                                        <ul className="mt-1 list-disc list-inside text-sm text-text">
                                            {aiContent.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                                        </ul>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {aiContent.seoTags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-surface rounded text-xs text-text-subdued border border-border">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {!aiContent && !aiLoading && (
                                <p className="text-sm text-text-subdued">Want to know what makes this special? Ask our AI!</p>
                            )}
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => addToCart(selectedProduct)}
                                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-surface bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
                className="flex items-center text-text-subdued hover:text-primary mb-8"
            >
                <ArrowLeft className="h-5 w-5 mr-2" /> Cancel Checkout
            </button>
            
            <div className="bg-surface shadow rounded-lg overflow-hidden border border-border">
                <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-text">Checkout</h2>
                </div>
                <div className="p-6 space-y-6">
                    {/* Simulated Form */}
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                         <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-text">First name</label>
                            <input type="text" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-background" />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-text">Last name</label>
                            <input type="text" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-background" />
                        </div>
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-text">Address</label>
                            <input type="text" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-background" />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-text">City</label>
                            <input type="text" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-background" />
                        </div>
                         <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-text">State</label>
                            <select className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-background">
                                <option>Lagos</option>
                                <option>Abuja</option>
                                <option>Rivers</option>
                                <option>Oyo</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6">
                        <div className="flex justify-between text-lg font-medium text-text mb-6">
                            <p>Total due</p>
                            <p>₦{total.toLocaleString()}</p>
                        </div>

                        <h3 className="text-lg font-medium text-text mb-4">Select Payment Method</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex items-center justify-center px-4 py-3 border border-border rounded-md shadow-sm bg-surface hover:bg-background hover:border-blue-500">
                                <span className="text-blue-600 font-bold">Paystack</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-border rounded-md shadow-sm bg-surface hover:bg-background hover:border-yellow-500">
                                <span className="text-yellow-600 font-bold">Flutterwave</span>
                            </button>
                            <button className="flex items-center justify-center px-4 py-3 border border-border rounded-md shadow-sm bg-surface hover:bg-background">
                                <span className="text-text font-medium">Bank Transfer</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-background border-t border-border flex items-center justify-between">
                     <p className="text-sm text-text-subdued flex items-center">
                        <Shield className="h-4 w-4 mr-1" /> Secure Encrypted Payment
                     </p>
                     <button className="bg-primary text-surface px-6 py-2 rounded-md font-medium hover:bg-primary-dark">
                        Pay Now
                     </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text">
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