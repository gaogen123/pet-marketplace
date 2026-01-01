import { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Smartphone, Wallet, CheckCircle2, Plus } from 'lucide-react';
import { Order } from '../types';

interface CheckoutProps {
  order: Order;
  onBack: () => void;
  onPay: (paymentMethod: string) => void;
}

const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: Smartphone, color: 'green' },
  { id: 'alipay', name: '支付宝', icon: Wallet, color: 'blue' },
  { id: 'card', name: '银行卡', icon: CreditCard, color: 'purple' }
];

export function Checkout({ order, onBack, onPay }: CheckoutProps) {
  const [selectedPayment, setSelectedPayment] = useState('wechat');

  const handlePay = () => {
    onPay(selectedPayment);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-gray-900 mb-8">订单支付</h1>

        {/* 订单状态提示 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-700">
            <span className="font-bold">待支付</span>
            <span>请在 30 分钟内完成支付</span>
          </div>
          <div className="text-orange-700 font-mono text-xl">
            ¥{order.totalAmount.toFixed(2)}
          </div>
        </div>

        {/* 收货地址 (只读) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl text-gray-900">收货地址</h2>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-900 font-medium">{order.address.name}</span>
              <span className="text-gray-600">{order.address.phone}</span>
            </div>
            <p className="text-gray-600 text-sm">
              {order.address.province} {order.address.city} {order.address.district} {order.address.detail}
            </p>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">商品清单</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.product.id} className="flex gap-4 pb-4 border-b last:border-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">¥{item.product.price}</p>
                  <p className="text-sm text-gray-500 mt-1">x {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 支付方式 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl text-gray-900">支付方式</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPayment === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${method.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${method.color}-600`} />
                      </div>
                      <span className="text-gray-900">{method.name}</span>
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 提交订单 */}
        <div className="bg-white rounded-xl shadow-sm p-6 sticky bottom-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">应付总额</p>
              <p className="text-2xl text-red-600">¥{order.totalAmount.toFixed(2)}</p>
            </div>
            <button
              onClick={handlePay}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              立即支付
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
