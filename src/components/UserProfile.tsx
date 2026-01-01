import { User, Mail, Phone, Calendar, Package, MapPin, LogOut, Edit2, Save, X } from 'lucide-react';
import { User as UserType, Order, Address } from '../types';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChangePassword } from './ChangePassword';
import { BindPhone } from './BindPhone';

interface UserProfileProps {
  user: UserType;
  orders: Order[];
  onLogout: () => void;
  onViewOrders: () => void;
  onUpdateUser: (updatedUser: UserType) => void;
  onBack: () => void;
}

export function UserProfile({ user, orders, onLogout, onViewOrders, onUpdateUser, onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>(user);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showBindPhone, setShowBindPhone] = useState(false);

  const handleSave = () => {
    if (!editedUser.username || editedUser.username.length < 2) {
      toast.error('用户名至少2个字符');
      return;
    }

    if (editedUser.phone && !/^1[3-9]\d{9}$/.test(editedUser.phone)) {
      toast.error('请输入有效的手机号');
      return;
    }

    onUpdateUser(editedUser);
    setIsEditing(false);
    toast.success('信息更新成功！');
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    // 模拟密码验证
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      let users = JSON.parse(savedUsers);
      const currentUser = users.find((u: any) => u.id === user.id);

      if (currentUser && currentUser.password === oldPassword) {
        // 更新密码
        users = users.map((u: any) =>
          u.id === user.id ? { ...u, password: newPassword } : u
        );
        localStorage.setItem('users', JSON.stringify(users));
        setShowChangePassword(false);
        toast.success('登录密码修改成功！');
      } else {
        toast.error('原密码错误');
      }
    }
  };

  const handleBindPhone = (phone: string, code: string) => {
    // 模拟验证码验证（实际应该调用后端API）
    if (code === '123456' || code.length === 6) {
      const updatedUser = { ...user, phone };
      onUpdateUser(updatedUser);
      setShowBindPhone(false);
      toast.success('手机号绑定成功！');
    } else {
      toast.error('验证码错误');
    }
  };

  // 计算订单统计
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="text-white/90 hover:text-white mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </button>

          <div className="flex items-center gap-6">
            {/* 头像 */}
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border-4 border-white/30 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12" />
                )}

                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs">更换头像</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append('file', file);

                      toast.promise(
                        fetch(`http://localhost:8000/users/${user.id}/avatar`, {
                          method: 'POST',
                          body: formData,
                        })
                          .then(async res => {
                            if (!res.ok) throw new Error('上传失败');
                            return res.json();
                          })
                          .then(data => {
                            onUpdateUser(data);
                            return '头像更新成功';
                          }),
                        {
                          loading: '正在上传...',
                          success: (msg) => msg,
                          error: '上传失败',
                        }
                      );
                    }}
                  />
                </label>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <h1 className="text-3xl mb-2">{user.username}</h1>
              <p className="text-white/80 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-white/80 text-sm mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                注册时间：{new Date(user.register_time).toLocaleDateString('zh-CN')}
              </p>
            </div>

            {/* 编辑按钮 */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                <Edit2 className="w-5 h-5" />
                编辑资料
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 基本信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-gray-900">基本信息</h2>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      取消
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* 用户名 */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 w-24">用户名</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="flex-1 text-gray-900">{user.username}</span>
                  )}
                </div>

                {/* 邮箱 */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 w-24">邮箱</span>
                  <span className="flex-1 text-gray-900">{user.email}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">不可修改</span>
                </div>

                {/* 手机号 */}
                <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 w-24">手��号</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      placeholder="请输入手机号"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="flex-1 text-gray-900">{user.phone || '未设置'}</span>
                  )}
                </div>

                {/* 注册时间 */}
                <div className="flex items-center gap-4 py-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 w-24">注册时间</span>
                  <span className="flex-1 text-gray-900">
                    {new Date(user.register_time).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>

            {/* 订单统计 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-gray-900">我的订单</h2>
                <button
                  onClick={onViewOrders}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  查看全部 →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  onClick={onViewOrders}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="text-2xl text-orange-600 mb-1">{orderStats.pending}</div>
                  <div className="text-sm text-gray-600">待支付</div>
                </div>
                <div
                  onClick={onViewOrders}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="text-2xl text-blue-600 mb-1">{orderStats.paid}</div>
                  <div className="text-sm text-gray-600">待发货</div>
                </div>
                <div
                  onClick={onViewOrders}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="text-2xl text-purple-600 mb-1">{orderStats.shipped}</div>
                  <div className="text-sm text-gray-600">待收货</div>
                </div>
                <div
                  onClick={onViewOrders}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="text-2xl text-green-600 mb-1">{orderStats.completed}</div>
                  <div className="text-sm text-gray-600">已完成</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">累计消费</span>
                  <span className="text-2xl text-red-600">¥{totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 - 快捷操作 */}
          <div className="space-y-6">
            {/* 快捷操作 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-4">快捷操作</h2>
              <div className="space-y-3">
                <button
                  onClick={onViewOrders}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="flex-1 text-left text-gray-900">我的订单</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={onBack}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="flex-1 text-left text-gray-900">返回首页</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="flex-1 text-left">退出登录</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 会员等级 */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg mb-2">会员等级</h3>
              <div className="text-3xl mb-1">普通会员</div>
              <p className="text-white/80 text-sm mb-4">
                再消费 ¥{(1000 - totalSpent).toFixed(2)} 升级为银卡会员
              </p>
              <div className="bg-white/20 backdrop-blur rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: `${Math.min((totalSpent / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* 账户安全 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-4">账户安全</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">登录密码</span>
                  <button
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    onClick={() => setShowChangePassword(true)}
                  >
                    修改
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">手机绑定</span>
                  <button
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    onClick={() => setShowBindPhone(true)}
                  >
                    {user.phone ? '修改' : '绑定'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 弹窗 */}
      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          onConfirm={handleChangePassword}
        />
      )}

      {showBindPhone && (
        <BindPhone
          currentPhone={user.phone}
          onClose={() => setShowBindPhone(false)}
          onConfirm={handleBindPhone}
        />
      )}
    </div>
  );
}