import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import categoriesData from '../../category.json';

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoriesData.map((category) => (
          <Link 
            key={category.name} 
            to={`/products?category=${encodeURIComponent(category.name)}`} 
            className="group"
          >
            <Card className="hover:shadow-soft transition-all duration-300 group-hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="mx-auto mb-4 h-24 w-24 object-cover rounded"
                />
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
