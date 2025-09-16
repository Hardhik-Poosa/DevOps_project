import React, { useState } from 'react';

// You might want to create a proper service for API calls
const addProduct = async (productData, token) => {
  const response = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add product');
  }

  return response.json();
};

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const productData = { name, description, price: Number(price), image, category, stock: Number(stock) };
      await addProduct(productData, token);
      
      setSuccess(true);
      // Clear form
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setCategory('');
      setStock('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Product added successfully!</p>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded"></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">Price</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium">Image URL</label>
          <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">Category</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium">Stock</label>
          <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Product</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
