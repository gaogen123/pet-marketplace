# 🐾 宠物市场后端 (Pet Marketplace Backend)

基于 **FastAPI** 构建的高性能异步宠物交易平台后端 API。

---

## 🚀 技术栈

- **框架**: [FastAPI](https://fastapi.tiangolo.com/) - 现代、快速（高性能）的 Python Web 框架。
- **数据库 ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) - 强大的 Python SQL 工具包。
- **数据库驱动**: [PyMySQL](https://github.com/PyMySQL/PyMySQL) - 纯 Python 编写的 MySQL 客户端。
- **数据验证**: [Pydantic](https://docs.pydantic.dev/) - 使用 Python 类型提示进行数据验证。
- **安全认证**: [Passlib](https://passlib.readthedocs.io/) + [Bcrypt](https://github.com/pyca/bcrypt) - 用于密码哈希和验证。
- **异步服务器**: [Uvicorn](https://www.uvicorn.org/) - 极速的 ASGI 服务器。

---

## 🛠️ 快速开始

### 1. 环境准备
确保已安装 Python 3.10+ 和 MySQL。

### 2. 安装依赖
建议在虚拟环境中运行：
```bash
# 创建虚拟环境
python3 -m venv venv
# 激活虚拟环境
source venv/bin/activate  # Windows: venv\Scripts\activate
# 安装依赖
pip install -r requirements.txt
```

### 3. 环境配置
在 `backend` 目录下创建 `.env` 文件并配置数据库连接：
```env
DATABASE_URL=mysql+pymysql://root:password@localhost/pet_marketplace
ADMIN_DATABASE_URL=mysql+pymysql://root:password@localhost/pet_marketplace_admin
```

### 4. 初始化数据库
运行以下脚本创建表并注入初始数据：
```bash
python seed.py               # 注入基础业务数据
python create_default_admin.py # 创建默认管理员账号
```

### 5. 启动服务
```bash
uvicorn app.main:app --reload
```
服务启动后，访问 [http://localhost:8000/docs](http://localhost:8000/docs) 查看交互式 API 文档 (Swagger UI)。

---

## 📂 目录结构

```text
backend/
├── app/
│   ├── main.py          # 应用入口，配置中间件和路由
│   ├── database.py      # 数据库连接与 Session 管理
│   ├── models.py        # SQLAlchemy 数据库模型
│   ├── schemas.py       # Pydantic 数据验证模型
│   └── routers/         # API 路由模块
│       ├── users.py     # 用户注册、登录、个人信息
│       ├── products.py  # 宠物/商品浏览与搜索
│       ├── cart.py      # 购物车管理
│       ├── orders.py    # 订单创建与查询
│       ├── admin.py     # 管理员后台接口
│       └── ...          # 其他模块 (分类、收藏、轮播图)
├── uploads/             # 存放用户上传的图片资源
├── seed.py              # 数据库种子脚本
└── requirements.txt     # 项目依赖清单
```

---

## 🔐 核心功能

- **用户系统**: 支持注册、登录、密码加密存储、个人信息管理。
- **商品系统**: 宠物分类浏览、详细参数展示、库存管理。
- **交易流程**: 购物车添加/删除、订单生成、订单状态追踪。
- **管理后台**: 产品发布、订单审核、用户管理、统计数据接口。
- **文件上传**: 支持宠物图片上传与静态资源服务。

---

## 📝 API 规范

- **基础路径**: `/`
- **响应格式**: 统一返回 JSON 格式。
- **文档地址**: `/docs` (Swagger) 或 `/redoc` (ReDoc)。

---
Made with 🐍 and FastAPI.
