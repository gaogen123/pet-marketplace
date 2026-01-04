# 🐾 宠物市场 (Pet Marketplace)

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一个基于 **React** 和 **FastAPI** 构建的现代化宠物交易与管理平台。该项目提供了一个美观且功能丰富的界面，用于浏览、购买宠物以及管理购物车和订单。

---

## 🌟 项目特点

*   **🎨 现代化 UI/UX**: 使用 **Radix UI** 和 **Tailwind CSS** 构建的高质量响应式界面。
*   **⚡ 动态交互**: 流畅的动画和即时反馈（使用 **Sonner** 和 **Lucide Icons**）。
*   **🏗️ 全栈架构**: 前端 React + 后端 FastAPI，确保高性能和易维护性。
*   **📊 数据可视化**: 集成 **Recharts** 用于展示直观的统计数据。
*   **🛠️ 完善的后台**: 支持管理员管理、产品发布、订单处理等全流程功能。

---

## 🛠️ 技术栈

### 前端
- **框架**: [React 18](https://reactjs.org/) (Vite 构建)
- **样式**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **图表**: [Recharts](https://recharts.org/)
- **状态/通知**: [Sonner](https://sonner.stevenly.me/)

### 后端
- **框架**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)
- **数据库**: [MySQL](https://www.mysql.com/)
- **认证**: Passlib + Bcrypt (JWT 认证)
- **服务器**: [Uvicorn](https://www.uvicorn.org/)

---

## 🚀 快速开始

### 🐳 Docker 部署 (推荐)

本项目支持 Docker Compose 一键部署，包含数据库、后端和前端。

1. **启动服务**
   ```bash
   docker-compose up -d
   ```
   此命令将启动：
   - MySQL 数据库 (端口 3307)
   - 商城后端 (端口 8000)
   - 商城前端 (端口 3000)
   - **共享网络**: `pet_shared_network` (供后台管理系统连接)

2. **访问应用**
   - 前端商城: [http://localhost:3000](http://localhost:3000)
   - 后端 API: [http://localhost:8000/docs](http://localhost:8000/docs)

### 🛠️ 本地开发部署

### 1. 克隆项目
```bash
git clone https://github.com/gaogen123/pet-marketplace.git
cd "Pet Marketplace"
```

### 🔗 相关仓库
- **前端商城仓库**: [pet-marketplace](https://github.com/gaogen123/pet-marketplace)
- **后台管理系统仓库**: [pet-store-mrg](https://github.com/gaogen123/pet-store-mrg)

### 2. 前端配置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
> 访问地址: [http://localhost:5173](http://localhost:5173)

### 3. 后端配置
```bash
# 一键启动脚本 (推荐)
chmod +x run_backend.sh
./run_backend.sh
```
**或者手动配置：**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

# 创建并配置 .env 文件
# DATABASE_URL=mysql+pymysql://user:password@localhost/pet_marketplace

uvicorn app.main:app --reload
```
> API 文档: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. 数据库初始化
```bash
cd backend
python seed.py               # 注入测试数据
python create_default_admin.py # 创建默认管理员
```

---

## 📂 项目结构

```text
.
├── backend/                # FastAPI 后端核心目录
│   ├── app/                # 业务逻辑 (routers, models, schemas)
│   ├── uploads/            # 用户上传资源
│   └── requirements.txt    # Python 依赖清单
├── src/                    # React 前端源代码
│   ├── components/         # 可复用 UI 组件
│   ├── pages/              # 页面视图
│   ├── assets/             # 静态资源
│   └── App.tsx             # 应用入口
├── public/                 # 公共静态文件
├── package.json            # 前端配置与依赖
└── run_backend.sh          # 后端启动便捷脚本
```

---

## 📸 项目预览

<div align="center">
  <img src="image.png" width="45%" alt="预览图 1" />
  <img src="image-1.png" width="45%" alt="预览图 2" />
  <img src="image-2.png" width="45%" alt="预览图 3" />
  <img src="image-3.png" width="45%" alt="预览图 4" />
  <img src="image-4.png" width="45%" alt="预览图 5" />
  <img src="image-5.png" width="45%" alt="预览图 6" />
</div>

