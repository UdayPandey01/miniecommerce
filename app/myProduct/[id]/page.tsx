// app/product/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  productName: string;
  price: number;
  description: string;
  image: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/product/get-product/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data.product);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError((err as Error).message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error || 'Product could not be loaded'}</p>
          <button 
            onClick={handleBackClick}
            className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={handleBackClick}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </button>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="relative h-80 md:h-full w-full">
                <Image
                  src={product.image}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h1>
              <p className="text-indigo-600 font-bold text-3xl mb-6">₹{product.price}</p>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                <div className="prose prose-sm text-gray-700">
                  <p>{product.description}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Added on: {new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;