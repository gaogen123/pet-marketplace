import { useState } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onBack: () => void;
  onViewOrder: (order: Order) => void;
  onPay: (order: Order) => void;
}

const statusConfig = {
  pending: { label: '待付款', color: 'orange', icon: Clock },
  paid: { label: '待发货', color: 'blue', icon: Package },
  shipped: { label: '待收货', color: 'purple', icon: Truck },
  completed: { label: '已完成', color: 'green', icon: CheckCircle }
};

export function OrderList({ orders, onBack, onViewOrder, onPay }: OrderListProps) {
  const [activeTab, setActiveTab] = useState<'all' | Order['status']>('all');

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  const tabs = [
    { key: 'all' as const, label: '全部订单' },
    { key: 'pending' as const, label: '待付款' },
    { key: 'paid' as const, label: '待发货' },
    { key: 'shipped' as const, label: '待收货' },
    { key: 'completed' as const, label: '已完成' }
  ];

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
            <span>返回首页</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-gray-900 mb-8">我的订单</h1>

        {/* 标签页 */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[100px] py-4 px-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 订单列表 */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">暂无订单</p>
            <p className="text-gray-400 text-sm">快去选购您喜欢的商品吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const StatusIcon = statusConfig[order.status].icon;
              const statusInfo = statusConfig[order.status];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* 订单头部 */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">订单号：</span>
                        <span className="text-gray-900 font-mono">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">下单时间：</span>
                        <span className="text-gray-700">{formatDate(order.createTime)}</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-${statusInfo.color}-100`}>
                      <StatusIcon className={`w-4 h-4 text-${statusInfo.color}-600`} />
                      <span className={`text-sm text-${statusInfo.color}-700`}>{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* 商品列表 */}
                  <div className="p-6">
                    <div className="space-y-4 mb-4">
                      {order.items.map(item => (
                        <div key={item.product.id} className="flex gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-gray-900 mb-1">{item.product.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.product.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900">¥{item.product.price}</p>
                            <p className="text-sm text-gray-500 mt-1">x {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 订单底部 */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span>共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品</span>
                        <span className="ml-4">实付款：</span>
                        <span className="text-red-600 text-xl ml-2">¥{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => onViewOrder(order)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        查看详情
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => onPay(order)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4"
                        >
                          立即支付
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
