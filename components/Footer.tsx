import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-naija-green">Lagos<span className="text-naija-accent">Bazaar</span></h3>
                    <p className="text-gray-500 text-sm">
                        Nigeria's favorite online marketplace. Bringing quality goods to your doorstep with speed and trust.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-naija-green"><Facebook className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-naija-green"><Twitter className="h-5 w-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-naija-green"><Instagram className="h-5 w-5" /></a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-naija-green">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-naija-green">Best Sellers</a></li>
                        <li><a href="#" className="hover:text-naija-green">Electronics</a></li>
                        <li><a href="#" className="hover:text-naija-green">Fashion</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-naija-green">Help Center</a></li>
                        <li><a href="#" className="hover:text-naija-green">Delivery Info</a></li>
                        <li><a href="#" className="hover:text-naija-green">Returns & Refunds</a></li>
                        <li><a href="#" className="hover:text-naija-green">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Payment Methods</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Simulating payment logos with text placeholders styled like badges */}
                        <div className="bg-blue-50 text-blue-800 text-xs flex items-center justify-center p-2 rounded font-bold">Paystack</div>
                        <div className="bg-yellow-50 text-yellow-800 text-xs flex items-center justify-center p-2 rounded font-bold">Flutterwave</div>
                        <div className="bg-gray-100 text-gray-800 text-xs flex items-center justify-center p-2 rounded font-bold">Verve</div>
                        <div className="bg-red-50 text-red-800 text-xs flex items-center justify-center p-2 rounded font-bold">Mastercard</div>
                        <div className="bg-blue-100 text-blue-900 text-xs flex items-center justify-center p-2 rounded font-bold">Visa</div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} LagosBazaar. All rights reserved. Designed for Naija.
            </div>
        </div>
    </footer>
  );
};
