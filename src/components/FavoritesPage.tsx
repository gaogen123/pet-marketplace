import { Heart, ShoppingCart, Trash2, ArrowLeft, Search, Grid3x3, List } from 'lucide-react';
import { Product } from '../types';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface FavoritesPageProps {
  userId: string;
  onBack: () => void;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function FavoritesPage({
  userId,
  onBack,
  onToggleFavorite,
  onAddToCart,
  onProductClick
}: FavoritesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  // Fetch favorite products from backend
  useEffect(() => {
    fetch(`http://localhost:8000/favorites/${userId}`)
      .then(res => res.json())
      .then(data => {
        // data is list of {product: Product, ...}
        const products = data.map((item: any) => item.product);
        setFavoriteProducts(products);
      })
      .catch(err => {
        console.error('Error fetching favorites:', err);
        toast.error('获取收藏列表失败');
      });
  }, [userId]);

  // 筛选商品
  const filteredProducts = favoriteProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 获取分类列表
  const categories = ['全部', ...Array.from(new Set(favoriteProducts.map(p => p.category)))];

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleToggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(productId);
  };

  const handleClearAll = () => {
    if (favoriteProducts.length === 0) return;

    if (confirm(`确定要清空所有 ${favoriteProducts.length} 个收藏吗？`)) {
      favoriteProducts.forEach(product => {
        onToggleFavorite(product.id);
      });
      toast.success('已清空所有收藏');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl text-gray-900 flex items-center gap-2">
                <Heart className="w-7 h-7 text-red-500 fill-red-500" />
                我的收藏
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                共 {favoriteProducts.length} 件商品
              </p>
            </div>

            {/* 清空按钮 */}
            {favoriteProducts.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                清空收藏
              </button>
            )}
          </div>

          {/* 搜索和工具栏 */}
          {favoriteProducts.length > 0 && (
            <div className="flex items-center gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索收藏的商品..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 视图切换 */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 分类筛选 */}
        {favoriteProducts.length > 0 && categories.length > 1 && (
          <div className="max-w-7xl mx-auto px-6 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                  {category !== '全部' && (
                    <span className="ml-2 text-xs">
                      {favoriteProducts.filter(p => p.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {favoriteProducts.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">暂无收藏商品</h2>
            <p className="text-gray-500 mb-8">快去收藏您喜欢的商品吧</p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* 搜索无结果 */
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">未找到相关商品</h2>
            <p className="text-gray-500">试试其他搜索关键词</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* 网格视图 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
              >
                {/* 商品图片 */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* 收藏按钮 */}
                  <button
                    onClick={(e) => handleToggleFavorite(product.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>

                  {/* 库存标签 */}
                  {product.stock && product.stock < 10 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      仅剩 {product.stock} 件
                    </div>
                  )}
                </div>

                {/* 商品信息 */}
                <div className="p-4">
                  <h3 className="text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {product.description}
                  </p>

                  {/* 评分和销量 */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{product.rating}</span>
                    </div>
                    <div>销量 {product.sales}</div>
                  </div>

                  {/* 价格和按钮 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-red-600 text-2xl">¥{product.price}</span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      加入购物车
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 列表视图 */
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  {/* 商品图片 */}
                  <div className="relative w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {product.stock && product.stock < 10 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        仅剩 {product.stock} 件
                      </div>
                    )}
                  </div>

                  {/* 商品信息 */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* 收藏按钮 */}
                      <button
                        onClick={(e) => handleToggleFavorite(product.id, e)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                      </button>
                    </div>

                    {/* 分类标签 */}
                    <div className="mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    {/* 评分和销量 */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{product.rating} 分</span>
                      </div>
                      <div>销量 {product.sales}</div>
                      {product.stock && <div>库存 {product.stock}</div>}
                    </div>

                    {/* 底部操作区 */}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-red-600 text-3xl">¥{product.price}</span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        加入购物车
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
