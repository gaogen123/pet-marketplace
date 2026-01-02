from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers import products, users, cart, favorites, orders, categories, banners

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Allow CORS for frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(users.router)
app.include_router(cart.router)
app.include_router(favorites.router)
app.include_router(orders.router)
app.include_router(categories.router)
app.include_router(banners.router)

from fastapi.staticfiles import StaticFiles
import os

# Create uploads directory if not exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to Pet Marketplace API"}
