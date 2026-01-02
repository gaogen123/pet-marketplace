import { ArrowLeft, Star, ShoppingCart, Heart, Package, Truck, Shield, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';

interface ProductDetailPageProps {
  product: Product;
  isFavorite: boolean;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  allProducts: Product[];
  onViewProduct: (product: Product) => void;
}

export function ProductDetailPage({
  product,
  isFavorite,
  onBack,
  onAddToCart,
  onToggleFavorite,
  allProducts,
  onViewProduct
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'detail' | 'specs' | 'reviews'>('detail');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 获取商品图片数组
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // 推荐商品（同类商品）
  const recommendedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    // Check if all specs are selected
    const groups: { [key: string]: string[] } = {};
    if (product.specs) {
      product.specs.forEach(spec => {
        const separator = spec.includes('：') ? '：' : ':';
        const parts = spec.split(separator);
        if (parts.length >= 2 && parts[0].trim() !== '') {
          const name = parts[0].trim();
          if (!groups[name]) groups[name] = [];
        } else {
          if (!groups['其他']) groups['其他'] = [];
        }
      });
    }

    const requiredGroups = Object.keys(groups);
    const missingSpecs = requiredGroups.filter(group => !selectedSpecs[group]);

    if (missingSpecs.length > 0) {
      // If there are missing specs, maybe alert user or just select first one?
      // For better UX, we should probably auto-select first option on mount or alert here.
      // Let's alert for now.
      alert(`请选择 ${missingSpecs.join(', ')}`);
      return;
    }

    const productWithSpecs = {
      ...product,
      selectedSpecs // Pass selected specs
    };

    for (let i = 0; i < quantity; i++) {
      onAddToCart(productWithSpecs);
    }
  };

  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string }>({});

  const handleSpecSelect = (name: string, value: string) => {
    setSelectedSpecs(prev => ({ ...prev, [name]: value }));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回商品列表</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 商品主要信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
            {/* 左侧图片轮播 */}
            <div className="md:col-span-2">
              {/* 主图 */}
              <div className="relative mb-4 group">
                <img
                  src={images[currentImageIndex]}
                  alt={`${product.name} - ${currentImageIndex + 1}`}
                  className="w-full aspect-square object-cover rounded-xl shadow-lg"
                />

                {/* 评分标签 */}
                <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">{product.rating}</span>
                  </div>
                </div>

                {/* 左右切换按钮 - 仅在多图时显示 */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="上一张"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="下一张"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* 图片指示器 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                          aria-label={`切换到第${index + 1}张图片`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 缩略图列表 - 仅在多图时显示 */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} 缩略图 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 bg-blue-500/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧信息 */}
            <div className="flex flex-col md:col-span-3">
              <div className="mb-6">
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mb-3">
                  {product.category}
                </div>
                <h1 className="text-3xl lg:text-4xl text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>

              <div className="mb-6 pb-6 border-b">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl text-red-600">¥{product.price}</span>
                  <span className="text-gray-400 text-xl line-through">¥{(product.price * 1.5).toFixed(0)}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">省¥{(product.price * 0.5).toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>销量：</span>
                    <span className="text-gray-700">{product.sales} 件</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>库存：</span>
                    <span className="text-gray-700">{product.stock} 件</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-700">{product.rating} 分</span>
                  </div>
                </div>
              </div>

              {/* 规格选择 */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  {(() => {
                    // Parse specs into groups
                    const groups: { [key: string]: string[] } = {};
                    product.specs.forEach(spec => {
                      const separator = spec.includes('：') ? '：' : ':';
                      const parts = spec.split(separator);
                      if (parts.length >= 2 && parts[0].trim() !== '') {
                        const name = parts[0].trim();
                        const value = parts.slice(1).join(separator).trim();
                        if (!groups[name]) groups[name] = [];
                        groups[name].push(value);
                      } else {
                        const value = spec.replace(/^[:：]/, '').trim();
                        if (!groups['其他']) groups['其他'] = [];
                        groups['其他'].push(value);
                      }
                    });

                    // Initialize selected specs if not already set
                    // Note: We can't use useState inside this render function, so we need to move this logic up or use a separate component.
                    // But for simplicity in this replacement, we will just render the UI and assume state is managed.
                    // Actually, we need to lift the state up.
                    return Object.entries(groups).map(([name, values], index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <h3 className="text-sm text-gray-900 font-medium mb-2">{name}</h3>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value, vIndex) => {
                            const isSelected = selectedSpecs[name] === value;
                            return (
                              <button
                                key={vIndex}
                                onClick={() => handleSpecSelect(name, value)}
                                className={`px-4 py-2 rounded-lg text-sm border transition-all ${isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-600 font-medium'
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                  }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* 数量选择 */}
              <div className="mb-6">
                <h3 className="mb-3 text-gray-900">购买数量</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-10 text-center border-x border-gray-300 focus:outline-none"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    （库存 {product.stock} 件）
                  </span>
                </div>
              </div>

              {/* 服务保障 */}
              <div className="mb-8">
                <h3 className="mb-3 text-gray-900">服务保障</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">全场包邮，48小时发货</span>
                  </div>
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">7天无理由退换货</span>
                  </div>
                  <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                    <Package className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">正品保证，假一赔十</span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className={`flex-shrink-0 px-6 py-4 rounded-lg border-2 transition-all ${isFavorite
                    ? 'border-pink-500 bg-pink-50 text-pink-600'
                    : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-pink-500' : ''}`} />
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 详细信息标签页 */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b">
            <div className="flex gap-8 px-8">
              <button
                onClick={() => setSelectedTab('detail')}
                className={`py-4 border-b-2 transition-colors ${selectedTab === 'detail'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                商品详情
              </button>
              <button
                onClick={() => setSelectedTab('specs')}
                className={`py-4 border-b-2 transition-colors ${selectedTab === 'specs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                规格参数
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`py-4 border-b-2 transition-colors ${selectedTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                用户评价
              </button>
            </div>
          </div>

          <div className="p-8">
            {selectedTab === 'detail' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  本产品采用优质材料制作，经过严格的质量检测，确保为您的宠物提供最好的体验。
                  我们承诺所有产品均为正品，支持7天无理由退换货，让您购物无忧。
                </p>
              </div>
            )}

            {selectedTab === 'specs' && product.specs && (
              <div className="space-y-6">
                {(() => {
                  // Parse specs into groups
                  const groups: { [key: string]: string[] } = {};
                  product.specs.forEach(spec => {
                    const separator = spec.includes('：') ? '：' : ':';
                    const parts = spec.split(separator);
                    if (parts.length >= 2 && parts[0].trim() !== '') {
                      const name = parts[0].trim();
                      const value = parts.slice(1).join(separator).trim();
                      if (!groups[name]) groups[name] = [];
                      groups[name].push(value);
                    } else {
                      // Handle cases like ":Value" or just "Value"
                      const value = spec.replace(/^[:：]/, '').trim();
                      if (!groups['其他']) groups['其他'] = [];
                      groups['其他'].push(value);
                    }
                  });

                  if (Object.keys(groups).length === 0) {
                    return <div className="text-gray-500 text-center py-8">暂无规格参数</div>;
                  }

                  return Object.entries(groups).map(([name, values], index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">{name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value, vIndex) => (
                          <span
                            key={vIndex}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-2">暂无用户评价</p>
                <p className="text-sm">成为第一个评价此商品的用户吧！</p>
              </div>
            )}
          </div>
        </div>

        {/* 推荐商品 */}
        {recommendedProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl text-gray-900 mb-6">相关推荐</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendedProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => onViewProduct(p)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-gray-900 line-clamp-2 mb-2">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">¥{p.price}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {p.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}