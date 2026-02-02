from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("/", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    """Get all products from the database"""
    products = db.query(Product).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: str, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found"
        )
    
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    # Check if product with this ID already exists
    existing_product = db.query(Product).filter(Product.id == product_data.id).first()
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with id '{product_data.id}' already exists"
        )
    
    # Convert specs to dict for JSON storage
    product = Product(
        id=product_data.id,
        name=product_data.name,
        brand=product_data.brand,
        price=product_data.price,
        image=product_data.image,
        specs=product_data.specs.model_dump(),  # Convert Pydantic model to dict
        stock=product_data.stock
    )
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found"
        )
    
    # Update only provided fields
    update_data = product_data.model_dump(exclude_unset=True)
    
    # Convert specs if provided
    if "specs" in update_data and update_data["specs"]:
        update_data["specs"] = update_data["specs"]
    
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    """Delete a product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' not found"
        )
    
    db.delete(product)
    db.commit()
    
    return None


@router.get("/brand/{brand}", response_model=List[ProductResponse])
def get_products_by_brand(brand: str, db: Session = Depends(get_db)):
    """Get all products from a specific brand"""
    products = db.query(Product).filter(Product.brand.ilike(f"%{brand}%")).all()
    return products