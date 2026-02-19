from sqlalchemy.orm import Session
from app.models.product import Product


def seed_products(db: Session):
    
    existing_products = db.query(Product).count()
    if existing_products > 0:
        print(f"Database already has {existing_products} products. Skipping seed.")
        return
    
    sample_products = [
        {
            "id": "iphone-15-pro",
            "name": "iPhone 15 Pro",
            "brand": "Apple",
            "price": 1,
            "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
            "specs": {
                "storage": "256GB",
                "ram": "8GB",
                "camera": "48MP Triple",
                "screen": "6.1\" OLED"
            },
            "stock": 15
        },
        {
            "id": "samsung-s24-ultra",
            "name": "Galaxy S24 Ultra",
            "brand": "Samsung",
            "price": 1,
            "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
            "specs": {
                "storage": "512GB",
                "ram": "12GB",
                "camera": "200MP Quad",
                "screen": "6.8\" AMOLED"
            },
            "stock": 12
        },
        {
            "id": "pixel-8-pro",
            "name": "Pixel 8 Pro",
            "brand": "Google",
            "price": 1,
            "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
            "specs": {
                "storage": "256GB",
                "ram": "12GB",
                "camera": "50MP Triple",
                "screen": "6.7\" OLED"
            },
            "stock": 20
        },
        {
            "id": "oneplus-12",
            "name": "OnePlus 12",
            "brand": "OnePlus",
            "price": 0,
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            "specs": {
                "storage": "256GB",
                "ram": "16GB",
                "camera": "50MP Triple",
                "screen": "6.8\" AMOLED"
            },
            "stock": 18
        },
        {
            "id": "xiaomi-14-pro",
            "name": "14 Pro",
            "brand": "Xiaomi",
            "price": 0,
            "image": "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400",
            "specs": {
                "storage": "512GB",
                "ram": "12GB",
                "camera": "50MP Triple",
                "screen": "6.73\" AMOLED"
            },
            "stock": 25
        },
        {
            "id": "iphone-14",
            "name": "iPhone 14",
            "brand": "Apple",
            "price": 1,
            "image": "https://images.unsplash.com/photo-1663499482523-1239786b2e77?w=400",
            "specs": {
                "storage": "128GB",
                "ram": "6GB",
                "camera": "12MP Dual",
                "screen": "6.1\" OLED"
            },
            "stock": 30
        },
        {
            "id": "samsung-a54",
            "name": "Galaxy A54",
            "brand": "Samsung",
            "price": 0,
            "image": "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400",
            "specs": {
                "storage": "256GB",
                "ram": "8GB",
                "camera": "50MP Triple",
                "screen": "6.4\" AMOLED"
            },
            "stock": 40
        },
        {
            "id": "pixel-7a",
            "name": "Pixel 7a",
            "brand": "Google",
            "price": 0,
            "image": "https://images.unsplash.com/photo-1598662779094-19d4bf5d0c4a?w=400",
            "specs": {
                "storage": "128GB",
                "ram": "8GB",
                "camera": "64MP Dual",
                "screen": "6.1\" OLED"
            },
            "stock": 35
        }
    ]
    
    for product_data in sample_products:
        product = Product(**product_data)
        db.add(product)
    
    db.commit()
    print(f"Successfully seeded {len(sample_products)} products!")