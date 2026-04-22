export interface Product {
  id: number;
  name: string;
  category: 'Camisetas' | 'Pantalones' | 'Chaquetas';
  size: 'S' | 'M' | 'L' | 'XL';
  price: number;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Camiseta Basic Essential",
    category: "Camisetas",
    size: "M",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Pantalón Chino Slim",
    category: "Pantalones",
    size: "L",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1624371414361-e6e8ea062536?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Chaqueta Oversize Lana",
    category: "Chaquetas",
    size: "XL",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Camiseta de Lino Premium",
    category: "Camisetas",
    size: "S",
    price: 34.50,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Pantalón de Lino Relajado",
    category: "Pantalones",
    size: "M",
    price: 75.00,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Chaqueta Cortavientos Urban",
    category: "Chaquetas",
    size: "L",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Camiseta Gráfica Minimal",
    category: "Camisetas",
    size: "XL",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Gabardina Clásica Beige",
    category: "Chaquetas",
    size: "M",
    price: 159.00,
    image: "https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=800&auto=format&fit=crop"
  }
];
