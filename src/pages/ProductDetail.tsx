import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockProducts';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-400/50 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-4xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            {product.stock > 0 ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-success border-success">
                  In Stock
                </Badge>
                <span className="text-muted-foreground">
                  {product.stock} items available
                </span>
              </div>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                commodo consequat.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span className="text-muted-foreground">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">SKU:</span>
                  <span className="text-muted-foreground">PRD-{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Weight:</span>
                  <span className="text-muted-foreground">1.2 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimensions:</span>
                  <span className="text-muted-foreground">25 × 15 × 10 cm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">{renderStars(5)}</div>
                    <span className="font-medium">John Doe</span>
                  </div>
                  <p className="text-muted-foreground">
                    Great product! Exactly what I was looking for. Fast shipping and excellent quality.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">{renderStars(4)}</div>
                    <span className="font-medium">Jane Smith</span>
                  </div>
                  <p className="text-muted-foreground">
                    Very satisfied with the purchase. Good value for money.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetail;