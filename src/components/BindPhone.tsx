import { X, Phone, Hash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface BindPhoneProps {
  currentPhone?: string;
  onClose: () => void;
  onConfirm: (phone: string, code: string) => void;
}

export function BindPhone({ currentPhone, onClose, onConfirm }: BindPhoneProps) {
  const [phone, setPhone] = useState(currentPhone || '');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = () => {
    if (!phone) {
      toast.error('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error('请输入有效的手机号');
      return;
    }

    setIsSending(true);
    
    // 模拟发送验证码
    setTimeout(() => {
      setIsSending(false);
      setCountdown(60);
      toast.success('验证码已发送');
      
      // 倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      toast.error('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      toast.error('请输入有效的手机号');
      return;
    }

    if (!code) {
      toast.error('请输入验证码');
      return;
    }

    if (code.length !== 6) {
      toast.error('验证码应为6位数字');
      return;
    }

    onConfirm(phone, code);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl text-gray-900">
              {currentPhone ? '修改手机号' : '绑定手机号'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {currentPhone && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">当前绑定手机号</p>
              <p className="text-gray-900 mt-1">{currentPhone}</p>
            </div>
          )}

          {/* 手机号 */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              {currentPhone ? '新手机号' : '手机号'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="请输入手机号"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {phone && !/^1[3-9]\d{9}$/.test(phone) && phone.length === 11 && (
              <p className="text-xs text-red-500 mt-1">请输入有效的手机号</p>
            )}
          </div>

          {/* 验证码 */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">验证码</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="请输入6位验证码"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || isSending || !phone || !/^1[3-9]\d{9}$/.test(phone)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isSending ? '发送中...' : countdown > 0 ? `${countdown}秒` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-2">安全提示：</p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• 验证码将发送至您的手机</li>
              <li>• 请勿向他人透露验证码</li>
              <li>• 验证码有效期为5分钟</li>
            </ul>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              确认{currentPhone ? '修改' : '绑定'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
