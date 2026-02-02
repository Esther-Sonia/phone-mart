from pydantic import BaseModel, Field
from typing import Dict


class ProductSpecs(BaseModel):
    storage: str
    ram: str
    camera: str
    screen: str


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    brand: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    image: str = Field(..., min_length=1)
    specs: ProductSpecs
    stock: int = Field(..., ge=0)


class ProductCreate(ProductBase):
    id: str = Field(..., min_length=1, max_length=50)


class ProductUpdate(BaseModel):
    name: str | None = None
    brand: str | None = None
    price: float | None = None
    image: str | None = None
    specs: ProductSpecs | None = None
    stock: int | None = None


class ProductResponse(ProductBase):
    id: str
    
    class Config:
        from_attributes = True  