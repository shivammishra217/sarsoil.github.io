from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    id: int
    name: str
    price: float
    image: str

class CartItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

products = [
    Product(id=1, name="Extra Virgin Olive Oil", price=1199, image="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"),
    Product(id=2, name="Coconut Oil", price=999, image="https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"),
    Product(id=3, name="Avocado Oil", price=1499, image="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"),
    Product(id=4, name="Sunflower Oil", price=799, image="https://images.unsplash.com/photo-1594644465539-783d6f6bb37a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"),
]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vegetable Oil Emporium API"}

@app.get("/products", response_model=List[Product])
def get_products():
    return products

@app.post("/checkout")
def checkout(cart_items: List[CartItem]):
    total = sum(item.price * item.quantity for item in cart_items)
    return {"message": "Checkout successful", "total": total}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)