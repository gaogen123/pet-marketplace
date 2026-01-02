import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { CategoryFilter } from './components/CategoryFilter';
import { SortBar } from './components/SortBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderSuccess } from './components/OrderSuccess';
import { OrderList } from './components/OrderList';
import { OrderDetail } from './components/OrderDetail';
import { UserProfile } from './components/UserProfile';
import { FavoritesPage } from './components/FavoritesPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Product, CartItem, SortOption, Address, Order, User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentPage, setCurrentPage] = useState<'home' | 'detail' | 'checkout' | 'success' | 'orders' | 'orderDetail' | 'profile' | 'favorites' | 'adminDashboard'>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.role === 'admin') return 'adminDashboard';
    }
    return 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 12,
    total: 0
  });

  // Fetch products from backend with search and filter
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (selectedCategory && selectedCategory !== '全部') params.append('category', selectedCategory);
    if (user) params.append('user_id', user.id);

    // Pagination
    params.append('skip', ((pagination.page - 1) * pagination.size).toString());
    params.append('limit', pagination.size.toString());

    // Debounce search
    const timer = setTimeout(() => {
      fetch(`http://localhost:8000/products/?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (data.items) {
            setProducts(data.items);
            setPagination(prev => ({ ...prev, total: data.total }));
          } else {
            setProducts(data);
          }
        })
        .catch(err => {
          console.error('Error fetching products:', err);
          toast.error('无法连接到服务器');
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, pagination.page]);

  // Check URL for productId on mount to support direct linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    if (productId) {
      fetch(`http://localhost:8000/products/${productId}`)
        .then(res => {
          if (!res.ok) throw new Error('Product not found');
          return res.json();
        })
        .then(product => {
          setSelectedProduct(product);
          setCurrentPage('detail');
        })
        .catch(err => {
          console.error('Error loading product from URL:', err);
          toast.error('无法加载指定商品');
        });
    }
  }, []);

  // Fetch favorites from backend when user changes
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/favorites/${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Backend returns list of {id, product_id, product: {...}}
          // Frontend expects Set<string> of product IDs
          const favoriteIds = new Set<string>(data.map((item: any) => item.product_id));
          setFavorites(favoriteIds);
        })
        .catch(err => console.error('Error fetching favorites:', err));
    } else {
      setFavorites(new Set());
    }
  }, [user]);
  // Fetch orders from backend when user changes
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/orders/${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Map backend snake_case to frontend camelCase
          const formattedOrders = data.map((orderData: any) => ({
            id: orderData.id,
            orderNumber: orderData.order_number,
            items: orderData.items.map((item: any) => ({
              product: item.product,
              quantity: item.quantity
            })),
            address: orderData.address || {}, // Backend needs to return address details or we need to fetch/store it
            paymentMethod: orderData.payment_method,
            totalAmount: orderData.total_amount,
            createTime: orderData.create_time,
            status: orderData.status
          }));
          setOrders(formattedOrders);
        })
        .catch(err => console.error('Error fetching orders:', err));
    } else {
      setOrders([]);
    }
  }, [user]);
  // Fetch cart from backend when user changes
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/cart/${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Backend returns list of {id, product_id, quantity, product: {...}}
          // Frontend expects {product: {...}, quantity}
          const formattedCart = data.map((item: any) => ({
            product: item.product,
            quantity: item.quantity
          }));
          setCartItems(formattedCart);
        })
        .catch(err => console.error('Error fetching cart:', err));
    } else {
      setCartItems([]);
    }
  }, [user]);







  // 保存用户信息到 localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const filteredProducts = products
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'sales':
          return b.sales - a.sales;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const addToCart = (product: Product & { selectedSpecs?: { [key: string]: string } }) => {
    // 检查是否登录
    if (!user) {
      toast.error('请先登录后再加入购物车');
      setShowLogin(true);
      return;
    }

    fetch(`http://localhost:8000/cart/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: 1,
        selected_specs: product.selectedSpecs || null
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add to cart');
        return res.json();
      })
      .then(() => {
        toast.success(`${product.name} 已加入购物车`);
        // Refresh cart
        return fetch(`http://localhost:8000/cart/${user.id}`);
      })
      .then(res => res.json())
      .then(data => {
        const formattedCart = data.map((item: any) => ({
          product: item.product,
          quantity: item.quantity,
          selectedSpecs: item.selected_specs || {}
        }));
        setCartItems(formattedCart);
      })
      .catch(err => {
        console.error('Add to cart error:', err);
        toast.error('加入购物车失败');
      });
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;

    fetch(`http://localhost:8000/cart/${user.id}/${productId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to remove from cart');
        const item = cartItems.find(item => item.product.id === productId);
        if (item) {
          toast.info(`已移除 ${item.product.name}`);
        }
        // Refresh cart
        return fetch(`http://localhost:8000/cart/${user.id}`);
      })
      .then(res => res.json())
      .then(data => {
        const formattedCart = data.map((item: any) => ({
          product: item.product,
          quantity: item.quantity
        }));
        setCartItems(formattedCart);
      })
      .catch(err => {
        console.error('Remove from cart error:', err);
        toast.error('移除商品失败');
      });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    fetch(`http://localhost:8000/cart/${user.id}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update quantity');
        // Refresh cart
        return fetch(`http://localhost:8000/cart/${user.id}`);
      })
      .then(res => res.json())
      .then(data => {
        const formattedCart = data.map((item: any) => ({
          product: item.product,
          quantity: item.quantity
        }));
        setCartItems(formattedCart);
      })
      .catch(err => {
        console.error('Update quantity error:', err);
        toast.error('更新数量失败');
      });
  };

  const toggleFavorite = (productId: string) => {
    // 检查是否登录
    if (!user) {
      toast.error('请先登录后再收藏商品');
      setShowLogin(true);
      return;
    }

    const isFavorite = favorites.has(productId);
    const product = products.find(p => p.id === productId);

    if (isFavorite) {
      fetch(`http://localhost:8000/favorites/${user.id}/${productId}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to remove favorite');
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(productId);
            return newFavorites;
          });
          toast.info(`已取消收藏 ${product?.name}`);
        })
        .catch(err => {
          console.error('Remove favorite error:', err);
          toast.error('取消收藏失败');
        });
    } else {
      fetch(`http://localhost:8000/favorites/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to add favorite');
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.add(productId);
            return newFavorites;
          });
          toast.success(`已收藏 ${product?.name}`);
        })
        .catch(err => {
          console.error('Add favorite error:', err);
          toast.error('收藏失败');
        });
    }
  };

  const handleViewDetail = (product: Product) => {
    // 检查是否登录
    if (!user) {
      toast.error('请先登录后再查看商品详情');
      setShowLogin(true);
      return;
    }

    setSelectedProduct(product);
    setCurrentPage('detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedProduct(null);
  };

  const defaultAddresses: Address[] = [
    {
      id: '1',
      name: '张三',
      phone: '138****8888',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园中区科苑路XX号',
      isDefault: true
    },
    {
      id: '2',
      name: '李四',
      phone: '139****6666',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路XX号院XX楼',
      isDefault: false
    }
  ];

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('购物车是空的，请先添加商品');
      return;
    }
    if (!user) return;

    // Create order immediately with default address
    const defaultAddress = defaultAddresses.find(a => a.isDefault) || defaultAddresses[0];

    fetch(`http://localhost:8000/orders/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_method: 'wechat', // Default
        address: defaultAddress
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.detail || 'Order creation failed');
        }
        return res.json();
      })
      .then(orderData => {
        const order: Order = {
          id: orderData.id,
          orderNumber: orderData.order_number,
          items: orderData.items.map((item: any) => ({
            product: item.product,
            quantity: item.quantity
          })),
          address: orderData.address || defaultAddress,
          paymentMethod: orderData.payment_method,
          totalAmount: orderData.total_amount,
          createTime: orderData.create_time,
          status: orderData.status
        };
        setCurrentOrder(order);
        setOrders(prev => [order, ...prev]);
        setCartItems([]);
        setIsCartOpen(false);
        setCurrentPage('checkout');
        toast.success('订单已生成，请支付');
      })
      .catch(err => {
        console.error('Create order error:', err);
        toast.error(err.message);
      });
  };

  const handlePayOrder = (paymentMethod: string) => {
    if (!currentOrder) return;

    const payPromise = fetch(`http://localhost:8000/orders/${currentOrder.id}/pay?payment_method=${paymentMethod}`, {
      method: 'POST',
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.detail || 'Payment failed');
        }
        return res.json();
      })
      .then(orderData => {
        // Simulate delay
        return new Promise<any>(resolve => {
          setTimeout(() => {
            resolve(orderData);
          }, 1000);
        });
      })
      .then(orderData => {
        // Update local order status
        const updatedOrder = { ...currentOrder, status: 'paid' as const, paymentMethod };
        setCurrentOrder(updatedOrder);
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setCurrentPage('success');
        return '支付成功！';
      });

    toast.promise(payPromise, {
      loading: '正在支付...',
      success: (msg: string) => msg,
      error: (err: any) => `支付失败: ${err.message}`,
    });
  };

  const handleContinuePayment = (order: Order) => {
    setCurrentOrder(order);
    setCurrentPage('checkout');
  };

  const handleBackFromCheckout = () => {
    // If we came from order list (re-paying), maybe go back to orders?
    // For simplicity, go to home or orders depending on where we were?
    // Actually, if we are in checkout, we might want to go back to cart if it was a new order,
    // or back to orders if it was an existing order.
    // Let's just go back to home for now, or maybe we can improve this later.
    setCurrentPage('home');
    setIsCartOpen(true);
  };

  const handleViewOrders = () => {
    // 检查是否登录
    if (!user) {
      toast.error('请先登录后再查看订单');
      setShowLogin(true);
      return;
    }
    setCurrentPage('orders');
  };

  const handleViewFavorites = () => {
    // 检查是否登录
    if (!user) {
      toast.error('请先登录后再查看收藏');
      setShowLogin(true);
      return;
    }
    setCurrentPage('favorites');
  };

  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrderForDetail(order);
    setCurrentPage('orderDetail');
  };

  const handleViewCurrentOrder = () => {
    if (currentOrder) {
      setSelectedOrderForDetail(currentOrder);
      setCurrentPage('orderDetail');
    }
  };

  const handleBackToOrders = () => {
    setCurrentPage('orders');
    setSelectedOrderForDetail(null);
  };

  const handleLogin = (email: string, password: string) => {
    fetch('http://localhost:8000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: email, password }),
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || '登录失败');
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        setShowLogin(false);
        toast.success(`欢迎回来，${data.username}！`);
      })
      .catch(err => {
        console.error('Login error:', err);
        toast.error(err.message);
      });
  };

  const handleRegister = (username: string, email: string, password: string, phone?: string) => {
    fetch('http://localhost:8000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, phone }),
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || '注册失败');
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        setShowRegister(false);
        toast.success(`注册成功，欢迎 ${username}！`);
      })
      .catch(err => {
        console.error('Register error:', err);
        toast.error(err.message);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    toast.info('已退出登录');
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Call backend API to update user
    fetch(`http://localhost:8000/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || '更新失败');
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(data));

        // Also update the 'users' list in localStorage if it exists (legacy support)
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
          let users = JSON.parse(savedUsers);
          users = users.map((u: any) =>
            u.id === data.id ? { ...u, ...data } : u
          );
          localStorage.setItem('users', JSON.stringify(users));
        }
        toast.success('用户信息已更新');
      })
      .catch(err => {
        console.error('Update user error:', err);
        toast.error(err.message);
      });
  };

  const handleCartClick = () => {
    // 检查是否登录
    if (!user) {
      toast.error('请先登录后再查看购物车');
      setShowLogin(true);
      return;
    }
    setIsCartOpen(true);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = () => {
    console.log('handleSearchSubmit called', { user, searchTerm });
    if (!user || !searchTerm) {
      console.log('User or searchTerm missing');
      return;
    }

    fetch(`http://localhost:8000/products/search-history?keyword=${encodeURIComponent(searchTerm)}&user_id=${user.id}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .catch(err => console.error('Error saving search history:', err));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="top-center" />

      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoriteCount={favorites.size}
        onCartClick={() => {
          if (!user) {
            toast.error('请先登录');
            setShowLogin(true);
            return;
          }
          setIsCartOpen(true);
        }}
        onLogoClick={handleBackToHome}
        onOrdersClick={handleViewOrders}
        onFavoritesClick={handleViewFavorites}
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        onProfileClick={() => setCurrentPage('profile')}
        onSearchSubmit={handleSearchSubmit}
      />

      {currentPage === 'home' ? (
        <>
          <Banner />

          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="mb-2">宠物商城</h1>
              <p className="text-gray-600">为您的爱宠挑选最好的产品 · 全场包邮 · 7天无理由退换</p>
            </div>

            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            />

            <SortBar
              sortOption={sortOption}
              onSortChange={setSortOption}
              resultCount={filteredProducts.length}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.has(product.id)}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-xl mb-2">😢 没有找到相关商品</p>
                <p className="text-gray-400 text-sm">试试其他关键词或分类吧</p>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.total > 0 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  上一页
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.size)) }, (_, i) => {
                    // Simple logic to show some pages. For a real app, complex logic for many pages is needed.
                    // Here we just show first 5 or so for simplicity, or we can implement a sliding window.
                    // Let's implement a simple sliding window or just show current page context.
                    // For now, let's just show all pages if small, or a subset.
                    const totalPages = Math.ceil(pagination.total / pagination.size);
                    let startPage = Math.max(1, pagination.page - 2);
                    if (startPage + 4 > totalPages) {
                      startPage = Math.max(1, totalPages - 4);
                    }
                    const page = startPage + i;
                    if (page > totalPages) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        className={`w-10 h-10 rounded-lg border ${pagination.page === page
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(Math.ceil(pagination.total / pagination.size), prev.page + 1) }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  下一页
                </button>
                <span className="ml-4 text-gray-500 text-sm">
                  共 {pagination.total} 条商品
                </span>
              </div>
            )}
          </main>
        </>
      ) : currentPage === 'detail' ? (
        selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            isFavorite={favorites.has(selectedProduct.id)}
            onBack={handleBackToHome}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            allProducts={products}
            onViewProduct={handleViewDetail}
          />
        )
      ) : currentPage === 'checkout' && currentOrder ? (
        <Checkout
          order={currentOrder}
          onBack={handleBackFromCheckout}
          onPay={handlePayOrder}
        />
      ) : currentPage === 'success' && currentOrder ? (
        <OrderSuccess
          order={currentOrder}
          onBackHome={handleBackToHome}
          onViewOrder={handleViewCurrentOrder}
        />
      ) : currentPage === 'orders' ? (
        <OrderList
          orders={orders}
          onBack={handleBackToHome}
          onViewOrder={handleViewOrderDetail}
          onPay={handleContinuePayment}
        />
      ) : currentPage === 'orderDetail' && selectedOrderForDetail ? (
        <OrderDetail
          order={selectedOrderForDetail}
          onBack={handleBackToOrders}
          onPay={handleContinuePayment}
        />
      ) : currentPage === 'profile' && user ? (
        <UserProfile
          user={user}
          orders={orders}
          onLogout={handleLogout}
          onViewOrders={handleViewOrders}
          onUpdateUser={handleUpdateUser}
          onBack={handleBackToHome}
        />
      ) : currentPage === 'favorites' && user ? (
        <FavoritesPage
          userId={user.id}
          onToggleFavorite={toggleFavorite}
          onProductClick={handleViewDetail}
          onAddToCart={addToCart}
          onBack={handleBackToHome}
        />
      ) : currentPage === 'adminDashboard' && user ? (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
          onBackToHome={handleBackToHome}
        />
      ) : null}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleGoToCheckout}
      />

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onRegisterClick={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onForgotPasswordClick={() => {
            setShowLogin(false);
            setShowForgotPassword(true);
          }}
          onLoginSuccess={(user) => {
            setUser(user);
            setShowLogin(false);
            toast.success(`欢迎回来, ${user.username}!`);
          }}
          onAdminLoginClick={() => {
            setShowLogin(false);
            setShowAdminLogin(true);
          }}
        />
      )}

      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={(user) => {
            setUser(user);
            setShowAdminLogin(false);
            setCurrentPage('adminDashboard');
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onLoginClick={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onRegisterSuccess={() => {
            setShowRegister(false);
            setShowLogin(true);
            toast.success('注册成功，请登录');
          }}
        />
      )}

      {showForgotPassword && (
        <ForgotPassword
          onClose={() => setShowForgotPassword(false)}
          onSuccess={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}