"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"

interface Product {
  id: string;
  productName: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/product/get-products");
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
        const data = await res.json();
        setProducts(data.products);
        setFiltered(data.products);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim() === "") {
        setFiltered(products);
        return;
      }

      if (debouncedQuery.length < 10) {
        const q = debouncedQuery.toLowerCase();
        const matches = products.filter(
          (p) =>
            p.productName.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
        setFiltered(matches);
        return;
      }

      try {
        setSearching(true);
        const res = await fetch("/api/product/gemini-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: debouncedQuery }),
        });

        if (!res.ok) throw new Error("Failed to search with Gemini");

        const result = await res.json();
        setFiltered(result.products || []);
      } catch (err) {
        console.error("Error with Gemini search:", err);
        setError("Contextual search failed. Please try again.");
      } finally {
        setSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery, products]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  // Product skeleton for loading state
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-64 w-full bg-gray-100 animate-pulse"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-100 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-8 bg-gray-100 rounded w-1/3 mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-10 bg-gray-100 rounded w-full mt-4 animate-pulse"></div>
      </div>
    </div>
  );

  // Search indicator
  const SearchIndicator = () => (
    <div className="text-center mt-4 text-sm text-gray-500">
      Searching...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="mt-4 text-lg text-gray-500">
            Browse our latest collection of products
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-8 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or describe what you're looking for..."
              value={query}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Try searching like &quot;comfortable bed&quot; or &quot;organize books&quot;
          </p>
        </div>

        {searching && <SearchIndicator />}

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <ProductSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg my-8 max-w-lg mx-auto">
            <p className="text-red-800 text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 w-full bg-red-100 text-red-800 py-2 px-4 rounded-md hover:bg-red-200 transition-colors text-center"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg my-8 max-w-lg mx-auto">
            {query ? (
              <p className="text-gray-500 text-lg">
                No products match your search &quot;{query}&quot;
              </p>
            ) : (
              <p className="text-gray-500 text-lg">No products found</p>
            )}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className="relative h-64 w-full cursor-pointer"
                  onClick={() => router.push(`/myProduct/${encodeURIComponent(product.id)}`)}
                >
                  <Image
                    src={product.image}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {product.productName}
                  </h3>
                  <p className="text-indigo-600 font-bold text-xl mb-2">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <button
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    onClick={() => router.push(`/myProduct/${encodeURIComponent(product.id)}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}