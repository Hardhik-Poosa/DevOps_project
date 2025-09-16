import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockProducts';

const Index = () => {
  const featuredProducts = mockProducts.slice(0, 8);
  const categories = [
    { name: 'Electronics', icon: '📱', count: 156 },
    { name: 'Clothing', icon: '👕', count: 89 },
    { name: 'Home & Garden', icon: '🏠', count: 234 },
    { name: 'Sports & Fitness', icon: '🏃‍♂️', count: 67 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center text-white">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              ✨ New Collection Available
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Premium Shopping
              <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <p className="mb-8 text-lg text-white/90 sm:text-xl">
              Discover amazing products at unbeatable prices. Fast shipping, secure checkout, 
              and exceptional customer service guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Categories
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Cards */}
        <div className="absolute top-20 left-4 hidden lg:block animate-pulse">
          <Card className="w-48 shadow-glow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">4.8/5 Rating</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="absolute bottom-20 right-4 hidden lg:block animate-pulse" style={{ animationDelay: '1s' }}>
          <Card className="w-48 shadow-glow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">10K+ Happy Customers</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">Your payment information is protected</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} to="/products" className="group">
                <Card className="hover:shadow-soft transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.count} products</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked items just for you</p>
            </div>
            <Link to="/products">
              <Button variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of satisfied customers and experience the best online shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  Create Account
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
