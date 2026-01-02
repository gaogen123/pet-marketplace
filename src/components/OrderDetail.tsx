import { ArrowLeft, Package, Truck, MapPin, CreditCard, CheckCircle2, Circle } from 'lucide-react';
import { Order } from '../types';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onPay: (order: Order) => void;
}

const statusSteps = [
  { key: 'pending', label: '提交订单', icon: Circle },
  { key: 'paid', label: '支付成功', icon: CheckCircle2 },
  { key: 'shipped', label: '商品发货', icon: Truck },
  { key: 'completed', label: '确认收货', icon: Package }
];

export function OrderDetail({ order, onBack, onPay }: OrderDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStepIndex = () => {
    const statusOrder = ['pending', 'paid', 'shipped', 'completed'];
    return statusOrder.indexOf(order.status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回订单列表</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-gray-900 mb-8">订单详情</h1>

        {/* 订单状态进度 */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="relative">
            {/* 进度条 */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* 步骤 */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <p
                      className={`mt-3 text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 订单信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">订单信息</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">订单号：</span>
              <span className="text-gray-900 font-mono">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-gray-500">下单时间：</span>
              <span className="text-gray-700">{formatDate(order.createTime)}</span>
            </div>
            <div>
              <span className="text-gray-500">支付方式：</span>
              <span className="text-gray-700">
                {order.paymentMethod === 'wechat' ? '微信支付' : order.paymentMethod === 'alipay' ? '支付宝' : '银行卡'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">订单状态：</span>
              <span className="text-blue-600">
                {order.status === 'pending' ? '待付款' : order.status === 'paid' ? '待发货' : order.status === 'shipped' ? '待收货' : '已完成'}
              </span>
            </div>
          </div>
        </div>

        {/* 收货地址 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl text-gray-900">收货地址</h2>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-900">{order.address.name}</span>
              <span className="text-gray-600">{order.address.phone}</span>
            </div>
            <p className="text-gray-700">
              {order.address.province} {order.address.city} {order.address.district} {order.address.detail}
            </p>
          </div>
        </div>

        {/* 商品清单 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">商品清单</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={`${item.product.id}-${JSON.stringify((item as any).selected_specs || {})}`} className="flex gap-4 pb-4 border-b last:border-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{item.product.name}</h3>
                  {/* 显示已选规格 */}
                  {(item as any).selected_specs && Object.keys((item as any).selected_specs).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {Object.entries((item as any).selected_specs).map(([key, value]) => (
                        <span key={key} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                          {key}: {value as string}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">{item.product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">¥{item.product.price}</p>
                  <p className="text-sm text-gray-500 mt-1">x {item.quantity}</p>
                  <p className="text-red-600 mt-2">¥{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 费用明细 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">费用明细</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>商品金额</span>
              <span>¥{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>运费</span>
              <span className="text-green-600">包邮</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>优惠</span>
              <span className="text-red-600">-¥0.00</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-xl text-gray-900">实付款</span>
              <span className="text-3xl text-red-600">¥{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        {order.status === 'pending' && (
          <div className="bg-white border-t p-4 fixed bottom-0 left-0 right-0 z-10">
            <div className="max-w-4xl mx-auto flex justify-end items-center gap-4">
              <div className="text-right">
                <span className="text-gray-600 mr-2">应付金额:</span>
                <span className="text-2xl text-red-600 font-bold">¥{order.totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={() => onPay(order)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                立即支付
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
