import React from 'react';
import { X, Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemove, 
  onUpdateQuantity,
  onCheckout
}) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                <button
                  type="button"
                  className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-10">
                        <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-500">Your cart is empty.</p>
                        <button onClick={onClose} className="mt-4 text-naija-green font-medium hover:underline">Start Shopping</button>
                    </div>
                  ) : (
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((product) => (
                        <li key={product.id} className="py-6 flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-center object-cover"
                            />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                            <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{product.name}</h3>
                                <p className="ml-4">₦{(product.price * product.quantity).toLocaleString()}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border rounded-md">
                                    <button 
                                        onClick={() => onUpdateQuantity(product.id, -1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                        disabled={product.quantity <= 1}
                                    >-</button>
                                    <span className="px-2 font-medium">{product.quantity}</span>
                                    <button 
                                        onClick={() => onUpdateQuantity(product.id, 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    >+</button>
                                </div>

                                <button
                                type="button"
                                onClick={() => onRemove(product.id)}
                                className="font-medium text-red-500 hover:text-red-700 flex items-center"
                                >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                                </button>
                            </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₦{total.toLocaleString()}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                    <button
                        onClick={onCheckout}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-naija-green hover:bg-green-700"
                    >
                        Checkout <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                    or{' '}
                    <button
                        type="button"
                        className="text-naija-green font-medium hover:text-green-700"
                        onClick={onClose}
                    >
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                    </p>
                </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShoppingBagIcon = (props: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
)
