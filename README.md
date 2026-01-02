# 宠物市场 (Pet Marketplace)

一个基于 React 和 FastAPI 构建的现代化宠物交易与管理平台。该项目提供了一个美观且功能丰富的界面，用于浏览、购买宠物以及管理购物车和订单。

## 🌟 项目特点

- **现代化 UI/UX**: 使用 Radix UI 和 Tailwind CSS 构建的高质量响应式界面。
- **动态交互**: 流畅的动画和即时反馈（使用 Sonner 和 Lucide Icons）。
- **全栈架构**: 前端 React + 后端 FastAPI，确保高性能和易维护性。
- **数据可视化**: 集成 Recharts 用于展示统计数据。
- **完善的后台**: 支持管理员管理、产品发布和订单处理。

## 🛠️ 技术栈

### 前端
- **框架**: [React 18](https://reactjs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **组件库**: [Radix UI](https://www.radix-ui.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **图表**: [Recharts](https://recharts.org/)
- **状态管理/通知**: [Sonner](https://sonner.stevenly.me/)

### 后端
- **框架**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **数据库**: [MySQL](https://www.mysql.com/)
- **认证**: Passlib + Bcrypt
- **服务器**: [Uvicorn](https://www.uvicorn.org/)

## 🚀 安装与运行

### 前提条件
- Node.js (建议 v18+)
- Python 3.10+
- MySQL 数据库

### 1. 克隆项目
```bash
git clone <repository-url>
cd "Pet Marketplace"
```

### 2. 前端配置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
前端默认运行在 [http://localhost:5173](http://localhost:5173)

### 3. 后端配置
```bash
# 进入后端目录 (或者直接在根目录运行脚本)
./run_backend.sh
```
或者手动配置：
```bash
cd backend
# 创建并激活虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows 使用 venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量 (创建 .env 文件)
# DATABASE_URL=mysql+pymysql://user:password@localhost/pet_marketplace

# 启动后端
uvicorn app.main:app --reload
```
后端 API 默认运行在 [http://localhost:8000](http://localhost:8000)

### 4. 数据库初始化
你可以使用提供的脚本来初始化数据库和种子数据：
```bash
cd backend
python seed.py
python create_default_admin.py
```

## 📂 项目结构

```text
.
├── backend/            # FastAPI 后端代码
│   ├── app/            # 核心逻辑 (routers, models, schemas)
│   ├── uploads/        # 上传的图片文件
│   └── requirements.txt # 后端依赖
├── src/                # React 前端代码
│   ├── components/     # UI 组件
│   ├── pages/          # 页面视图
│   └── App.tsx         # 主入口
├── public/             # 静态资源
├── package.json        # 前端依赖
└── run_backend.sh      # 后端启动脚本
```

## 🎨 设计参考
本项目的设计灵感来源于 [Figma 设计稿](https://www.figma.com/design/r9hiS3yPEC5HkR0awHJFWI/Pet-Marketplace--Copy-)。

---
Made with ❤️ for Pet Lovers.
