import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart, Product as CartProduct } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

type ProductForCard = CartProduct & {
  _id?: string;
  id?: string;
  image?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  price?: number | string;
};

interface ProductCardProps {
  product: ProductForCard;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  // support both Mongo _id and client id
  const productId = product._id || product.id || '';

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // cast to CartProduct so addItem signature matches
    addItem(product as CartProduct);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // implement wishlist/favorite logic as needed
    toast({
      title: 'Saved to wishlist',
      description: `${product.name} was saved.`,
    });
  };

  const renderStars = (rating = 0) => {
    const r = Number(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(r)
            ? 'fill-yellow-400 text-yellow-400'
            : i < r
            ? 'fill-yellow-400/50 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const priceNumber = Number(product.price ?? 0);

  return (
    <Link to={`/product/${productId}`}>
      <Card className="group overflow-hidden border-0 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={product.image ?? 'https://via.placeholder.com/300'}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {typeof product.stock === 'number' && product.stock > 0 && product.stock < 10 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Low Stock
            </Badge>
          )}

          {product.stock === 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">{renderStars(product.rating ?? 0)}</div>
              {typeof product.reviews !== 'undefined' && (
                <span className="text-sm text-muted-foreground">({product.reviews})</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">${priceNumber.toFixed(2)}</span>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-gradient-primary hover:bg-gradient-primary/90 transition-all duration-300"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
