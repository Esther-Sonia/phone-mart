export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  specs: {
    storage: string;
    ram: string;
    camera: string;
    screen: string;
  };
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}