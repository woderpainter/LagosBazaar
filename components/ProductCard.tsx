import React from 'react';
import { Product } from '../types';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div 
        className="aspect-w-1 aspect-h-1 bg-gray-200 group-hover:opacity-90 cursor-pointer h-64 overflow-hidden"
        onClick={() => onClick(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-center object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {product.isNew && (
            <span className="absolute top-2 left-2 bg-naija-accent text-black text-xs font-bold px-2 py-1 rounded">
                NEW
            </span>
        )}
        {product.isBestSeller && (
            <span className="absolute top-2 right-2 bg-naija-green text-white text-xs font-bold px-2 py-1 rounded">
                BEST SELLER
            </span>
        )}
      </div>
      <div className="flex-1 p-4 space-y-2 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 cursor-pointer hover:text-naija-green" onClick={() => onClick(product)}>
            {product.name}
        </h3>
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
            ))}
            <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{product.shortDescription}</p>
        <div className="flex-1 flex items-end justify-between mt-4">
            <p className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</p>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                }}
                className="bg-gray-100 hover:bg-naija-green hover:text-white text-gray-900 p-2 rounded-full transition-colors"
            >
                <ShoppingCart className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};
