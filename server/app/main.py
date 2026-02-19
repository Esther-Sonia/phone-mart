from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base, get_db
from app.routes import products, payments
from app.utils.helpers import seed_products
from app.routes.mpesa import router as mpesa_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events - run on startup and shutdown
    """
    # Startup
    print("Starting up PhoneStore API...")
    
    # Create all database tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
    
    # Seed database with sample products
    db = next(get_db())
    try:
        seed_products(db)
    finally:
        db.close()
    
    yield
    
    # Shutdown
    print("Shutting down PhoneStore API...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for PhoneStore - Your Tech Paradise",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(payments.router)
app.include_router(mpesa_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to PhoneStore API!",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

