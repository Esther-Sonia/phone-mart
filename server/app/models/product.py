from sqlalchemy import Column, String, Integer, Float, JSON
from app.database import Base


class Product(Base):

    
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    image = Column(String, nullable=False)
    specs = Column(JSON, nullable=False)  
    stock = Column(Integer, nullable=False, default=0)
    
    def __repr__(self):
        return f"<Product {self.brand} {self.name}>"