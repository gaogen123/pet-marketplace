import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity, onCheckout }: CartProps) {
  if (!isOpen) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-gray-900">购物车</h2>
            <p className="text-sm text-gray-500 mt-1">共 {totalItems} 件商品</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag className="w-20 h-20 mb-4" />
              <p className="text-lg">购物车是空的</p>
              <p className="text-sm mt-2">快去挑选您喜欢的商品吧！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm flex-1 line-clamp-2 pr-2">{item.product.name}</h3>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-red-600 mb-3">¥{item.product.price}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6 space-y-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">商品金额</span>
                <span className="text-gray-900">¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">运费</span>
                <span className="text-green-600">包邮</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-gray-900">合计</span>
                <div className="text-right">
                  <p className="text-2xl text-red-600">¥{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              去结算 ({totalItems})
            </button>
          </div>
        )}
      </div>
    </>
  );
}