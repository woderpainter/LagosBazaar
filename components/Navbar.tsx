import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  ShoppingBag, 
  HelpCircle 
} from 'lucide-react';
import { CATEGORIES } from '../constants';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onNavigateHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Categories');

  return (
    <nav className="flex flex-col font-sans sticky top-0 z-40">
      
      {/* MAIN HEADER - Theme Primary Background */}
      <div className="bg-primary py-4 px-4 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
             <button className="lg:hidden text-surface" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6" />
             </button>
             <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
                {/* Simulated Smiley Logo effect */}
                <div className="relative">
                    <ShoppingBag className="h-8 w-8 text-surface mr-1" />
                    <div className="absolute -bottom-1 -right-1 bg-accent rounded-full p-0.5">
                        <div className="text-[8px] font-bold text-text">:)</div>
                    </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-surface tracking-tight">Lagos<span className="text-accent">Bazaar</span></h1>
             </div>
          </div>

          {/* Desktop Left Links */}
          <div className="hidden lg:flex items-center space-x-6 text-surface text-sm font-medium whitespace-nowrap">
             <a href="#" className="hover:text-gray-200">Store Locator</a>
             <a href="#" className="hover:text-gray-200">Sell on LagosBazaar</a>
          </div>

          {/* Search Bar - Big & Central */}
          <div className="hidden md:flex flex-grow max-w-2xl">
             <div className="relative w-full flex">
                <input 
                    type="text" 
                    placeholder="Search for products, brands and categories..." 
                    className="w-full py-2.5 px-4 rounded-l-md text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="bg-accent text-text px-6 rounded-r-md hover:bg-yellow-400 transition-colors">
                    <Search className="h-5 w-5" />
                </button>
             </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 md:space-x-6">
             {/* Help */}
             <div className="hidden lg:flex items-center text-surface cursor-pointer hover:text-gray-200">
                <HelpCircle className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Help</span>
             </div>

             {/* Login */}
             <div className="hidden lg:flex items-center text-surface cursor-pointer hover:text-gray-200">
                <span className="text-sm font-medium">Login / Signup</span>
             </div>

             {/* Cart Button */}
             <button 
                className="flex items-center bg-accent text-text px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors shadow-sm"
                onClick={onOpenCart}
             >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="font-bold hidden md:inline">My Cart</span>
                <span className="ml-2 bg-surface text-primary text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                    {cartCount}
                </span>
             </button>
          </div>
        </div>

        {/* Mobile Search Bar (visible only on small screens) */}
        <div className="md:hidden mt-3">
             <div className="relative w-full flex shadow-sm">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full py-2 px-3 rounded-l-md text-text focus:outline-none"
                />
                <button className="bg-accent text-text px-4 rounded-r-md">
                    <Search className="h-4 w-4" />
                </button>
             </div>
        </div>
      </div>

      {/* CATEGORY BAR - Theme Primary Dark Background */}
      <div className="bg-primary-dark text-surface hidden lg:block shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
                {/* All Categories Button */}
                <div className="flex items-center bg-black/10 px-4 py-3 cursor-pointer hover:bg-black/20 transition-colors mr-4">
                    <Menu className="h-5 w-5 mr-2" />
                    <span className="font-bold text-sm">All Categories</span>
                </div>

                {/* Horizontal Category List */}
                <div className="flex space-x-6 text-xs font-medium overflow-x-auto scrollbar-hide">
                    {CATEGORIES.slice(1).map((cat) => ( // Skip "All Categories" in list
                        <a 
                            key={cat} 
                            href="#" 
                            className="whitespace-nowrap hover:text-accent py-3 transition-colors"
                            onClick={(e) => e.preventDefault()}
                        >
                            {cat}
                        </a>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
            <div className="relative bg-surface w-4/5 max-w-xs h-full overflow-y-auto shadow-xl flex flex-col">
                <div className="p-4 bg-primary flex justify-between items-center text-surface">
                    <h2 className="font-bold text-lg">Menu</h2>
                    <button onClick={() => setIsMenuOpen(false)}><X className="h-6 w-6" /></button>
                </div>
                <div className="py-2">
                    <a href="#" onClick={() => {onNavigateHome(); setIsMenuOpen(false)}} className="block px-4 py-3 border-b border-gray-100 text-text font-medium">Home</a>
                    {CATEGORIES.map((cat) => (
                        <a 
                            key={cat} 
                            href="#" 
                            className="block px-4 py-3 border-b border-border text-text-subdued hover:bg-gray-50 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {cat}
                        </a>
                    ))}
                    <div className="mt-4 px-4 space-y-3">
                         <a href="#" className="block text-sm text-text-subdued">Store Locator</a>
                         <a href="#" className="block text-sm text-text-subdued">Sell on LagosBazaar</a>
                         <a href="#" className="block text-sm text-text-subdued">Login / Signup</a>
                    </div>
                </div>
            </div>
        </div>
      )}
    </nav>
  );
};