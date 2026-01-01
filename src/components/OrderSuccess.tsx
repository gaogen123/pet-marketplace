import { CheckCircle, Package, Home, FileText } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessProps {
  order: Order;
  onBackHome: () => void;
  onViewOrder: () => void;
}

export function OrderSuccess({ order, onBackHome, onViewOrder }: OrderSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 成功提示 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl text-gray-900 mb-2">支付成功！</h1>
          <p className="text-gray-600 mb-6">您的订单已提交，我们会尽快为您发货</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">订单号</span>
              <span className="text-gray-900 font-mono">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">支付方式</span>
              <span className="text-gray-900">{order.paymentMethod === 'wechat' ? '微信支付' : order.paymentMethod === 'alipay' ? '支付宝' : '银行卡'}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">支付金额</span>
              <span className="text-2xl text-red-600">¥{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-200 my-4" />
            <div className="text-left">
              <p className="text-sm text-gray-600 mb-2">收货地址</p>
              <p className="text-gray-900">{order.address.name} {order.address.phone}</p>
              <p className="text-gray-600 text-sm">
                {order.address.province} {order.address.city} {order.address.district} {order.address.detail}
              </p>
            </div>
          </div>

          {/* 商品列表 */}
          <div className="text-left mb-6">
            <h3 className="text-lg text-gray-900 mb-3">购买商品</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.product.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">¥{item.product.price} x {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">¥{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <button
              onClick={onBackHome}
              className="flex-1 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              返回首页
            </button>
            <button
              onClick={onViewOrder}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <FileText className="w-5 h-5" />
              查看订单
            </button>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-blue-900 mb-2">配送提示</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 我们会在48小时内为您发货</li>
                <li>• 您可以在"我的订单"中查看物流信息</li>
                <li>• 支持7天无理由退换货</li>
                <li>• 如有问题，请联系客服：400-XXX-XXXX</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}