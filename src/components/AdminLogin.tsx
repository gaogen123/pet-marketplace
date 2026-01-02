import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '../types';

interface AdminLoginProps {
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

export function AdminLogin({ onClose, onLoginSuccess }: AdminLoginProps) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/users/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || '登录失败');
            }

            toast.success('管理员登录成功');
            onLoginSuccess(data);
        } catch (err: any) {
            console.error('Admin login error:', err);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">管理员后台登录</h2>
                        <p className="text-gray-500 mt-2">请输入管理员账号和密码</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                账号 (用户名/邮箱)
                            </label>
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="请输入管理员账号"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                密码
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="请输入密码"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '登录中...' : '登录后台'}
                        </button>
                    </form>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                        返回商城
                    </button>
                </div>
            </div>
        </div>
    );
}
