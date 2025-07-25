import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Search, 
  Star, 
  Heart, 
  ExternalLink,
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  Eye
} from "lucide-react";

interface FlipShopProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  discount?: number;
  trending: boolean;
  description: string;
}

const DEMO_PRODUCTS: FlipShopProduct[] = [
  {
    id: "flip_001",
    name: "Wireless Bluetooth Earbuds Pro",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 2840,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "TechFlip",
    discount: 31,
    trending: true,
    description: "Premium wireless earbuds with active noise cancellation and 30-hour battery life"
  },
  {
    id: "flip_002", 
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.6,
    reviews: 1520,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Wearables",
    brand: "FlipFit",
    discount: 33,
    trending: true,
    description: "Advanced fitness tracking with heart rate monitoring and GPS"
  },
  {
    id: "flip_003",
    name: "Minimalist Leather Wallet",
    price: 45.99,
    rating: 4.9,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
    brand: "FlipStyle",
    trending: false,
    description: "Handcrafted genuine leather wallet with RFID blocking technology"
  },
  {
    id: "flip_004",
    name: "Portable Phone Charger",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.7,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "PowerFlip",
    discount: 40,
    trending: true,
    description: "Ultra-compact 10000mAh power bank with fast charging technology"
  },
  {
    id: "flip_005",
    name: "Premium Coffee Beans",
    price: 24.99,
    rating: 4.8,
    reviews: 650,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    category: "Food & Beverage",
    brand: "FlipBrew",
    trending: false,
    description: "Single-origin Ethiopian coffee beans, medium roast, 1lb bag"
  },
  {
    id: "flip_006",
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviews: 1100,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    category: "Gaming",
    brand: "FlipGaming",
    discount: 25,
    trending: true,
    description: "RGB backlit mechanical keyboard with blue switches and aluminum frame"
  }
];

const CATEGORIES = ["All", "Electronics", "Wearables", "Accessories", "Gaming", "Food & Beverage"];

export default function FlipShop() {
  const [products, setProducts] = useState<FlipShopProduct[]>(DEMO_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<FlipShopProduct[]>(DEMO_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const toggleCart = (productId: string) => {
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(productId)) {
        newCart.delete(productId);
      } else {
        newCart.add(productId);
      }
      return newCart;
    });
  };

  const ProductCard = ({ product }: { product: FlipShopProduct }) => (
    <Card className="zed-glass border-white/10 hover:border-purple-500/30 transition-all group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{product.discount}%
            </Badge>
          )}
          {product.trending && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
              <TrendingUp size={12} className="mr-1" />
              Trending
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(product.id)}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full p-0 ${
              favorites.has(product.id) 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-black/20 text-white hover:bg-red-500/20 hover:text-red-400'
            }`}
          >
            <Heart size={16} fill={favorites.has(product.id) ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-foreground">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleCart(product.id)}
              className={`flex-1 h-8 text-xs ${
                cart.has(product.id)
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                  : 'zed-button'
              }`}
            >
              <ShoppingCart size={12} className="mr-1" />
              {cart.has(product.id) ? 'In Cart' : 'Add to Cart'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 zed-button"
            >
              <Eye size={12} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Flip.Shop
            </h1>
            <p className="text-muted-foreground">Curated marketplace integration</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 zed-input"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category 
                  ? 'zed-gradient text-white' 
                  : 'zed-button'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="zed-glass border-white/10">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Package size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <p className="text-lg font-bold text-foreground">{filteredProducts.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="zed-glass border-white/10">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Heart size={20} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Favorites</p>
              <p className="text-lg font-bold text-foreground">{favorites.size}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="zed-glass border-white/10">
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ShoppingCart size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Cart</p>
              <p className="text-lg font-bold text-foreground">{cart.size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 border-t border-white/10">
        <p className="text-xs text-muted-foreground flex items-center justify-center space-x-2">
          <ExternalLink size={12} />
          <span>Integrated with Flip.Shop marketplace</span>
          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
          <span>Demo mode with sample products</span>
        </p>
      </div>
    </div>
  );
}