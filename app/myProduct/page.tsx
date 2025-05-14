"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

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

  // Perform search with debounce
  const performSearch = debounce(async (query: string) => {
    if (query.trim() === "") {
      setFiltered(products);
      return;
    }

    if (query.length < 10) {
      const q = query.toLowerCase();
      const matches = products.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
      setFiltered(matches);
      return;
    }

    // Contextual (Gemini) search
    try {
      setSearching(true);
      const res = await fetch("/api/product/gemini-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
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
  }, 500);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    performSearch(e.target.value);
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Our Products</h1>
          <p className="mt-4 text-lg text-gray-500">
            Browse our latest collection of products
          </p>
        </div>

        {/* Search bar */}
        <div className="mt-8 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-black" />
            <input
              type="text"
              placeholder="Search products or describe what you're looking for..."
              value={query}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Try searching things like &quot;comfortable bed for sleep&quot; or
            &quot;something to organize my books&quot;
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md my-8">
            <p className="text-red-800">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            {query ? (
              <p className="text-gray-500 text-lg">
                No products match your search
              </p>
            ) : (
              <p className="text-gray-500 text-lg">No products found</p>
            )}
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={product.image}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.productName}
                  </h3>
                  <p className="text-indigo-600 font-bold text-xl mb-3">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                  <button
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 cursor-pointer rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    onClick={() =>
                      router.push(
                        `/myProduct/${encodeURIComponent(product.id)}`
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searching && (
          <div className="flex justify-center items-center mt-6">
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">
              Searching with Gemini...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
