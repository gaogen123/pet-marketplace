import { Search, ShoppingCart, Heart, FileText, User, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  cartItemCount: number;
  favoriteCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  onOrdersClick: () => void;
  onFavoritesClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  user: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onSearchSubmit: () => void;
}

export function Header({
  cartItemCount,
  favoriteCount,
  onCartClick,
  onLogoClick,
  onOrdersClick,
  onFavoritesClick,
  searchTerm,
  onSearchChange,
  user,
  onLoginClick,
  onLogout,
  onProfileClick,
  onSearchSubmit
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🐾</span>
            </div>
            <span className="text-xl text-gray-900 hidden sm:block">宠物商城</span>
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <button
                onClick={onSearchSubmit}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="搜索商品..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearchSubmit();
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOrdersClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={onFavoritesClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart className="w-6 h-6 text-gray-700" />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount > 99 ? '99+' : favoriteCount}
                </span>
              )}
            </button>

            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="个人中心"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-900 hidden md:block max-w-[80px] truncate">
                    {user.username}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-6 h-6 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}