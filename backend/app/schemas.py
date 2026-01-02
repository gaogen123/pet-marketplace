from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    price: float
    category: str
    image: str
    description: str
    rating: Optional[float] = 0.0
    sales: Optional[int] = 0
    stock: Optional[int] = 0

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str
    images: List[str] = []
    specs: List[str] = []

    class Config:
        orm_mode = True
        from_attributes = True

    @staticmethod
    def _extract_images(v):
        if not v: return []
        # If it's already a list of strings, return it
        if isinstance(v[0], str): return v
        return [img.url for img in v]

    @staticmethod
    def _extract_specs(v):
        if not v: return []
        if isinstance(v[0], str): return v
        return [s.spec for s in v]



    @field_validator('images', mode='before')
    @classmethod
    def validate_images(cls, v):
        if not v: return []
        # Check if it's a list of objects (SQLAlchemy models)
        if hasattr(v[0], 'url'):
            return [img.url for img in v]
        return v

    @field_validator('specs', mode='before')
    @classmethod
    def validate_specs(cls, v):
        if not v: return []
        if hasattr(v[0], 'spec'):
            return [s.spec for s in v]
        return v

class ProductList(BaseModel):
    total: int
    items: List[Product]
    page: int
    size: int

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    phone: Optional[str] = None
    role: Optional[str] = "user"

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    avatar: Optional[str] = None

class UserLogin(BaseModel):
    identifier: str # Can be email or phone
    password: str

class User(UserBase):
    id: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    role: str
    register_time: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class AdminUserBase(BaseModel):
    username: str
    email: str

class AdminUserCreate(AdminUserBase):
    password: str

class AdminUserLogin(BaseModel):
    identifier: str
    password: str

class AdminUser(AdminUserBase):
    id: str
    avatar: Optional[str] = None
    create_time: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class CartItemBase(BaseModel):
    product_id: str
    quantity: int
    selected_specs: Optional[dict] = None

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    product: Product
    selected_specs: Optional[dict] = None

    class Config:
        from_attributes = True

    @field_validator('selected_specs', mode='before')
    @classmethod
    def parse_specs(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except:
                return {}
        return v

class FavoriteBase(BaseModel):
    product_id: str

class FavoriteCreate(FavoriteBase):
    pass

class Favorite(FavoriteBase):
    id: int
    create_time: datetime
    product: Product

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: str
    quantity: int
    price: float
    selected_specs: Optional[dict] = None

class OrderItem(OrderItemBase):
    id: int
    product: Product
    selected_specs: Optional[dict] = None

    class Config:
        from_attributes = True

    @field_validator('selected_specs', mode='before')
    @classmethod
    def parse_specs(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except:
                return {}
        return v

class OrderBase(BaseModel):
    payment_method: str
    address_id: Optional[str] = None # For now we might pass full address or just ID. Let's assume we pass address details in frontend but backend might link to address table later. 
    # Actually frontend passes full address object.
    # Let's simplify: create order request will have address details.

class OrderCreate(BaseModel):
    payment_method: str
    address: dict # Simplified for now, or use Address schema if we had one.



from pydantic import model_validator
import json

class UserResetPassword(BaseModel):
    username: str
    email: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    payment_method: str
    total_amount: float
    create_time: datetime
    status: str

class Order(BaseModel):
    id: str
    order_number: str
    user_id: str
    payment_method: str
    total_amount: float
    create_time: datetime
    status: str
    address_snapshot: Optional[str] = None
    address: Optional[dict] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

    @model_validator(mode='after')
    def parse_address_snapshot(self):
        if self.address_snapshot and not self.address:
            try:
                self.address = json.loads(self.address_snapshot)
            except:
                pass
        return self

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = "blue"
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class BannerBase(BaseModel):
    title: str
    image_url: str
    description: Optional[str] = None
    link_url: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True

class Banner(BannerBase):
    id: int
    create_time: datetime

    class Config:
        from_attributes = True
