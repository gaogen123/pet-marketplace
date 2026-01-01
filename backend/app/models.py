from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    phone = Column(String(20))
    avatar = Column(String(255))
    register_time = Column(DateTime, default=datetime.utcnow)
    
    orders = relationship("Order", back_populates="user")
    addresses = relationship("Address", back_populates="user")
    cart_items = relationship("CartItem", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")
    search_history = relationship("SearchHistory", back_populates="user")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), index=True)
    price = Column(Float)
    category = Column(String(50), index=True)
    image = Column(Text)
    description = Column(Text)
    rating = Column(Float, default=0.0)
    sales = Column(Integer, default=0)
    stock = Column(Integer, default=0)
    
    images = relationship("ProductImage", back_populates="product")
    specs = relationship("ProductSpec", back_populates="product")

class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(36), ForeignKey("products.id"))
    url = Column(Text)
    
    product = relationship("Product", back_populates="images")

class ProductSpec(Base):
    __tablename__ = "product_specs"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(36), ForeignKey("products.id"))
    spec = Column(String(100))
    
    product = relationship("Product", back_populates="specs")

class Address(Base):
    __tablename__ = "addresses"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"))
    name = Column(String(50))
    phone = Column(String(20))
    province = Column(String(50))
    city = Column(String(50))
    district = Column(String(50))
    detail = Column(String(200))
    is_default = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="addresses")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_number = Column(String(50), unique=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    payment_method = Column(String(50))
    total_amount = Column(Float)
    create_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="pending")
    address_snapshot = Column(Text) # Store address as JSON string
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(36), ForeignKey("orders.id"))
    product_id = Column(String(36), ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    product_id = Column(String(36), ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    
    user = relationship("User", back_populates="cart_items")
    product = relationship("Product")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    product_id = Column(String(36), ForeignKey("products.id"))
    create_time = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="favorites")
    product = relationship("Product")

class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"))
    keyword = Column(String(100))
    search_time = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="search_history")
