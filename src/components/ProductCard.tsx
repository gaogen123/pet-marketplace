import { Star, ShoppingCart, Heart, Eye, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onViewDetail: (product: Product) => void;
}

export function ProductCard({ product, isFavorite, onAddToCart, onToggleFavorite, onViewDetail }: ProductCardProps) {
  const isLowStock = (product.stock || 0) < 50;
  const isHotSale = product.sales > 1000;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
      {isHotSale && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs z-10 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          热卖
        </div>
      )}
      
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>

        {/* 悬浮操作按钮 */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="bg-white p-2.5 rounded-full hover:bg-pink-50 transition-all transform hover:scale-110"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={() => onViewDetail(product)}
            className="bg-white p-2.5 rounded-full hover:bg-blue-50 transition-all transform hover:scale-110"
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-red-600 text-xl">¥{product.price}</span>
            {isLowStock && (
              <span className="text-xs text-orange-500">仅剩 {product.stock} 件</span>
            )}
          </div>
          <span className="text-xs text-gray-400">已售 {product.sales}</span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ShoppingCart className="w-4 h-4" />
          加入购物车
        </button>
      </div>
    </div>
  );
}